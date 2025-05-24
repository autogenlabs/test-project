const db = require("../models");
const notificationService = require('../service/notification.service');
const catchAsync = require("../utils/catchAsync");

const getNotifications = catchAsync(async (req, res) => {
  const notifications = await notificationService.getNotifications({ userId: req.user.id });
  res.send({ notifications });
})

const deleteNotification = catchAsync(async (req, res) => {
  const deleted = await notificationService.deleteNotification({ id: req.params.id });
  res.send({ deleted });
})

module.exports = {
  getNotifications,
  deleteNotification,
}