import mongoose from "mongoose";
import user from "./user.js";

const MessageSchema = new mongoose.Schema({
    room: String,
    message: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: user,
        required: true,
    },
    timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", MessageSchema);

export default Message;
