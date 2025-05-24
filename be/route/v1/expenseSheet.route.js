const express = require('express');
const router = express.Router();
const expenseSheetController = require('../../controller/expenseSheet.controller.js');
const auth = require('../../middleware/auth.js');

router.post("/add-new", auth(), expenseSheetController.createExpenseSheet);
router.post("/submit/all", auth(), expenseSheetController.submitAllExpenseSheetsToLinemanager);
router.get("/all/pending", auth(), expenseSheetController.getAllPendingExpenseSheets);
router.post("/change/status", auth(), expenseSheetController.changeExpenseSheetStatus);
router.get("/list", auth(), expenseSheetController.getExpenseSheetList);
router.patch("/update", auth(), expenseSheetController.updateExpenseSheetList);
router.patch("/update/receipts", auth(), expenseSheetController.updateExpenseSheetReceipts);
router.delete("/", auth("deleteExpenses"), expenseSheetController.deleteExpenseSheet);

/**
 * @swagger
 * tags:
 *   name: ExpenseSheet
 *   description: ExpenseSheet management
 */

/**
 * @swagger
 * /expenseSheet:
 *   get:
 *     tags: [ExpenseSheet]
 *     security:
 *       - bearerAuth: []
 *     description: Get all expenseSheet
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
 * /expenseSheet/save:
 *   post:
 *     tags: [ExpenseSheet]
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
 * /expenseSheet/weekly:
 *   get:
 *     tags: [ExpenseSheet]
 *     security:
 *       - bearerAuth: []
 *     description: Get weekly expenseSheet
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