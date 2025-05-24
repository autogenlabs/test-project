const db = require("../models");
const Project = db.project;
const Timesheet = db.timesheet;
const WeeklyTimesheet = db.weeklyTimesheet;
const ExpenseSheet = db.expenseSheets;
const ProjectMembers = db.projectMembers;
const Requests = db.requests;
const User = db.user;
const notificationService = require('../service/notification.service');

const userServices = require("../service/user.service");

const getAllProjects = async () => {
  return await Project.findAll({ 
    order: [['createdAt']], 
    include: [{ 
      model: User, 
      as: 'directors',
      attributes: ["id", "name", "email", "access"],
    }],
  });
};

const saveProject = async (params) => {
  const { projectname, total_fee, labour_budget, client_contact_email,
    work_type, organization, client_name, chargeable_project, start_date,
    budget, project_manager, company, multiplier, client_number, director, director_id,
    budget_level, client_title, client_phone, finish_date, work_location, po_number, status, projectcode
  } = params
  const projectData = {
    projectname, total_fee, labour_budget, client_contact_email,
    work_type, organization, client_name, chargeable_project, start_date,
    budget, project_manager, company, multiplier, client_number, director, director_id,
    budget_level, client_title, client_phone, finish_date, work_location, po_number, status, projectcode
  }
  const project = await Project.create(projectData)
  return project
}

const getProjectById = async (id) => Project.findOne({ where: { id } });

const getProjectNameById = async (id) => {
  const project = await getProjectById(id);
  if (!project) return null
  return project.projectname
}

const updateProjectById = async (id, params) => {
  const project = await getProjectById(id);
  if (!project) return null
  const { projectname, total_fee, labour_budget, client_contact_email,
    work_type, organization, client_name, chargeable_project, start_date,
    budget, project_manager, company, multiplier, client_number, director, director_id,
    budget_level, client_title, client_phone, finish_date, work_location, po_number
  } = params
  const projectData = {
    projectname, total_fee, labour_budget, client_contact_email,
    work_type, organization, client_name, chargeable_project, start_date,
    budget, project_manager, company, multiplier, client_number, director, director_id,
    budget_level, client_title, client_phone, finish_date, work_location, po_number
  }
  await project.update(projectData)
  return project
}

const updateProjectStatus = async (data) => {
  const { status, projectId, user, } = data
  const { id: userId, name, access } = user

  const project = await getProjectById(projectId);
  if (!project) return null

  if (access === 'Admin' || access === "Operational Director") {
    const projectData = {
      status
    }
    await project.update(projectData)
    await notificationService.createNotification({
      userId,
      message: `Project "${project.projectname}" status changed to ${status}.`,
      link: `/projects`,
    })
    return project
  } else if (access === 'Project Management' || access === 'Directors' || access === 'Operational Director') {
    const request = await Requests.create({
      projectId,
      requestedBy: userId,
      requestedStatus: status,
      previousStatus: project.status
    });
    const projectData = {
      status: 'pending'
    }
    await project.update(projectData)
    const userIds = await userServices.getAllAdmins().then((users) => {
      return users.map((user) => user.id)
    })
    await notificationService.createBulkNotifications(
      userIds,
      `User "${name}" requested to change the status of project "${project.projectname}" to ${status}.`,
      `/requests`,
    )
    return project;
  }
}

const getAllProjectRequests = async () => {
  const requests = await Requests.findAll({
    where: { approved: false },
    raw: true,
  });
  const updatedRequests = [];

  for (let i = 0; i < requests.length; i++) {
    const request = requests[i];
    const user = await userServices.getUserById(request.requestedBy)
    // console.log("user", user.name);
    const project = await getProjectById(request.projectId)
    if(project){
      console.log("project", project.projectname);
  
      updatedRequests.push({
        ...request,
        userName: user.name,
        projectName: project.projectname
      });
    }
  }
  // const updatedRequests = await Promise.all(requests.map(async (request) => {
  //   console.log("request requestedBy", request.requestedBy);
  //   console.log("request projectId", request.projectId);

  //   const user = await userServices.getUserById(request.requestedBy)
  //   console.log("user", user.name);
  //   const project = await getProjectById(request.projectId)
  //   if(project){
  //     console.log("project", project.projectname);
  
  //     return {
  //       ...request,
  //       userName: user.name,
  //       projectName: project.projectname
  //     };
  //   }
  // }));

  return updatedRequests
}

