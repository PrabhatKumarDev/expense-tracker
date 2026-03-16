import Budget from "../models/budget.model.js";
import Tracker from "../models/tracker.model.js";

export const setBudget = async (req, res) => {
  try {
    const { trackerId, month, amount } = req.body;

    if (!trackerId || !month || amount === undefined) {
      return res.status(400).json({
        message: "Tracker, month, and amount are required",
      });
    }

    const parsedAmount = Number(amount);

    if (Number.isNaN(parsedAmount) || parsedAmount < 0) {
      return res.status(400).json({
        message: "Budget amount must be a valid number",
      });
    }

    const tracker = await Tracker.findOne({
      _id: trackerId,
      user: req.user._id,
    });

    if (!tracker) {
      return res.status(404).json({
        message: "Tracker not found",
      });
    }

    const budget = await Budget.findOneAndUpdate(
      {
        user: req.user._id,
        tracker: trackerId,
        month,
      },
      {
        user: req.user._id,
        tracker: trackerId,
        month,
        amount: parsedAmount,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      message: "Budget saved successfully",
      budget,
    });
  } catch (error) {
    console.error("Set budget error:", error.message);
    return res.status(500).json({
      message: "Server error while saving budget",
    });
  }
};

export const getBudget = async (req, res) => {
  try {
    const { trackerId, month } = req.query;

    if (!trackerId || !month) {
      return res.status(400).json({
        message: "Tracker and month are required",
      });
    }

    const tracker = await Tracker.findOne({
      _id: trackerId,
      user: req.user._id,
    });

    if (!tracker) {
      return res.status(404).json({
        message: "Tracker not found",
      });
    }

    const budget = await Budget.findOne({
      user: req.user._id,
      tracker: trackerId,
      month,
    });

    return res.status(200).json({
      budget: budget || null,
    });
  } catch (error) {
    console.error("Get budget error:", error.message);
    return res.status(500).json({
      message: "Server error while fetching budget",
    });
  }
};