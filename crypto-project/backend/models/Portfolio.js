import mongoose from "mongoose";

const coinSchema = new mongoose.Schema({
    id: String,
    quantity: Number,
    buyPrice: Number,
});

const portfolioSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // if you have a user model
        required: true,
    },
    coins: [coinSchema],
});

export default mongoose.model("Portfolio", portfolioSchema);