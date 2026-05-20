import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true,
        },

        type: {
            type: String,
            enum: ["income", "expense"],
            required: true,
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        date: {
            type: Date,
            required: true,
        },

        note: {
            type: String,
            trim: true,
            default: "",
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Transaction = mongoose.model(
    "Transaction",
    transactionSchema
);

export default Transaction;