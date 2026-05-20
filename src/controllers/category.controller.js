import Category from "../models/category.model.js";

// Get Categories
export const getCategories = async (req, res) => {
    try {

        const categories = await Category.find({
            $or: [
                { isDefault: true },
                { user: req.user._id },
            ],
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: categories.length,
            categories,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


export const createCategory = async (req, res) => {
    try {

        const { name, type } = req.body;

        // Validation
        if (!name || !type) {
            return res.status(400).json({
                success: false,
                message: "Name and type are required",
            });
        }

        // Check duplicate category
        const existingCategory = await Category.findOne({
            name,
            user: req.user._id,
        });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "Category already exists",
            });
        }

        // Create category
        const category = await Category.create({
            name: name.trim(),
            type,
            user: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


export const updateCategory = async (req, res) => {
    try {

        const { id } = req.params;

        const { name, type } = req.body;

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        // Prevent editing default categories
        if (category.isDefault) {
            return res.status(403).json({
                success: false,
                message: "Default categories cannot be updated",
            });
        }

        // Check ownership
        if (category.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized",
            });
        }

        // Update fields
        category.name = name || category.name;
        category.type = type || category.type;

        await category.save();

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


export const deleteCategory = async (req, res) => {
    try {

        const { id } = req.params;

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        // Prevent deleting default category
        if (category.isDefault) {
            return res.status(403).json({
                success: false,
                message: "Default categories cannot be deleted",
            });
        }

        // Ownership check
        if (category.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized",
            });
        }

        await category.deleteOne();

        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};