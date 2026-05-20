import express from "express";

import protect from "../middleware/auth.middleware.js";

import {
    getFinancialSummary,
    getCategoryBreakdown,
    getMonthlySummary,
} from "../controllers/analytics.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/analytics/summary:
 *   get:
 *     summary: Get financial summary
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Financial summary fetched successfully
 */
// Financial summary
router.get("/summary", protect, getFinancialSummary);

/**
 * @swagger
 * /api/analytics/breakdown:
 *   get:
 *     summary: Get category-wise expense breakdown
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Category breakdown fetched successfully
 */
// Category breakdown
router.get("/breakdown", protect, getCategoryBreakdown);

/**
 * @swagger
 * /api/analytics/monthly-summary:
 *   get:
 *     summary: Get monthly financial summary
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: months
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Monthly summary fetched successfully
 */
// Monthly summary
router.get("/monthly-summary", protect, getMonthlySummary);

export default router;