const updateProjectRequest = async (data) => {
  const { request, status, user } = data
  const { id, requestedStatus, previousStatus, projectId } = request
  const project = await getProjectById(projectId);
  if (!project) return null
  if (requestedStatus === 'delete') {
    if (status) {
      await deleteProjectById(projectId)
    } else {
      const projectData = {
        delete_pending: false
      };
      await project.update(projectData)
    }

    await notificationService.createNotification({
      userId: request.requestedBy,
      message: `Project ${project.projectname} delete request has been ${status ? "approved" : "rejected"} by admin ${user.name}.`,
      link: `/projects`,
    })

  } else {
    const projectData = {
      status: status ? requestedStatus : previousStatus
    };
    await project.update(projectData)
    await notificationService.createNotification({
      userId: request.requestedBy,
      message: `Project ${project.projectname} ${request.requestedStatus} status ${status ? "approved" : "rejected"} by admin ${user.name}.`,
      link: `/projects`,
    })

  }
  const updatedData = { approved: true, };
  await Requests.update(updatedData, {
    where: { id: request.id },
    returning: true
  });
  return project
}

const deleteProjectById = async (id) => {
  const project = await getProjectById(id);
  if (!project) return null
  await Timesheet.destroy({
    where: {
      projectId: id,
    }
  })
  await ExpenseSheet.destroy({
    where: {
      projectId: id,
    }
  })
  await Project.destroy({
    where: {
      id: project.id,
    },
  });
  return project;
};

const deleteProjectRequest = async (id, user) => {
  const { id: userId, name, access } = user
  const project = await getProjectById(id);
  if (!project) return null
  const isAlradyExist = await Requests.findAll({
    where: {
      projectId: id,
    }
  })
  if(!isAlradyExist || isAlradyExist.length === 0){
    await Requests.create({
      projectId: id,
      requestedBy: userId,
      requestedStatus: "delete",
      previousStatus: ""
    });
    const projectData = {
      delete_pending: true
    }
    await project.update(projectData)
    const userIds = await userServices.getAllAdmins().then((users) => {
      return users.map((user) => user.id)
    })
    await notificationService.createBulkNotifications(
      userIds,
      `${name} requested to delete the project ${project.projectname}.`,
      `/requests`,
    )
  }
  return project;
}

// const addProjectMembers = async (project, memberIds) => {
//   const members = await ProjectMembers.bulkCreate(memberIds.map(id => ({
//     projectId: project.id,
//     memberId: id,
//     isOwner: false,
//   })))
//   return members
// }

const addProjectMembers = async (project, memberIds) => {
  // Find all existing members in the project
  const existingMembers = await ProjectMembers.findAll({
    where: {
      projectId: project.id,
    },
  });

  // Extract the memberIds that are already part of the project
  const existingMemberIds = existingMembers.map(member => member.memberId);

  // Find members to remove (those in the project but not in memberIds)
  const membersToRemove = existingMemberIds.filter(id => !memberIds.includes(id));

  // Find members to add (those in memberIds but not already in the project)
  const membersToAdd = memberIds.filter(id => !existingMemberIds.includes(id));

  // Remove members who are no longer part of the project
  if (membersToRemove.length > 0) {
    await ProjectMembers.destroy({
      where: {
        projectId: project.id,
        memberId: membersToRemove,
      },
    });
  }

  // Add new members to the project
  if (membersToAdd.length > 0) {
    const newMembers = await ProjectMembers.bulkCreate(
      membersToAdd.map(id => ({
        projectId: project.id,
        memberId: id,
        isOwner: false,
      }))
    );

    return newMembers;
  }

  return [];
}

const addProjectOwner = async (projectId, ownerId, isOwner) => {
  return await ProjectMembers.create({ projectId, memberId: ownerId, isOwner: isOwner })
}

const getProjectMembers = async (projectId) => {
  return await ProjectMembers.findAll({ 
    where: { projectId }, 
    include: [{ 
      model: User, 
      as: 'user',
      attributes: ["id", "name",],
    }],
  })
}

const getProjectsId = async (memberId) => {
  return await ProjectMembers.findAll({ where: { memberId } });
};

