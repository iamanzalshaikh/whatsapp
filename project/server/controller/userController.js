import User from "../models/user.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Current user error: ${error}` });
  }
};

export const getOtherUsers = async (req, res) => {
  try {
    let users = await User.find({
      _id: { $ne: req.userId }
    }).select("-password");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: `get other users error ${error}` });
  }
};

export const search = async (req, res) => {
  try {
    let { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "query is required" });
    }
    let users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { userName: { $regex: query, $options: "i" } },
      ]
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: `search users error ${error}` });
  }
};