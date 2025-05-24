const projectService = require("../service/project.service");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const userServices = require("../service/user.service");
const notificationService = require('../service/notification.service');
const userService = require("../service/user.service");
const emailService = require("../service/email.service");

const getAllProjects = catchAsync(async (req, res) => {
  const allProjects = await projectService.getAllProjects();
  const projects = await getProjectsWithManagers(allProjects);
  res.send({ projects });
});

const getProjectsWithManagers = async (allProjects) => {
  const projects = await Promise.all(
    allProjects.map(async (project) => {
      const projectManagerJSON = project.toJSON();

      const projectManager = await userServices.getUserById(
        +projectManagerJSON.project_manager
      );

      projectManagerJSON.project_manager_name = projectManager?.name
      return projectManagerJSON;
    })
  );
  return projects
}


const saveProject = catchAsync(async (req, res) => {
  // const userId = req.user.id;
  const project = await projectService.saveProject(req.body);
  const projectMember1 = await projectService.addProjectOwner(project.id, project.project_manager, project.project_manager == req.user.id);
  const projectMember2 = await projectService.addProjectOwner(project.id, project.director_id, project.director_id == req.user.id);
  let projectMember3 = null;
  if(project.director_id != req.user.id && project.project_manager != req.user.id){
    projectMember3 = await projectService.addProjectOwner(project.id, req.user.id, true);
  }
  // const projectManager = await userServices.getUserById(projectMember1.memberId);
  // const projectDirector = await userServices.getUserById(projectMember2.memberId);
  // projectManager.isOwner = true;
  
  await notificationService.createNotification({
    userId: req.user.id,
    message: `New Project "${project.projectname}" created.`,
    link: `/projects`,
  })
  res.send({ project, members: [projectMember1, projectMember2] });
});

const updateProject = catchAsync(async (req, res) => {
  const project = await projectService.updateProjectById(req.params.id, req.body);
  if (!project) {
    res.send({
      "message": "Project not found",
    })
    return;
  }

  const isProjectMember = await projectService.getProjectMember(project.id, project.project_manager)
  if(!isProjectMember)
   await projectService.addProjectOwner(project.id, project.project_manager);

  await notificationService.createNotification({
    userId: req.user.id,
    message: `Project "${project.projectname}" updated.`,
    link: `/projects`,
  })
  res.send({ project });
})

const updateProjectStatus = catchAsync(async (req, res) => {
  const project = await projectService.updateProjectStatus({
    ...req.body,
    user: req.user,
  });
  if (!project) {
    res.send({
      "message": "Project not found",
    })
    return;
  }
  res.send({ project });
})

const deleteProject = catchAsync(async (req, res) => {
  const deleted = await projectService.deleteProjectById(req.params.id);
  if (!deleted) {
    res.send({
      "message": "Project not found",
    })
    return;
  }
  res.status(httpStatus.NO_CONTENT).send();
});

const deleteProjectRequest = catchAsync(async (req, res) => {
  const project = await projectService.deleteProjectRequest(req.params.id, req.user);
  if (!project) {
    res.send({
      "message": "Project not found",
    })
    return;
  }
  res.send({ project });
});

const addProjectMembers = catchAsync(async (req, res) => {
  const { projectId, members } = req.body;
  const project = await projectService.getProjectById(projectId);

  const projectMembers = await projectService.addProjectMembers(
    project,
    members
  );
  if (!project)
    res.status(httpStatus.NOT_FOUND).send({
      message: "Project not found",
    });
 else {
   const link = `/projects`;

   await notificationService.createBulkNotifications(
     members,
     `You have been added to a project "${project.projectname}" by ${req.user.name}`,
     link
   );

   const message = `You have been added to a project "${project.projectname}" by ${req.user.name}`;
   await Promise.all(members.map(async (memberId) => {
    const user = await userService.getUserById(memberId);
    console.log("user", user?.email);
    if (user) {
      await emailService.sendEmail(user.email, `You have been added to a project "${project.projectname}"`, message);
    }
  }));
    const message2 =`You have added members to a project "${project.projectname}"`;

   await notificationService.createNotification({
     userId: req.user.id,
     message: message2,
     link: `/projects`,
   });

   await emailService.sendEmail(req.user.email, `You have added members to a project "${project.projectname}"`, message2);

   const users = await userServices.getUsers(
     projectMembers.map((pm) => pm.memberId)
   );
   res.send({ members: users });
 }
});

const getProjectMembers = catchAsync(async (req, res) => {
  const projectMembers = await projectService.getProjectMembers(req.params.id)
  const members = await userServices.getUsers(projectMembers.map(pm => pm.memberId))
  const projectOwner = projectMembers.find(pm => pm.isOwner);
  if(!projectOwner) return res.send({ members });
  const owner = members.find(m => m.id === projectOwner.memberId)
  owner.isOwner = true
  res.send({ members });
});

const getProjectsById = async (req, res) => {
  const projects = await getAllProjectswithMembers(req.user.id)
  if (req.user.access === "General") {
    const limitedProjects = projects.map(getSpecificProjectFields)
    res.send({ projects: limitedProjects });
  } else {
    res.send({ projects });
  }
};

const getAllProjectswithMembers = async (id, status) => {
  const projectMembers = await projectService.getProjectsId(id);
  const allProjects = status ? await projectService.getInProgressProjects(projectMembers.map(pm => pm.projectId)) : await projectService.getProjects(projectMembers.map(pm => pm.projectId));
  const projectOwner = projectMembers.filter(pm => pm.isOwner)
  const projects = await allProjectsWithOwners(allProjects, projectOwner)
  return projects;
}

const getSpecificProjectFields = (project) => {
  const {
    id,
    projectname,
    project_manager,
    project_manager_name,
    company,
    start_date,
    finish_date,
    director,
  } = project;
  return {
    id,
    projectname,
    project_manager,
    project_manager_name,
    company,
    start_date,
    finish_date,
    director,
  };
}

const allProjectsWithOwners = async (allProjects, projectOwners) => {
  const projects = await Promise.all(
    allProjects.map(async (project) => {
      const isOwner = projectOwners.some((po) => po.projectId === project.id);
      const projectManagerJSON = project.toJSON();
      const projectManager = await userServices.getUserById(
        +projectManagerJSON.project_manager
      );
      if (isOwner) {
        projectManagerJSON.isOwner = true;
      }
      projectManagerJSON.project_manager_name = projectManager?.name
      return projectManagerJSON;
    })
  );
  return projects
}

const getAllProjectRequests = async (req, res) => {
  const requests = await projectService.getAllProjectRequests();
  res.send({ requests });
};

const updateProjectRequests = async (req, res) => {
  const request = await projectService.updateProjectRequest({
    ...req.body,
    user: req.user,
  });
  res.send({ request });
};

module.exports = {
  getAllProjects,
  saveProject,
  deleteProject,
  updateProject,
  addProjectMembers,
  getProjectMembers,
  getProjectsById,
  getAllProjectswithMembers,
  updateProjectStatus,
  getAllProjectRequests,
  updateProjectRequests,
  deleteProjectRequest,
}
