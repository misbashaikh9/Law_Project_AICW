const express = require("express");
const router = express.Router();
const User= require("../models/User")

const { signup, login } = require("../controllers/authController");
const auth = require("../middleware/auth");

router.post("/signup", signup);
router.post("/login", login);

// Protected
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;