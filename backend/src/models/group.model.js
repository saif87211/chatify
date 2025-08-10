import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        requierd: true
    },
    profilephoto: {
        type: String
    }
}, { timestamps: true });

export const Group = mongoose.model("Group", groupSchema);


