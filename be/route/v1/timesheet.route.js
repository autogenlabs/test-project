const express = require('express');
const router = express.Router();
const timesheetController = require('../../controller/timesheet.controller.js');
const auth = require('../../middleware/auth');

router.post("/save", auth(), timesheetController.saveTimesheet);
router.get("/", auth(), timesheetController.getTimesheets);
router.get("/weekly", auth(), timesheetController.getWeeklyTimesheets);
router.post("/submit/", auth(), timesheetController.submitTimesheetToLinemanager);
router.post("/submit/all", auth(), timesheetController.submitAllTimesheetsToLinemanager);
router.get("/all/pending", auth(), timesheetController.getAllPendingTimesheets);
router.post("/change/status", auth(), timesheetController.changeTimesheetStatus);
router.get("/list", auth(), timesheetController.getTimesheetList);
router.patch("/update", auth(), timesheetController.updateTimesheetList);
router.patch("/update/:id", auth(), timesheetController.updateTimesheetListById);
router.delete("/", auth("deleteTimesheets"), timesheetController.deleteTimesheets);
router.patch("/update/overtime", auth(), timesheetController.updateWeeklyTimesheet);
router.get("/project/:projId", auth(), timesheetController.getTimesheetsByProjectId);  // timesheet by projId
router.delete("/delete-dir-admin/:id", auth(), timesheetController.deleteTimesheetsByDirAndAdmin);

/**
 * @swagger
 * tags:
 *   name: Timesheet
 *   description: Timesheet management
 */

/**
 * @swagger
 * /timesheet:
 *   get:
 *     tags: [Timesheet]
 *     security:
 *       - bearerAuth: []
 *     description: Get all timesheet
 *     parameters:
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: integer
 *         description: project id
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: date
 *     responses:
 *       default:
 *         description: Response
 * 
 */

/**
 * @swagger
 * /timesheet/save:
 *   post:
 *     tags: [Timesheet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectId:
 *                 type: integer
 *               date:
 *                 type: string
 *               task:
 *                 type: string
 *               time:
 *                 type: number
 *     responses:
 *       default:
 *         description: Response
 */

/**
 * @swagger
 * /timesheet/weekly:
 *   get:
 *     tags: [Timesheet]
 *     security:
 *       - bearerAuth: []
 *     description: Get weekly timesheet
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: date
 *     responses:
 *       default:
 *         description: Response
 * 
 */

module.exports = router