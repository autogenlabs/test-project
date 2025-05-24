const express = require('express');
const router = express.Router();
const notificationController = require('../../controller/notification.controller');
const auth = require('../../middleware/auth');

router.get("/", auth(), notificationController.getNotifications);
router.delete("/:id", auth(), notificationController.deleteNotification);

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notifications management
 */

/**
 * @swagger
 * /notifications:
 *   get: 
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     description: Get all notifications
 */

module.exports = router