const getProjects = async (projectIds) => {
  const projects = await Project.findAll({
    where: { id: projectIds },
    include: [{
      model: User,
      as: 'directors',
      attributes: ["id", "name", "email", "access"],
    }],
  });
  return projects
}

const getInProgressProjects = async (projectIds) => {
  const projects = await Project.findAll({
    where: { id: projectIds, status: "inprogress", },
  });
  return projects
}

const calculateProjectValues = async (projectid, sheet) => {
  const project = await getProjectById(projectid)

  // console.log("project", project);
  // const projectMembers = await getProjectMembers(project.id);
  // console.log("projectMembers", projectMembers);
  const whereOfTimeSheet = {
    approvalStatus: "approved",
  };
  if(sheet && sheet.id) {
    whereOfTimeSheet["id"] = sheet.id
  }
  else {
    whereOfTimeSheet["projectId"] = project.id;
  }
  if(sheet && sheet.approvalStatus) whereOfTimeSheet["approvalStatus"] = sheet.approvalStatus;
  const allTimeSheet = await Timesheet.findAll({
    where: whereOfTimeSheet,
    // {
    //   projectId: project.id,
    //   approvalStatus: "notsubmitted",
    //   // userId: projectMembers.map((pm) => pm.memberId)
    // },
    raw : true
  });

  const weektimesheets = await WeeklyTimesheet.findAll({
    where: {
      projectId: project.id,
      approvalStatus: "approved",
      // userId: projectMembers.map((pm) => pm.memberId)
    },
    raw : true
  });
  // console.log("timesheets", weektimesheets);

  const expenseSheets = await ExpenseSheet.findAll({
    where: {
      projectId: project.id,
      approvalStatus: "approved",
    },
    raw : true
  });
  console.log("expenseSheets", expenseSheets);


  const members = await userServices.getUsers(
    allTimeSheet.map((pm) => pm.userId)
  );
  console.log("members", members);

  const memberEffort = members.map(
    (m) =>
      m.blendedRate *
      project.multiplier *
      allTimeSheet
        .filter((t) => t.userId === m.id)
        .reduce((a, b) => a + b.time, 0)
  );
  console.log("memberEffort", memberEffort);

  const labour_effort = memberEffort.reduce((a, b) => {
    if(isNaN(a) || isNaN(b)) return 0;
    return a + b;
  }, 0);
  // console.log("labour_effort", labour_effort);

  const expense_effort = expenseSheets.reduce((a, {expense}) => a + +expense, 0);
  // console.log("expense_effort", expense_effort);

  const totalHours = allTimeSheet.reduce((a, b) => a + b.time, 0);
  // console.log("totalHours", totalHours);

  const labour_varience = project.total_fee - labour_effort;
  // console.log("labour_varience", labour_varience);

  const expense_varience = project.total_fee - expense_effort;
  // console.log("expense_varience", expense_varience);
  const budget_varience = project.total_fee - (labour_effort + expense_effort);
  // console.log("budget_varience", budget_varience);

  const percentage = 100 - ((budget_varience * 100) / project.total_fee);
  // console.log(`percentage ${percentage.toFixed(2)}%`);

  const avg_rate_multiplier =
    labour_effort / totalHours || 0;
  // console.log("avg_rate_multiplier", avg_rate_multiplier.toFixed(2));
  const labour_budget_varience = project.labour_budget - labour_effort;
  // console.log("labour_budget_varience", labour_budget_varience);
  const labour_expense_varience = project.budget - expense_effort;
  // console.log("labour_expense_varience", labour_expense_varience);
  const projectData = {
    labour_varience,
    expense_varience,
    budget_varience,
    percentage: percentage.toFixed(2),
    avg_rate_multiplier: avg_rate_mutiplier.toFixed(2),
    labour_budget_varience,
    labour_expense_varience,
    labour_effort,
    expense_effort,
  };
  console.log("projectData", projectData);
  await project.update(projectData);
};

