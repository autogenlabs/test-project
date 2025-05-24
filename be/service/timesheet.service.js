const db = require("../models");
const Timesheet = db.timesheet;
const WeeklyTimesheet = db.weeklyTimesheet;
const Notfication = db.notification;
const Project = db.project;
const userServices = require("../service/user.service");
const projectServices = require("../service/project.service");
const projectController = require("../controller/project.controller");
const emailService = require('../service/email.service');
// const { ADMIN, DIRECTORS, OPERATIONAL_DIRECTOR } = require("../config/roles");
const { Op } = require("sequelize");


const saveTimesheet = async (data) => {
  const { projectId, date, userId, task, time, link } = data;

  let dateOnly = new Date(date).toISOString().slice(0, 10);

  const availableTimesheet = await Timesheet.findOne({
    where: {
      [db.Sequelize.Op.and]: [
        db.Sequelize.where(
          db.Sequelize.fn("date", db.Sequelize.col("date")),
          "=",
          dateOnly
        ),
      ],
      userId,
      projectId,
    },
  });
  console.log("availableTimesheet", availableTimesheet);

  if (availableTimesheet) {
    availableTimesheet.time = (+availableTimesheet.time) + (+time);
    console.log("availableTimesheet", +availableTimesheet.time);
    console.log("+time", +time);

    await availableTimesheet.save();
    await Notfication.create({
      userId: userId,
      message: `Timesheet updated for task "${task}"`,
      link,
    });
  } else {
    await Timesheet.create({
      projectId,
      date,
      userId,
      task,
      time,
    });
  }
  const { startOfWeek } = getStartAndEndOfWeek(new Date(date));
  const weeklyTimesheet = await WeeklyTimesheet.findOne({
    where: {
      userId,
      projectId,
      weekStart: startOfWeek,
    },
  });
  if (weeklyTimesheet) {
    weeklyTimesheet.time = weeklyTimesheet.time + time;
    weeklyTimesheet.approvalStatus = "notsubmitted";
    await weeklyTimesheet.save();
    await Notfication.create({
      userId: userId,
      message: `Timesheet added for task "${task}"`,
      link,
    });
  } else {
    await WeeklyTimesheet.create({
      userId,
      projectId,
      weekStart: startOfWeek,
      time,
      approvalStatus: "notsubmitted",
    });
    await Notfication.create({
      userId: userId,
      message: `Timesheet created for task "${task}"`,
      link,
    });
  }
  return weeklyTimesheet;
};

// const saveTimesheet = async (data) => {
//   const {
//     projectId,
//     dateOfWork, // Corresponds to 'date'
//     userId,
//     activity, // Use 'activity' instead of 'task'
//     time,
//     link,
//     entryType,
//     clientId,
//     matter,
//     privateDescription,
//     showPrivate,
//     cost,
//     createdBy,
//   } = data;

//   // Ensure 'dateOfWork' is in 'YYYY-MM-DD' format
//   const dateOnly = new Date(dateOfWork).toISOString().split('T')[0]; // Format to 'YYYY-MM-DD'

//   // Find if there's already a timesheet for the same date, user, and project
//   const availableTimesheet = await Timesheet.findOne({
//     where: {
//       userId,
//       projectId,
//       // Compare date field as a plain string in 'YYYY-MM-DD' format
//       date: {
//         [db.Sequelize.Op.eq]: dateOnly,
//       },
//     },
//   });

//   console.log("availableTimesheet", availableTimesheet);

//   if (availableTimesheet) {
//     // Update the existing timesheet
//     availableTimesheet.time = (+(availableTimesheet.time || 0)) + (+time);
//     availableTimesheet.entryType = entryType;
//     availableTimesheet.clientId = clientId;
//     availableTimesheet.matter = matter;
//     availableTimesheet.activity = activity;
//     availableTimesheet.privateDescription = privateDescription;
//     availableTimesheet.showPrivate = showPrivate;
//     if(cost) availableTimesheet.cost = cost;

//     await availableTimesheet.save();

//     // Notify the user
//     await Notfication.create({
//       userId,
//       message: `Timesheet updated for activity "${activity}"`,
//       link,
//     });
//   } else {
//     // Create a new timesheet entry
//     await Timesheet.create({
//       projectId,
//       date: dateOfWork, // Store the full 'dateOfWork'
//       userId,
//       activity,
//       time,
//       entryType,
//       clientId,
//       matter,
//       privateDescription,
//       showPrivate,
//       cost,
//       createdBy,
//     });

