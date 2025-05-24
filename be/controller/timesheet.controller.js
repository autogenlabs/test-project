const timesheetService = require('../service/timesheet.service');
const catchAsync = require('../utils/catchAsync');
const httpStatus = require("http-status");
const notificationService = require('../service/notification.service');
const emailService = require('../service/email.service');
const userService = require('../service/user.service');
// const { ADMIN, OPERATIONAL_DIRECTOR, DIRECTORS } = require('../config/roles');

const saveTimesheet = catchAsync(async (req, res) => {
  // let timesheet = await timesheetService.getTimesheet({ ...req.body, userId: req.user.id });
  // if (timesheet) {
  //   res.status(httpStatus.CONFLICT).send({
  //     "message": "Timesheet already exists",
  //   })
  // } else {
    const timesheet = await timesheetService.saveTimesheet({ ...req.body, userId: req.user.id });
    res.send({ timesheet });
  // }
})

const getTimesheets = catchAsync(async (req, res) => {
  if(req.user.access === "Directors" || req.user.access === "Project Management"){
    const timesheet = await timesheetService.getDirectorTimesheetList({ user: req.user, startOfWeek: req.query.startOfWeek, endOfWeek: req.query.endOfWeek }); 
    res.send({ timesheet });
  }
  else {
    const timesheet = await timesheetService.getTimesheets({ userId: req.user.id, projectId: req.query.projectId, date: req.query.date, role: req.user.access });
    res.send({ timesheet });

  }
})

const getTimesheetsByProjectId = catchAsync(async (req, res) => {
  if(["Admin", "Directors", "Project Management", "Operational Director"].includes(req.user.access)){
    const userId = req.query.userId; // Get userId from query params
    const timesheet = await timesheetService.getTimesheetByProjId(req.params.projId, userId);
    res.send({ data: timesheet });
  }
  else {
    res.send({ data: [], });
  }
})

const getWeeklyTimesheets = catchAsync(async (req, res) => {
  const timesheet = await timesheetService.getWeeklyTimesheets({ userId: req.user.id});
  res.send({ timesheet });
})

const getTimesheetList = catchAsync(async (req, res) => {
  if (req.user.access === 'Admin' || req.user.access === 'Operational Director') {
    console.log("1q312312312313123143124sdvsd");
    const timesheet = await timesheetService.getAdminTimesheetList({ user: req.user, startOfWeek: req.query.startOfWeek, endOfWeek: req.query.endOfWeek });
    res.send({ timesheet });
  } else if(req.user.access === 'Directors'){
    const timesheet = await timesheetService.getDirectorTimesheetList({ user: req.user, startOfWeek: req.query.startOfWeek, endOfWeek: req.query.endOfWeek });
    res.send({ timesheet });
  } 
  else {
    const timesheet = await timesheetService.getTimesheetList({ user: req.user, startOfWeek: req.query.startOfWeek, endOfWeek: req.query.endOfWeek });
    res.send({ timesheet });
  }
})

const submitTimesheetToLinemanager = catchAsync(async (req, res) => {
  const updatedTimesheet = await timesheetService.updateTimesheetStatus({
    ...req.body,
    user: req.user,
    approvalStatus: "submitted",
  });
  if (updatedTimesheet) {
    res.send({ updatedTimesheet });
    return;
  } else {
    res.status(httpStatus.CONFLICT).send({
      message: "Timesheet already submitted",
    });
    return;
  }
});

const submitAllTimesheetsToLinemanager = catchAsync(async (req, res) => {
  const updatedTimesheet = await timesheetService.updateAllTimesheetStatus({
    ...req.body,
    user: req.user,
    approvalStatus: "submitted",
  });
  if (updatedTimesheet) {
    res.send({ updatedTimesheet });
    return;
  } else {
    res.status(httpStatus.CONFLICT).send({
      message: "Timesheet already submitted",
    });
    return;
  }
});

