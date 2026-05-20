import mongoose from "mongoose";

import Transaction from "../models/transaction.model.js";

export const getFinancialSummary = async (req, res) => {
    try {

        const userId = new mongoose.Types.ObjectId(
            req.user._id
        );

        // Optional date filters
        const matchFilter = {
            user: userId,
        };

        if (req.query.startDate || req.query.endDate) {

            matchFilter.date = {};

            if (req.query.startDate) {
                matchFilter.date.$gte = new Date(
                    req.query.startDate
                );
            }

            if (req.query.endDate) {
                matchFilter.date.$lte = new Date(
                    req.query.endDate
                );
            }
        }

        // Aggregation
        const summary = await Transaction.aggregate([
            {
                $match: matchFilter,
            },

            {
                $group: {
                    _id: "$type",

                    totalAmount: {
                        $sum: "$amount",
                    },
                },
            },
        ]);

        let totalIncome = 0;

        let totalExpense = 0;

        summary.forEach((item) => {

            if (item._id === "income") {
                totalIncome = item.totalAmount;
            }

            if (item._id === "expense") {
                totalExpense = item.totalAmount;
            }
        });

        const netBalance =
            totalIncome - totalExpense;

        res.status(200).json({
            success: true,
            totalIncome,
            totalExpense,
            netBalance,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


export const getCategoryBreakdown = async (req, res) => {
    try {

        const userId = new mongoose.Types.ObjectId(
            req.user._id
        );

        const matchFilter = {
            user: userId,
            type: "expense",
        };

        // Optional date filters
        if (req.query.startDate || req.query.endDate) {

            matchFilter.date = {};

            if (req.query.startDate) {
                matchFilter.date.$gte = new Date(
                    req.query.startDate
                );
            }

            if (req.query.endDate) {
                matchFilter.date.$lte = new Date(
                    req.query.endDate
                );
            }
        }

        // Total expense
        const totalExpenseResult =
            await Transaction.aggregate([
                {
                    $match: matchFilter,
                },

                {
                    $group: {
                        _id: null,

                        totalExpense: {
                            $sum: "$amount",
                        },
                    },
                },
            ]);

        const totalExpense =
            totalExpenseResult[0]?.totalExpense || 0;

        // Category breakdown
        const breakdown = await Transaction.aggregate([
            {
                $match: matchFilter,
            },

            {
                $group: {
                    _id: "$category",

                    totalAmount: {
                        $sum: "$amount",
                    },
                },
            },

            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoryDetails",
                },
            },

            {
                $unwind: "$categoryDetails",
            },

            {
                $project: {
                    category: "$categoryDetails.name",

                    amount: "$totalAmount",

                    percentage: {
                        $cond: [
                            { $eq: [totalExpense, 0] },
                            0,
                            {
                                $multiply: [
                                    {
                                        $divide: [
                                            "$totalAmount",
                                            totalExpense,
                                        ],
                                    },
                                    100,
                                ],
                            },
                        ],
                    },
                },
            },

            {
                $sort: {
                    amount: -1,
                },
            },
        ]);

        res.status(200).json({
            success: true,
            totalExpense,
            breakdown,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


export const getMonthlySummary = async (req, res) => {
    try {

        const userId = new mongoose.Types.ObjectId(
            req.user._id
        );

        const months =
            Number(req.query.months) || 6;

        const startDate = new Date();

        startDate.setMonth(
            startDate.getMonth() - months
        );

        const summary = await Transaction.aggregate([
            {
                $match: {
                    user: userId,

                    date: {
                        $gte: startDate,
                    },
                },
            },

            {
                $group: {
                    _id: {
                        year: {
                            $year: "$date",
                        },

                        month: {
                            $month: "$date",
                        },

                        type: "$type",
                    },

                    totalAmount: {
                        $sum: "$amount",
                    },
                },
            },

            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1,
                },
            },
        ]);

        res.status(200).json({
            success: true,
            summary,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};