//     const project = await projectServices.getProjectById(projectId);
//     await project.update({ ...project, labour_budget: (project.labour_budget - cost) });

//     // Notify the user
//     await Notfication.create({
//       userId,
//       message: `Timesheet created for activity "${activity}"`,
//       link,
//     });
//   } 

//   // Process Weekly Timesheet
//   const { startOfWeek } = getStartAndEndOfWeek(new Date(dateOfWork));

//   const weeklyTimesheet = await WeeklyTimesheet.findOne({
//     where: {
//       userId,
//       projectId,
//       weekStart: startOfWeek,
//     },
//   });

//   if (weeklyTimesheet) {
//     weeklyTimesheet.time = weeklyTimesheet.time + time;
//     weeklyTimesheet.approvalStatus = "notsubmitted";
//     await weeklyTimesheet.save();

//     await Notfication.create({
//       userId,
//       message: `Timesheet added for activity "${activity}"`,
//       link,
//     });
//   } else {
//     await WeeklyTimesheet.create({
//       userId,
//       projectId,
//       weekStart: startOfWeek,
//       time,
//       approvalStatus: "notsubmitted",
//     });

//     await Notfication.create({
//       userId,
//       message: `Weekly timesheet created for activity "${activity}"`,
//       link,
//     });
//   }

//   return weeklyTimesheet;
// };




// const saveTimesheet = async (data) => {
//   const { projectId, dateOfWork, date, userId, task, time, link } = data;

//   // let dateOnly = new Date(date).toISOString().slice(0, 10);

//   const availableTimesheet = await Timesheet.findOne({
//     where: {
//       [db.Sequelize.Op.and]: [
//         db.Sequelize.where(
//           db.Sequelize.fn("date", db.Sequelize.col("date")),
//           "=",
//           dateOnly
//         ),
//       ],
//       userId,
//       projectId,
//     },
//   });
//   console.log("availableTimesheet", availableTimesheet);

//   if (availableTimesheet) {
//     availableTimesheet.time = (+availableTimesheet.time) + (+time);
//     console.log("availableTimesheet", +availableTimesheet.time);
//     console.log("+time", +time);

//     await availableTimesheet.save();
//     await Notfication.create({
//       userId: userId,
//       message: `Timesheet updated for task "${task}"`,
//       link,
//     });
//   } else {
//     await Timesheet.create({
//       projectId,
//       date,
//       userId,
//       task,
//       time,
//     });
//   }
//   const { startOfWeek } = getStartAndEndOfWeek(new Date(date));
//   const weeklyTimesheet = await WeeklyTimesheet.findOne({
//     where: {
//       userId,
//       projectId,
//       weekStart: startOfWeek,
//     },
//   });
//   if (weeklyTimesheet) {
//     weeklyTimesheet.time = weeklyTimesheet.time + time;
//     weeklyTimesheet.approvalStatus = "notsubmitted";
//     await weeklyTimesheet.save();
//     await Notfication.create({
//       userId: userId,
//       message: `Timesheet added for task "${task}"`,
//       link,
//     });
//   } else {
//     await WeeklyTimesheet.create({
//       userId,
//       projectId,
//       weekStart: startOfWeek,
//       time,
//       approvalStatus: "notsubmitted",
//     });
//     await Notfication.create({
//       userId: userId,
//       message: `Timesheet created for task "${task}"`,
//       link,
//     });
//   }
//   return weeklyTimesheet;
// };

const updateTimesheetListById = async (data) => {
  const { timesheet, user, id } = data;
  console.log("Updating timesheet data:", data);

  const { id: userId } = user

  const timesheetUpd = await Timesheet.findOne({
    where: { id },
  });

  if (!timesheetUpd) {
    console.error("Timesheet not found with id:", id);
    return null;
  }

  // Keep track of the original time before updating
  const originalTime = timesheetUpd.time;
  const originalStatus = timesheetUpd.approvalStatus;

  console.log(`Original time: ${originalTime}, New time: ${timesheet.time}`);
  console.log(`Original status: ${originalStatus}, New status: ${timesheet.approvalStatus}`);

  // Update the timesheet with new values
  await timesheetUpd.update({ 
    ...timesheet,
    // Include metadata about the update
    lastEditTime: originalTime,
    lastEditDate: new Date()
  });

  // Add the original values to the response for frontend reference and calculations
  timesheetUpd.dataValues.originalTime = originalTime;
  timesheetUpd.dataValues.originalStatus = originalStatus;

  return timesheetUpd;
}

