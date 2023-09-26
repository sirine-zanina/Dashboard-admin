import User from "../models/User.js";
import asyncHandler from "express-async-handler";

// @desc Get User
// @route GET /User
// @access private
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  res.json(user);
});4

export { getUser };