import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tracker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tracker",
      required: true,
    },
    month: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Budget must be 0 or more"],
    },
  },
  {
    timestamps: true,
  }
);

budgetSchema.index({ user: 1, tracker: 1, month: 1 }, { unique: true });

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;