const updateTimesheetList = async (data) => {
  const { timesheet, user, } = data;
  console.log("data", data);

  const { id: userId } = user

  const timesheets = await Timesheet.bulkCreate(
    timesheet.map((sheet) => ({
      projectId: sheet.projectId,
      date: sheet.date,
      time: parseFloat(sheet.time) || 0,
      privateDescription: String(sheet.privateDescription || ''),
      userId: userId,
      activity: sheet.activity,
      id: sheet.id > 0 ? sheet.id : null,
      overtime: parseFloat(sheet.overtime) || 0,
    })),
    { updateOnDuplicate: ["projectId", "date", "time", "userId", "overtime"] }
  );

  // console.log("timesheets", timesheets);

  const allTimesheets = await getAllTimesheetsForWeek({ date: timesheet[0].date, userId });
  // console.log("allTimesheets", allTimesheets);

  const { startOfWeek } = getStartAndEndOfWeek(new Date(timesheet[0].date));
  let weeklyTimesheets = [];
  for (let sheet of timesheet) {
    // console.log("totalTimesheetTime", totalTimesheetTime);
    // console.log("startOfWeek", startOfWeek);
    // console.log("userId", userId);
    // console.log("sheet.projectId", sheet.projectId);

    const weeklyTimesheet = await updateWeeklyTimesheet({
      userId,
      startOfWeek,
      projectId: sheet.projectId, 
      overtime: sheet.overtime, 
      allTimesheets,
    })
    weeklyTimesheets.push(weeklyTimesheet);
  }

  // console.log("weeklyTimesheetsList", weeklyTimesheets);

  return timesheets
}

const updateWeeklyTimesheet = async (data) => {
  const { userId, startOfWeek, projectId, allTimesheets } = data;
  // console.log("data", data);

  const totalTimesheetTime = allTimesheets
    .filter((item) => item.projectId === projectId && item.userId === userId)
    .reduce((total, item) => total + +item.time + +item.overtime, 0);

    const overtime = allTimesheets
    .filter((item) => item.projectId === projectId && item.userId === userId)
    .reduce((total, item) => total + +item.overtime, 0);

  let weeklyTimesheet = await WeeklyTimesheet.findOne({
    where: {
      weekStart: startOfWeek,
      userId: userId,
      projectId: projectId,
    },
  });

  console.log("totalTimesheetTime", totalTimesheetTime);


  if (weeklyTimesheet) {
    // Update the existing weekly timesheet
    weeklyTimesheet.time = totalTimesheetTime;
    weeklyTimesheet.approvalStatus = 'notsubmitted';
    weeklyTimesheet.overtime = overtime;
    await weeklyTimesheet.save();
  } else {
    // Create a new weekly timesheet
    weeklyTimesheet = await WeeklyTimesheet.create({
      weekStart: startOfWeek,
      userId,
      projectId,
      time: totalTimesheetTime,
      approvalStatus: 'notsubmitted',
      comments: null,
      overtime,
    });
  }

  // console.log("weeklyTimesheetsList", weeklyTimesheets);

  return weeklyTimesheet
}

const getAllTimesheetsForWeek = async (data) => {
  const { date, userId } = data;
  const { startOfWeek, endOfWeek } = getStartAndEndOfWeek(new Date(date));
  const timesheet = await Timesheet.findAll({
    where: {
      date: {
        [db.Sequelize.Op.between]: [startOfWeek, endOfWeek]
      },
      userId
    }
  });
  return timesheet
}

