import Tracker from "../models/tracker.model.js";
import Expense from "../models/expense.model.js";

export const createTracker = async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Tracker name is required",
      });
    }

    const trackerName = name.trim();

    const existingTracker = await Tracker.findOne({
      user: req.user._id,
      name: trackerName,
    });

    if (existingTracker) {
      return res.status(409).json({
        message: "Tracker with this name already exists",
      });
    }

    const tracker = await Tracker.create({
      user: req.user._id,
      name: trackerName,
      description: description?.trim() || "",
      color: color?.trim() || "violet",
      icon: icon?.trim() || "wallet",
      isDefault: false,
    });

    return res.status(201).json({
      message: "Tracker created successfully",
      tracker,
    });
  } catch (error) {
    console.error("Create tracker error:", error.message);
    return res.status(500).json({
      message: "Server error while creating tracker",
    });
  }
};

export const getTrackers = async (req, res) => {
  try {
    const trackers = await Tracker.find({ user: req.user._id }).sort({
      isDefault: -1,
      createdAt: 1,
    });

    return res.status(200).json({
      count: trackers.length,
      trackers,
    });
  } catch (error) {
    console.error("Get trackers error:", error.message);
    return res.status(500).json({
      message: "Server error while fetching trackers",
    });
  }
};

export const updateTracker = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color, icon } = req.body;

    const tracker = await Tracker.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!tracker) {
      return res.status(404).json({
        message: "Tracker not found",
      });
    }

    if (name && name.trim() !== tracker.name) {
      const existingTracker = await Tracker.findOne({
        user: req.user._id,
        name: name.trim(),
        _id: { $ne: id },
      });

      if (existingTracker) {
        return res.status(409).json({
          message: "Another tracker with this name already exists",
        });
      }

      tracker.name = name.trim();
    }

    if (description !== undefined) {
      tracker.description = description.trim();
    }

    if (color) {
      tracker.color = color.trim();
    }

    if (icon) {
      tracker.icon = icon.trim();
    }

    await tracker.save();

    return res.status(200).json({
      message: "Tracker updated successfully",
      tracker,
    });
  } catch (error) {
    console.error("Update tracker error:", error.message);
    return res.status(500).json({
      message: "Server error while updating tracker",
    });
  }
};

export const deleteTracker = async (req, res) => {
  try {
    const { id } = req.params;

    const tracker = await Tracker.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!tracker) {
      return res.status(404).json({
        message: "Tracker not found",
      });
    }

    if (tracker.isDefault) {
      return res.status(400).json({
        message: "Default tracker cannot be deleted",
      });
    }

    const trackerExpenseCount = await Expense.countDocuments({
      user: req.user._id,
      tracker: tracker._id,
    });

    if (trackerExpenseCount > 0) {
      return res.status(400).json({
        message: "Cannot delete tracker with existing expenses",
      });
    }

    await Tracker.findByIdAndDelete(tracker._id);

    return res.status(200).json({
      message: "Tracker deleted successfully",
    });
  } catch (error) {
    console.error("Delete tracker error:", error.message);
    return res.status(500).json({
      message: "Server error while deleting tracker",
    });
  }
};