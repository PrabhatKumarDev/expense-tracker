import Tracker from "../models/tracker.model.js";

export const createTracker = async (req, res) => {
  try {
    const { name, description, color,icon } = req.body;

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