const getWeeklyTimesheets = async (data) => {
  const { userId } = data
  const weeklyTimesheet = await WeeklyTimesheet.findAll({
    where: {
      userId,
    },
    raw: true
  })

  const allProjects = await Project.findAll({ raw: true })
  const allUsers = await userServices.getAllUsers()
  const timesheets = weeklyTimesheet.map((wt) => ({
    ...wt,
    projectName: allProjects.find((p) => p.id === wt.projectId)?.projectname || 'N/A',
    projectManager: getProjectManager(wt, allProjects, allUsers),
    overTime: wt.time > 37.5 ? wt.time - 37.5 : 0,
  }));
  return timesheets
}
// const getWeeklyTimesheets = async (data) => {
//   const { userId } = data
//   const weeklyTimesheet = await WeeklyTimesheet.findAll({
//     where: {
//       userId,
//     },
//     raw: true
//   })

//   const allProjects = await Project.findAll({ raw: true })
//   const allUsers = await userServices.getAllUsers()
//   const timesheets = weeklyTimesheet.map((wt) => ({
//     ...wt,
//     projectName: allProjects.find((p) => p.id === wt.projectId)?.projectname || 'N/A',
//     projectManager: getProjectManager(wt, allProjects, allUsers),
//   }));
//   return timesheets
// }

const getProjectManager = (wt, allProjects, allUsers) => {
  const project = allProjects.find((p) => p.id === wt.projectId);
  if (!project) return null
  const projectManagerName = allUsers.find((u) => u.id === +project.project_manager) || {
    name: "N/A",
  };
  return projectManagerName.name;
}

const getTimesheetList = async (data) => {

  const { user, startOfWeek, endOfWeek } = data;

  const { id: userId } = user
  const status = "inprogress"
  const allProjectsList = await projectController.getAllProjectswithMembers(userId, status)
  // console.log("allProjectsList", allProjectsList);
  console.log("startOfWeek", startOfWeek, "endOfWeek", endOfWeek);

  const timesheets = await Timesheet.findAll({
    where: {
      userId,
      date: {
        [db.Sequelize.Op.between]: [startOfWeek, endOfWeek],
      },
    },
    raw: true,
  });

  // console.log("timesheets2", timesheets);

  const weeklyTimesheet = await WeeklyTimesheet.findAll({
    where: {
      userId,
      projectId: allProjectsList.map((p) => p.id),
      weekStart: startOfWeek,
      userId,
    },
    raw: true
  })

  console.log("weeklyTimesheet", weeklyTimesheet);


  const timesheetMap = new Map();
  weeklyTimesheet.forEach((timesheet) => {
    timesheetMap.set(timesheet.projectId, timesheet);
  });

  // Iterate over all projects and create an empty timesheet if it doesn't exist
  allProjectsList.forEach((project) => {
    if (!timesheetMap.has(project.id)) {
      // Create an empty timesheet for the project
      timesheetMap.set(project.id, {
        projectId: project.id,
        weekStart: new Date(startOfWeek).toISOString().split('T')[0],
        time: 0,
        approvalStatus: 'notsubmitted',
        // Add other necessary fields here
      });
    }
  });

  const weeklyTimesheetArray = Array.from(timesheetMap.values());

  // console.log("weeklyTimesheetArray", weeklyTimesheetArray);

  const allProjects = await Project.findAll({
    where: { id: weeklyTimesheetArray.map((t) => t.projectId) },
    raw: true,
  });
  const allUsers = await userServices.getAllUsers()
  const timesheetsWithData = weeklyTimesheetArray.map((wt) => ({
    ...wt,
    projectName: allProjects.find((p) => p.id === wt.projectId)?.projectname || 'N/A',
    projectManager: getProjectManager(wt, allProjects, allUsers),
  }));

  console.log("timesheetsWithData", timesheetsWithData);


  const finalTimesheets = mergeTimesheets(timesheetsWithData, timesheets);

  // console.log("finalTimesheets", finalTimesheets);
  const sortedFinalTimesheets = finalTimesheets.sort((a, b) => a.projectId - b.projectId);

  return sortedFinalTimesheets;
};

