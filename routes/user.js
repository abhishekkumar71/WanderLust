const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const { func } = require("joi");
const { saveRedirectedUrl } = require("../middleware.js");
const userController = require("../controller/user.js");

router
  .route("/signup")
  .get(userController.renderSignup)
  .post(wrapAsync(userController.signup));

router
  .route("/login")
  .get(userController.loginForm)
  .post(
    saveRedirectedUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );
  
router.get("/logout", userController.logout);
module.exports = router;
