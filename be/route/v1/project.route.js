const express = require('express');
const router = express.Router();
const projectController = require('../../controller/project.controller.js');
const auth = require('../../middleware/auth');

router.get("/", auth("getProjects"), projectController.getAllProjects);
router.post("/", auth("manageProjects"), projectController.saveProject);
router.delete("/:id", auth("manageProjects"), projectController.deleteProject);
router.patch("/delete/:id", auth("manageProjects"), projectController.deleteProjectRequest);
router.patch("/:id", auth("manageProjects"), projectController.updateProject);
router.post("/changestatus", auth("manageProjects"), projectController.updateProjectStatus);
router.post("/members", auth("manageProjects"), projectController.addProjectMembers);
router.get("/members/:id", auth("getProjects"), projectController.getProjectMembers);
router.get("/my", auth(), projectController.getProjectsById);
router.get("/requests", 
    // auth("requests"), 
    projectController.getAllProjectRequests);
router.patch("/requests/status", auth("requests"), projectController.updateProjectRequests);

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management
 */

/**
 * @swagger
 * /project:
 *   get:
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       default:
 *         description: Error
 * 
 *   post:
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectname:
 *                 type: string
 *               total_fee:
 *                 type: number
 *               labour_budget:
 *                 type: number
 *               client_contact_email:
 *                 type: string
 *               work_type:
 *                 type: string
 *               organization:
 *                 type: string
 *               client_name:
 *                 type: string
 *               chargeable_project:
 *                 type: boolean
 *               start_date:
 *                 type: string
 *               budget:
 *                 type: number
 *               project_manager:
 *                 type: string
 *               company:
 *                 type: string
 *               multiplier:
 *                 type: number
 *               client_number:
 *                 type: string
 *               director:
 *                 type: string
 *               budget_level:
 *                 type: string
 *               client_title:
 *                 type: string
 *               client_phone:
 *                 type: string
 *               finish_date:
 *                 type: string
 *               work_location:
 *                 type: string
 *               po_number:
 *                 type: string
 *     responses:
 *       default:
 *         description: Response
 */

/**
 * @swagger
 * /project/{id}:
 *   patch:
 *     summary: Update a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: project id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectname:
 *                 type: string
 *               total_fee:
 *                 type: number
 *               labour_budget:
 *                 type: number
 *               client_contact_email:
 *                 type: string
 *               work_type:
 *                 type: string
 *               organization:
 *                 type: string
 *               client_name:
 *                 type: string
 *               chargeable_project:
 *                 type: boolean
 *               start_date:
 *                 type: string
 *               budget:
 *                 type: number
 *               project_manager:
 *                 type: string
 *               company:
 *                 type: string
 *               multiplier:
 *                 type: number
 *               client_number:
 *                 type: string
 *               director:
 *                 type: string
 *               budget_level:
 *                 type: string
 *               client_title:
 *                 type: string
 *               client_phone:
 *                 type: string
 *               finish_date:
 *                 type: string
 *               work_location:
 *                 type: string
 *               po_number:
 *                 type: string
 *     responses:
 *       default:
 *         description: Response
 * 
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: project id
 *     responses:
 *       default:
 *         description: Response
 * 
 */

/**
 * @swagger
 * /project/members:
 *   post:
 *     tags: [Projects]
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
 *               members:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       default:
 *         description: Response
 */

/**
 * @swagger
 * /project/members/{id}: 
 *   get:
 *     summary: Get project members
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: project id
 *     responses:
 *       default:
 *         description: Response
 */

module.exports = router;