const getAdminTimesheetList = async (data) => {
  const { user, startOfWeek, endOfWeek } = data;
  const { id: userId } = user
  console.log("startOfWeek", startOfWeek, "endOfWeek", endOfWeek);
  const allProjectsList = await Project.findAll({
    where: {
      status: "inprogress",
    },
    raw: true,
  });

  // console.log("allProjectsList", allProjectsList);

  const timesheets = await Timesheet.findAll({
    // where: {
    //   date: {
    //     [db.Sequelize.Op.between]: [startOfWeek, endOfWeek],
    //   },
    //   // userId,
    // },
    raw: true,
  });

  // console.log("timesheets2", timesheets);

  const weeklyTimesheet = await WeeklyTimesheet.findAll({
    where: {
      projectId: allProjectsList.map((p) => p.id),
      // weekStart: startOfWeek,
      userId,
    },
    raw: true
  })

  // Create a map of project id to weekly timesheet
  const timesheetMap = new Map();
  weeklyTimesheet.forEach((timesheet) => {
    timesheetMap.set(timesheet.projectId, timesheet);
  });

  // Iterate over all projects and create an empty timesheet if it doesn't exist
  allProjectsList.forEach((project) => {
    if (!timesheetMap.has(project.id)) {
      // Create an empty timesheet for the project
      timesheetMap.set(project.id, {
        projectId: project.id,
        // weekStart: new Date(startOfWeek).toISOString().split('T')[0],
        time: 0,
        approvalStatus: 'notsubmitted',
        // Add other necessary fields here
      });
    }
  });

  const weeklyTimesheetArray = Array.from(timesheetMap.values());
  // Convert the map values to an array and return

  // console.log("weeklyTimesheet", weeklyTimesheet);
  const allProjects = await Project.findAll({
    where: { id: weeklyTimesheetArray.map((t) => t.projectId) },
    raw: true,
  });
  const allUsers = await userServices.getAllUsers()
  const timesheetsWithData = weeklyTimesheetArray.map((wt) => ({
    ...wt,
    projectName: allProjects.find((p) => p.id === wt.projectId)?.projectname || 'N/A',
    projectManager: getProjectManager(wt, allProjects, allUsers),
  }));

  // console.log("timesheetsWithData", timesheetsWithData);

  const finalTimesheets = mergeTimesheets(timesheetsWithData, timesheets);

  // console.log("finalTimesheets", finalTimesheets);
  const sortedFinalTimesheets = finalTimesheets.sort((a, b) => a.projectId - b.projectId);

  return sortedFinalTimesheets;
};

const getDirectorTimesheetList = async (data) => {
  const { user, startOfWeek, endOfWeek } = data;
  const { id: userId } = user

  const allUsers = await userServices.getAllUsers()
  const userIds = allUsers.filter(user => user.lineManagers == userId).map(user => user.id);
  const timesheet = await Timesheet.findAll({
    where: {
      userId: {
        [Op.in]: [...userIds, userId],
      }
    },
    include: [
      {
        model: db.project,
        as: 'project',
        attributes: ['projectname', 'client_name', 'status'],
        include: [
          {
            model: db.user,
            as: 'manager', 
            attributes: ['name', 'email'],
          },
          {
            model: db.projectMembers,
            as: 'projectMember', 
            attributes: ['memberId'],
            include: [
              {
                model: db.user,
                as: 'user', 
                attributes: ['name', 'email'],
              }
            ]
          },
        ],
      },
    ],
  });

  return timesheet;
};

const getTimesheetByProjId = async (projectId, userId = null) => {
  try {
    let whereClause = { projectId };
    
    // If userId is provided, filter by user
    if (userId) {
      whereClause.userId = userId;
    }
    
    return await Timesheet.findAll({
      where: whereClause,
      include: [
        {
          model: db.user,
          as: 'user', 
          attributes: ['id', 'name', 'email', 'access'],
        },
        {
          model: db.project,
          as: 'project',
          attributes: ['id', 'projectname', 'client_name'],
        }
      ],
      order: [['date', 'DESC']],
    });
  } catch (error) {
    console.error("Error fetching timesheets:", error);
    return [];
  }
}


