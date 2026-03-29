const { verify } = require("jsonwebtoken");
const { Signup, Login } = require("../Controllers/AuthController");
const { verifyUser } = require("../Middlewares/AuthMiddleware");
const router = require("express").Router();

router.post("/", verifyUser);
router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
  });

  return res.json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = router;