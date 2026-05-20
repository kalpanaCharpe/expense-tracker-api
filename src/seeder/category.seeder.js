import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

import connectDB from "../config/db.js";

import Category from "../models/category.model.js";

const defaultCategories = [
    { name: "Food", type: "expense", isDefault: true },
    { name: "Transport", type: "expense", isDefault: true },
    { name: "Bills", type: "expense", isDefault: true },
    { name: "Health", type: "expense", isDefault: true },
    { name: "Shopping", type: "expense", isDefault: true },
    { name: "Travel", type: "expense", isDefault: true },
    { name: "Leisure", type: "expense", isDefault: true },
    { name: "Other", type: "expense", isDefault: true },
];

const seedCategories = async () => {
    try {

        await connectDB();

        await Category.deleteMany({
            isDefault: true,
        });

        await Category.insertMany(defaultCategories);

        console.log("Default categories seeded");

        mongoose.connection.close();

    } catch (error) {
        console.log(error);
    }
};

seedCategories();