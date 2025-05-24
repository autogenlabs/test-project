const expenseSheetService = require('../service/expenseSheet.service');
const catchAsync = require('../utils/catchAsync');
const httpStatus = require("http-status");
const notificationService = require('../service/notification.service');
const emailService = require('../service/email.service');
const userService = require('../service/user.service');
// const { PROJECT_MANAGER, DIRECTORS, ADMIN, OPERATIONAL_DIRECTOR } = require('../config/roles');

const getExpenseSheetList = catchAsync(async (req, res) => {
  if (req.user.access === "Admin" || req.user.access === "Operational Director") {
    const expenseSheet = await expenseSheetService.getAdminExpenseSheetList({ user: req.user, month: req.query.month });
    return res.send({ expenseSheet });
  } 
  else if (req.user.access === "Directors") {
    const expenseSheet = await expenseSheetService.getAllExpenseSheetsForDirector({ directorId: req.user.id, month: req.query.month });
    return res.send({ expenseSheet });
  } 
  else {
    const expenseSheet = await expenseSheetService.getExpenseSheetList({ user: req.user, month: req.query.month });
    return res.send({ expenseSheet });
  }
})

const createExpenseSheet = catchAsync(async (req, res) => {
  const expenseSheet = await expenseSheetService.addExpenseSheet({ userId: req.user.id, access: req.user.role, ...req.body, month: req.body.date });
  res.send({ expenseSheet });
})

const submitAllExpenseSheetsToLinemanager = catchAsync(async (req, res) => {
  const updatedExpenseSheet = await expenseSheetService.updateAllExpenseSheetStatus({
    ...req.body,
    user: req.user,
    approvalStatus: "submitted",
  });
  if (updatedExpenseSheet) {
    res.send({ updatedExpenseSheet });
    return;
  } else {
    res.status(httpStatus.CONFLICT).send({
      message: "Expense sheet already submitted",
    });
    return;
  }
});

const getAllPendingExpenseSheets = catchAsync(async (req, res) => {
  if (req.user.access === 'Admin' || req.user.access === 'Operational Director') {
    const expenseSheets = await expenseSheetService.getAllPendingExpenseSheetsForAdmin();
    res.send({ expenseSheets });
  } 
  else if (req.user.access === 'Directors' || req.user.access === 'Project Management') {
    const expenseSheets = await expenseSheetService.getAllPendingExpenseSheetsForDirectorOfUser({ directorId: req.user.id });
    res.send({ expenseSheets });
  } 
  else {
    const expenseSheets = await expenseSheetService.getAllPendingExpenseSheets({
      userId: req.user.id,
    });
    res.send({ expenseSheets });
  }
})

const changeExpenseSheetStatus = catchAsync(async (req, res) => {
  const updatedExpenseSheet = await expenseSheetService.updateExpenseSheetStatusByManager({
    ...req.body,
    user: req.user,
  });

  if (updatedExpenseSheet) {
    const {
      approvalStatus,
      link
    } = req.body

    const message = `Expense sheet has been ${approvalStatus} for project ${req.body.projectName} by ${req.user.name}`;
    await notificationService.createNotification({
      userId: req.body.userId,
      message,
      link,
    })
    const user = await userService.getUserById(req.body.userId);
    await emailService.sendEmail(user.email, `Expense Sheet ${approvalStatus}`, message);

    res.send({ updatedExpenseSheet });
    return;
  } else {
    res.status(httpStatus.CONFLICT).send({
      message: "Expense sheet already submitted",
    });
    return;
  }
})

const updateExpenseSheetList = catchAsync(async (req, res) => {
  const updatedExpenseSheet = await expenseSheetService.updateExpenseSheetList({
    ...req.body,
    user: req.user,
  });
  if (updatedExpenseSheet) {
    return res.send({ updatedExpenseSheet });
  } else {
    res.status(httpStatus.CONFLICT).send({
      message: "Expense sheet already submitted",
    });
    return;
  }
})

const updateExpenseSheetReceipts = catchAsync(async (req, res) => {
  const updatedExpenseSheet = await expenseSheetService.updateExpenseSheetReceipt({
    ...req.body,
    user: req.user,
  });
  if (updatedExpenseSheet) {
    return res.send({ updatedExpenseSheet });
  } else {
    res.status(httpStatus.CONFLICT).send({
      message: "Expense sheet already submitted",
    });
    return;
  }
})

const deleteExpenseSheet = catchAsync(async (req, res) => {
  const deletedExpenseSheet = await expenseSheetService.deleteExpenseSheet({ ...req.body, user: req.user });
  if(deletedExpenseSheet) {
    getAllPendingExpenseSheets(req, res)
  } else {
    res.status(httpStatus[500]).send({
      message: "Expense sheet not deleted",
    });
  }
})

module.exports = {
  getAllPendingExpenseSheets,
  changeExpenseSheetStatus,
  getExpenseSheetList,
  updateExpenseSheetList,
  submitAllExpenseSheetsToLinemanager,
  deleteExpenseSheet,
  createExpenseSheet,
  updateExpenseSheetReceipts,
};