const mergeTimesheets = (weeklyTimesheet, dailyTimesheets) =>
  weeklyTimesheet.map((week) => {
    return {
      ...week,
      timesheets: dailyTimesheets.filter(
        (day) => (
          day.projectId === week.projectId &&
          new Date(day.date).toISOString().split('T')[0] >= new Date(week.weekStart).toISOString().split('T')[0] &&
          new Date(day.date).toISOString().split('T')[0] <=
          new Date(new Date(week.weekStart).getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        )
      ),
    };
});


const getTimesheets = async (data) => {
  const { date = 'all', userId, projectId = null, role } = data;

  console.log(role, " ==rolerole ", userId);

  const { startOfWeek, endOfWeek } = getStartAndEndOfWeek(new Date(date));
  let whereClause = {};

  if(role == 'Admin'){}
  else if (role !== 'Operational Director' || role !== 'Directors') {
    whereClause["userId"] = userId;
    // whereClause["createdBy"] = userId;
  }
  if (projectId) whereClause["projectId"] = projectId;
  if (date !== 'all') {
    whereClause["date"] = {
      [db.Sequelize.Op.between]: [startOfWeek, endOfWeek],
    };
  }

  const timesheet = await Timesheet.findAll({
    where: whereClause,
    include: [
      {
        model: db.project,
        as: 'project',
        attributes: ['projectname', 'client_name', 'status'],
        include: [
          {
            model: db.user,
            as: 'manager', 
            attributes: ['name', 'email'],
          },
          {
            model: db.projectMembers,
            as: 'projectMember', 
            attributes: ['memberId'],
            include: [
              {
                model: db.user,
                as: 'user', 
                attributes: ['name', 'email'],
              }
            ]
          },
        ],
      },
    ],
  });

  return timesheet;
};


// const getTimesheets = async (data) => {
//   // const user = req.user;
//   const { date='all', userId, projectId = null, role, } = data;

//   console.log(role, " ==rolerole ", userId);
  

//   const { startOfWeek, endOfWeek } = getStartAndEndOfWeek(new Date(date));
//   let whereClause = {
//     // userId,
//     // date
//   };

//   if(role !== 'Admin'){
//     whereClause["userId"] = userId;
//     whereClause["createdBy"] = userId;
//   }
//   if(projectId) whereClause["projectId"] = projectId;
//   if(date !== 'all') whereClause["date"] = {
//     [db.Sequelize.Op.between]: [startOfWeek, endOfWeek]
//   };
//   const timesheet = await Timesheet.findAll({
//     where: whereClause,
//   });
//   return timesheet
// }

const getTimesheet = async (data) => {
  const { date, userId, projectId } = data;
  console.log({ date, userId, projectId })
  const timesheet = await Timesheet.findOne({
    where: {
      userId,
      projectId,
      date: new Date(date),
    }
  });
  return timesheet
}

function getStartAndEndOfWeek(dateObject) {
  const offset = dateObject.getTimezoneOffset() * 60 * 1000;
  const utcDate = new Date(dateObject.getTime() + offset);
  const dayOfWeek = utcDate.getDay();
  const diff = dayOfWeek >= 1 ? dayOfWeek - 1 : 6;
  const startOfWeekUTC = new Date(utcDate);
  startOfWeekUTC.setDate(utcDate.getDate() - diff);
  startOfWeekUTC.setHours(0, 0, 0, 0);
  const endOfWeekUTC = new Date(startOfWeekUTC);
  endOfWeekUTC.setDate(startOfWeekUTC.getDate() + 6);
  endOfWeekUTC.setHours(23, 59, 59, 999);

  const startOfWeek = new Date(startOfWeekUTC.getTime() - offset);
  const endOfWeek = new Date(endOfWeekUTC.getTime() - offset);
  return { startOfWeek, endOfWeek };
}

const updateTimesheetStatus = async (data) => {
  const { projectId, date, user, approvalStatus, link } = data;
  const { id: userId, name, lineManagers, access } = user
  const { startOfWeek } = getStartAndEndOfWeek(new Date(date));
  console.log("link", link);

  if (access === 'Admin' || access === 'Project Management' || access === 'Directors' || access === 'Operational Director') {
    const updatedTimesheet = await updateWeeklyTimesheetStatus({
      userId,
      projectId,
      startOfWeek,
      approvalStatus: "approved",
    });
    await projectServices.calculateProjectValues(projectId)
    await Notfication.create({
      userId,
      message: `Timesheet approved automatically`,
      link,
    });
    return updatedTimesheet
  } else {
    const updatedTimesheet = updateWeeklyTimesheetStatus({
      userId,
      projectId,
      startOfWeek,
      approvalStatus,
    });
    if (updatedTimesheet) {
      await Notfication.create({
        userId: lineManagers,
        message: `New timesheet submitted by ${name}`,
        link: "/requesttimesheet",
      });
      await Notfication.create({
        userId: userId,
        message: `Timesheet submitted to manager`,
        link,
      });
    }
    return updatedTimesheet
  }
}

const updateWeeklyTimesheetStatus = async ({ userId, projectId, startOfWeek, approvalStatus }) => {
  const updatedTimesheet = await WeeklyTimesheet.update(
    { approvalStatus },
    {
      where: {
        userId,
        projectId,
        weekStart: startOfWeek,
      },
    }
  );
  return updatedTimesheet[0];
}

const updateAllTimesheetStatus = async (data) => {
  const { weeklyTimesheets, user, approvalStatus, link, } = data
  // console.log("weeklyTimesheets", weeklyTimesheets);
  const sheet = weeklyTimesheets[0];

  // const { projectId, date } = data;
  const { id: userId, name, lineManagers, access, email } = user
  // const { startOfWeek } = getStartAndEndOfWeek(new Date(weeklyTimesheets?.[0]?.weekStart));

  // console.log("startOfWeek", startOfWeek);
  // console.log("link", link);


  if (['Admin', 'Directors', 'Operational Director'].includes(access)) {
    const { project, timesheet } = await projectServices.calculateProjectValuesForTimesheet(sheet.projectId, sheet);

    const message = `Timesheet has been approved for project "${project.projectname}" automatically`;

    await Notfication.create({
      userId,
      message,
      link,
    });
    await emailService.sendEmail(email, `Timesheet approved`, message);
    return timesheet
  } else {
    const updatedTimesheet = updateTimesheetStatusToSubmitted(sheet, "submitted");
    if (updatedTimesheet) {
      await Notfication.create({
        userId: lineManagers,
        message: `New timesheet submitted by ${name}`,
        link: "/requesttimesheet",
      });
      await Notfication.create({
        userId: userId,
        message: `Timesheet submitted to manager`,
        link,
      });
    }
    return updatedTimesheet
  }
}

const updateAllWeeklyTimesheetStatus = async ({ userId, weeklyTimesheets, startOfWeek, approvalStatus }) => {
  console.log("approvalStatus", approvalStatus);
  console.log("userId", userId);
  console.log("startOfWeek", startOfWeek);

  const updatedTimesheet = await WeeklyTimesheet.update(
    { approvalStatus },
    {
      where: {
        // userId,
        projectId: weeklyTimesheets.map(t => t.projectId),
        approvalStatus: 'notsubmitted',
        weekStart: startOfWeek,
      },
    }
  );
  const updatedTimesheetCor = await Timesheet.update(
    { approvalStatus },
    {
      where: {
        // userId,
        projectId: weeklyTimesheets.map(t => t.projectId),
        approvalStatus: 'notsubmitted',
        // weekStart: startOfWeek,
      },
    }
  );
  console.log("updatedTimesheet", updatedTimesheet);
  console.log("updatedTimesheetCor", updatedTimesheetCor);

  return updatedTimesheet[0];
}

const updateTimesheetStatusToSubmitted = async (sheet, approvalStatus) => {
  const updatedTimesheetCor = await Timesheet.update(
    { approvalStatus },
    {
      where: { id: sheet.id, },
    }
  );
  // console.log("updatedTimesheet", updatedTimesheet);
  console.log("updatedTimesheetCor", updatedTimesheetCor);

  return updatedTimesheetCor;
}

const getAllPendingTimesheets = async (data) => {
  const { userId } = data

  const allUsers = await userServices.getLineManagerSubordinates(userId.toString())
  const timesheet = await WeeklyTimesheet.findAll({
    where: {
      approvalStatus: "submitted",
      userId: allUsers.map(u => u.id)
    },
    raw: true
  });

  const allProjects = await Project.findAll({ raw: true })

  const updatedTimesheet = timesheet.map(t => {
    return {
      ...t,
      userName: allUsers.find(u => u.id === t.userId).name,
      projectName: allProjects.find(p => p.id === t.projectId).projectname,
      overTime: t.time > 37.5 ? t.time - 37.5 : 0
    }
  })

  const allTimesheets = []
  await Promise.all(updatedTimesheet.map(async ts => {
    const { startOfWeek, endOfWeek } = getStartAndEndOfWeek(new Date(ts.weekStart))
    const timesheets = await Timesheet.findAll({
      where: {
        userId: ts.userId,
        projectId: ts.projectId,
        date: {
          [db.Sequelize.Op.between]: [startOfWeek, endOfWeek],
        },
      },
      raw: true,
    });
    allTimesheets.push(...timesheets)
  }))
  // console.log("updatedTimesheet", updatedTimesheet);
  // console.log("allTimesheets", allTimesheets);
  // console.log("allUsers", allUsers);
  const finalTimesheets = mergeTimesheets(updatedTimesheet, allTimesheets);
  console.log("finalTimesheets", finalTimesheets);

  return finalTimesheets
}

const getAllPendingTimesheetsForAdmin = async () => {
  const allUsers = await userServices.getAllUsers()

  const timesheet = await WeeklyTimesheet.findAll({
    where: {
      approvalStatus: "submitted",
    },
    raw: true
  });

  const allProjects = await Project.findAll({ raw: true })

  const updatedTimesheet = timesheet.map(t => {
    return {
      ...t,
      userName: allUsers.find(u => u.id === t.userId).name,
      projectName: allProjects.find(p => p.id === t.projectId).projectname,
      overTime: t.time > 37.5 ? t.time - 37.5 : 0
    }
  })


  const allTimesheets = []
  await Promise.all(updatedTimesheet.map(async ts => {
    const { startOfWeek, endOfWeek } = getStartAndEndOfWeek(new Date(ts.weekStart))
    const timesheets = await Timesheet.findAll({
      where: {
        userId: ts.userId,
        projectId: ts.projectId,
        date: {
          [db.Sequelize.Op.between]: [startOfWeek, endOfWeek],
        },
      },
      raw: true,
    });
    allTimesheets.push(...timesheets)
  }))
  console.log("updatedTimesheet", updatedTimesheet);
  console.log("allTimesheets", allTimesheets);
  console.log("allUsers", allUsers);
  const finalTimesheets = mergeTimesheets(updatedTimesheet, allTimesheets);
  console.log("finalTimesheets", finalTimesheets);

  return finalTimesheets
}

const updateTimesheetStatusByManager = async (data) => {
  const { approvalStatus, timesheetId, projectId, comments, userId } = data

  if (approvalStatus === "approved") {
    const timeS = await Timesheet.findByPk(timesheetId);
    // await projectServices.calculateProjectValues(+projectId, { id: timesheetId, projectId })
    const { project, timesheet } = await projectServices.calculateProjectValuesForTimesheet(projectId, timeS.dataValues);
    return timesheet;
  }
  else {
    const timesheet = await Timesheet.update(
      {
        approvalStatus,
      },
      {
        where: {
          id: timesheetId,
        },
      },
    );
    console.log("timesheet", timesheet);
    return timesheet;
  }
}

const getProjectTimesheets = async (projectId, approvalStatus, userIds) => {
  const timesheets = await WeeklyTimesheet.findAll({
    where: {
      projectId,
      approvalStatus,
      userId: userIds
    },
    raw: true
  });
  return timesheets
}

const deleteTimesheets = async (data) => {
  console.log("data", data);
  const { timesheet } = data
  await WeeklyTimesheet.destroy({
    where: {
      id: timesheet.id
    }
  });
  const deletedTimesheets = await Timesheet.destroy({
    where: {
      id: timesheet.timesheets.map(t => t.id)
    }
  })

  await projectServices.calculateProjectValues(timesheet.projectId)

  return deletedTimesheets
}

const deleteTimesheetsByAdminAndDirector = async (id) => {
  // console.log("data", data);
  // const { id, } = data

  const deletedTimesheets = await Timesheet.destroy({
    where: {
      id: id,
    }
  });

  return deletedTimesheets
}

module.exports = {
  saveTimesheet,
  getTimesheets,
  getTimesheet,
  getWeeklyTimesheets,
  updateTimesheetStatus,
  getAllPendingTimesheets,
  updateTimesheetStatusByManager,
  getProjectTimesheets,
  getAllPendingTimesheetsForAdmin,
  getTimesheetList,
  updateTimesheetList,
  getAdminTimesheetList,
  updateAllTimesheetStatus,
  getProjectManager,
  deleteTimesheets,
  updateWeeklyTimesheet,
  getStartAndEndOfWeek,
  getAllTimesheetsForWeek,
  updateTimesheetListById,
  getDirectorTimesheetList,
  getTimesheetByProjId,
  updateTimesheetStatusToSubmitted,
  deleteTimesheetsByAdminAndDirector,
};