const calculateProjectValuesForTimesheet = async (projectid, sheet) => {
  const project = await getProjectById(projectid)

  const timesheet = await Timesheet.findByPk(sheet.id);
  timesheet.approvalStatus = 'approved';


  const members = await userServices.getUserById(sheet.userId);
  // console.log("members", members);

  const time = Number(sheet.time);
  const blendedRate = Number(members.blendedRate);
  const projMultiplier = Number(project.multiplier);

  const labourEffort = time * blendedRate * projMultiplier;
  const labourBudgetVarience = project.labour_budget - labourEffort;
  const totalBudgetVarience = (project.dataValues.budget_varience || project.dataValues.total_fee) - labourEffort;
  const avergaHourlyRate = blendedRate * projMultiplier;
  const percentage = 100 - ((totalBudgetVarience * 100) / project.dataValues.total_fee);

  project.labour_effort = (project.labour_effort || 0) + labourEffort;
  project.labour_budget_varience = (project.dataValues.labour_budget_varience || 0) + labourBudgetVarience;
  project.budget_varience = totalBudgetVarience;
  project.avg_rate_multiplier = (project.dataValues.avg_rate_multiplier || 0) + avergaHourlyRate;
  project.percentage = percentage;

  //save 
  await project.save();
  await timesheet.save();

  return { project, timesheet, };
};

const calculateProjectValuesForExpenseSheet = async (projectid, sheet, alreadyApproved) => {
  const project = await getProjectById(projectid)

  if(!alreadyApproved){
    const expenseSheet = await ExpenseSheet.findByPk(sheet.id);
    expenseSheet.approvalStatus = 'approved';
    await expenseSheet.save();
  }

  const expenseEffort = sheet.expense;
  // const labourExpenseVarience = project.dataValues.budget - expenseEffort;
  const totalBudgetVarience = (project.dataValues.budget_varience || project.dataValues.total_fee) - expenseEffort;
  const percentage = 100 - ((totalBudgetVarience * 100) / project.dataValues.total_fee);
  
  project.expense_varience = (project.dataValues.expense_varience || project.dataValues.budget) - expenseEffort;
  project.budget_varience = totalBudgetVarience;
  project.expense_effort = expenseEffort;
  // project.avg_rate_multiplier = (project.dataValues.avg_rate_multiplier || 0) + avergaHourlyRate;
  project.percentage = percentage;
  
  //save 
  await project.save();

  return { project, sheet, };
};


const calculateExpenseSheetValues = async (projectId, expenseSheetId) => {
  try {
    // Fetch the project by id
    const project = await getProjectById(projectId);
    if (!project) throw new Error('Project not found');

    // Fetch the specific expense sheet by id and projectId
    const expenseSheet = await ExpenseSheet.findOne({
      where: { id: expenseSheetId, projectId },
      // Removed `raw: true` to get a Sequelize model instance
    });
    if (!expenseSheet) throw new Error('Expense sheet not found');

    // Update the expense sheet's approvalStatus to 'approved'
    await expenseSheet.update({ approvalStatus: 'approved' });


    // Calculate the variance between total fee and total expenses
    const expenseVariance = project.total_fee - expenseSheet.expense;

    // Calculate budget variance (difference between the total project budget and the sum of expenses)
    const budgetVariance = project.total_fee - expenseSheet.expense;

    // Calculate percentage of budget used
    const percentageUsed = 100 - (budgetVariance * 100) / project.total_fee;

    // Prepare project data for update
    const projectData = {
      expense_effort: expenseSheet.expense,
      expense_variance: expenseVariance,
      budget_variance: budgetVariance,
      percentage: percentageUsed.toFixed(2),
    };

    console.log('Updated Project Data:', projectData);

    // Update the project with calculated values
    await project.update(projectData);

  } catch (error) {
    console.error('Error calculating expense sheet values:', error);
    throw error;
  }
};



const getProjectMember = async (projectId,memberId) => ProjectMembers.findOne({ where: { projectId, memberId } });

module.exports = {
  getAllProjects,
  saveProject,
  deleteProjectById,
  getProjectNameById,
  updateProjectById,
  addProjectOwner,
  addProjectMembers,
  getProjectMembers,
  getProjectsId,
  getProjects,
  calculateProjectValues,
  getProjectById,
  updateProjectStatus,
  getInProgressProjects,
  getProjectMember,
  getAllProjectRequests,
  updateProjectRequest,
  deleteProjectRequest,
  calculateExpenseSheetValues,
  calculateProjectValuesForTimesheet,
  calculateProjectValuesForExpenseSheet,
}
