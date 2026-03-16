import mongoose from "mongoose";

const trackerSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: [true, "Tracker name is required"],
            trim: true,
            maxlength: [50, "Tracker name must be at most 50 characters"],
        },
        icon: {
            type: String,
            trim: true,
            default: "wallet",
        },
        description: {
            type: String,
            trim: true,
            maxlength: [150, "Description must be at most 150 characters"],
            default: "",
        },
        color: {
            type: String,
            trim: true,
            default: "violet",
        },
        isDefault: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

trackerSchema.index({ user: 1, name: 1 }, { unique: true });

const Tracker = mongoose.model("Tracker", trackerSchema);

export default Tracker;