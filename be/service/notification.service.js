const db = require("../models");
const Notfication = db.notification;

const createNotification = async (data) => {
  const notification = await Notfication.create(data);
  return notification
}

const createBulkNotifications = async (memberIds, message, link) => {
  const notifications = await Notfication.bulkCreate(memberIds.map(id => ({
    userId: id,
    message,
    link,
  })))
  return notifications
}

const deleteNotification = async ({ id }) => {
  const deleted = await Notfication.destroy({
    where: {
      id,
    },
  });
  return deleted;
};

const getNotifications = async (data) => {
  const { userId } = data
  const notifications = await Notfication.findAll({
    where: {
      userId
    },
    order: [["createdAt", "DESC"]],
  })
  return notifications
}

module.exports = {
  createNotification,
  getNotifications,
  createBulkNotifications,
  deleteNotification
}
