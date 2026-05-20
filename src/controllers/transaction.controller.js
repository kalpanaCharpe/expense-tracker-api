import Transaction from "../models/transaction.model.js";

import Category from "../models/category.model.js";

// Create Transaction
export const createTransaction = async (req, res) => {
    try {

        const {
            amount,
            type,
            category,
            date,
            note,
        } = req.body;

        // Validation
        if (!amount || !type || !category || !date) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided",
            });
        }

        // Check category exists
        // const existingCategory = await Category.findById(category);
        const existingCategory = await Category.findOne({
            _id: category,
            $or: [
                { isDefault: true },
                { user: req.user._id },
            ],
        });

        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        // Create transaction
        const transaction = await Transaction.create({
            amount,
            type,
            category,
            date,
            note,
            user: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            transaction,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const getTransactions = async (req, res) => {
    try {

        // Pagination
        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        // Filters
        const filter = {
            user: req.user._id,
        };

        // Type filter
        if (req.query.type) {
            filter.type = req.query.type;
        }

        // Category filter
        if (req.query.category) {
            filter.category = req.query.category;
        }

        // Date range filter
        if (req.query.startDate || req.query.endDate) {
            filter.date = {};

            if (req.query.startDate) {
                filter.date.$gte = new Date(req.query.startDate);
            }

            if (req.query.endDate) {
                filter.date.$lte = new Date(req.query.endDate);
            }
        }

        // Sorting
        let sortOption = {
            createdAt: -1,
        };

        if (req.query.sortBy) {

            const order =
                req.query.order === "asc" ? 1 : -1;

            sortOption[req.query.sortBy] = order;
        }

        // Fetch transactions
        const transactions = await Transaction.find(filter)
            .populate("category", "name type")
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        // Total count
        const totalTransactions =
            await Transaction.countDocuments(filter);

        res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(totalTransactions / limit),
            totalTransactions,
            transactions,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


export const getSingleTransaction = async (req, res) => {
    try {

        const { id } = req.params;

        const transaction = await Transaction.findOne({
            _id: id,
            user: req.user._id,
        }).populate("category", "name type");

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        res.status(200).json({
            success: true,
            transaction,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


export const updateTransaction = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            amount,
            type,
            category,
            date,
            note,
        } = req.body;

        const transaction = await Transaction.findOne({
            _id: id,
            user: req.user._id,
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        // Validate category if updating
        if (category) {

            const existingCategory =
                await Category.findOne({
                    _id: category,
                    $or: [
                        { isDefault: true },
                        { user: req.user._id },
                    ],
                });

            if (!existingCategory) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found",
                });
            }
        }

        // Update fields
        transaction.amount =
            amount || transaction.amount;

        transaction.type =
            type || transaction.type;

        transaction.category =
            category || transaction.category;

        transaction.date =
            date || transaction.date;

        transaction.note =
            note || transaction.note;

        await transaction.save();

        res.status(200).json({
            success: true,
            message: "Transaction updated successfully",
            transaction,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


export const deleteTransaction = async (req, res) => {
    try {

        const { id } = req.params;

        const transaction = await Transaction.findOne({
            _id: id,
            user: req.user._id,
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        await transaction.deleteOne();

        res.status(200).json({
            success: true,
            message: "Transaction deleted successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};