const getAllPendingTimesheets = catchAsync(async (req, res) => {
  if (req.user.access === "Admin" || req.user.access === "Operational Director") {
    const timesheets = await timesheetService.getAllPendingTimesheetsForAdmin();
    res.send({ timesheets });
  } else {
    const timesheets = await timesheetService.getAllPendingTimesheets({
      userId: req.user.id,
    });
    res.send({ timesheets });
  }
})

const changeTimesheetStatus = catchAsync(async (req, res) => {
  const updatedTimesheet = await timesheetService.updateTimesheetStatusByManager({
    ...req.body,
    user: req.user,
  });

  if (updatedTimesheet) {
    const {
      approvalStatus,
      link
    } = req.body

    const message = `Timesheet sheet has been ${approvalStatus} for project ${req.body.projectName} by ${req.user.name}`;
    const user = await userService.getUserById(req.body.userId);
    await emailService.sendEmail(user.email, `Timesheet ${approvalStatus}`, message);
    await notificationService.createNotification({
      userId: req.body.userId,
      message,
      link,
    })
    res.send({ updatedTimesheet });
    return;
  } else {
    res.status(httpStatus.CONFLICT).send({
      message: "Timesheet already submitted",
    });
    return;
  }
})

const updateTimesheetList = catchAsync(async (req, res) => {
  const updatedTimesheet = await timesheetService.updateTimesheetList({
    ...req.body,
    user: req.user,
  });
  if (updatedTimesheet) {
    res.send({ updatedTimesheet });
    return;
  } else {
    res.status(httpStatus.CONFLICT).send({
      message: "Timesheet already submitted",
    });
    return;
  }
})

const updateTimesheetListById = catchAsync(async (req, res) => {
  const updatedTimesheet = await timesheetService.updateTimesheetListById({
    ...req.body,
    id: req.params.id,
    user: req.user,
  });
  if (updatedTimesheet) {
    res.send({ updatedTimesheet });
    return;
  } else {
    res.status(httpStatus.CONFLICT).send({
      message: "Timesheet already submitted",
    });
    return;
  }
})

const updateWeeklyTimesheet = catchAsync(async (req, res) => {
  const { timesheet } = req.body;
  // console.log("timesheet", timesheet);
  const { startOfWeek } = timesheetService.getStartAndEndOfWeek(new Date(timesheet[0].date));
  const allTimesheets = await timesheetService.getAllTimesheetsForWeek({ date: timesheet[0].date, userId: req.user.id });

  const updatedTimesheet = await timesheetService.updateWeeklyTimesheet({
    userId: req.user.id,
    startOfWeek,
    projectId: timesheet[0].projectId,
    allTimesheets,
    overtime: timesheet[0].overtime,
  });
  if (updatedTimesheet) {
    res.send({ updatedTimesheet });
    return;
  } else {
    res.status(httpStatus.CONFLICT).send({
      message: "Timesheet already submitted",
    });
    return;
  }
})

const deleteTimesheets = catchAsync(async (req, res) => {
  const deletedTimesheets = await timesheetService.deleteTimesheets({ ...req.body, user: req.user });
  if(deletedTimesheets) {
    getAllPendingTimesheets(req, res)
  } else {
    res.status(httpStatus[500]).send({
      message: "Timesheet not deleted",
    });
  }
})

const deleteTimesheetsByDirAndAdmin = catchAsync(async (req, res) => {
  if(["Admin", "Directors"].includes(req.user.access)){
    const deletedTimesheets = await timesheetService.deleteTimesheetsByAdminAndDirector(req.params.id);
  }
  res.send({
    message: "Timesheet deleted",
  });
})

module.exports = {
  saveTimesheet,
  getTimesheets,
  getWeeklyTimesheets,
  submitTimesheetToLinemanager,
  getAllPendingTimesheets,
  changeTimesheetStatus,
  getTimesheetList,
  updateTimesheetList,
  submitAllTimesheetsToLinemanager,
  deleteTimesheets,
  updateWeeklyTimesheet,
  updateTimesheetListById,
  getTimesheetsByProjectId,
  deleteTimesheetsByDirAndAdmin,
};
