const User = require("../models/user.js");

module.exports.renderSignup = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newuser = new User({ username, email });
    const RegUser = await User.register(newuser, password);
    console.log(RegUser);
    req.login(RegUser, function (err) {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to WanderLust!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.loginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome Back!");
  let redirectURL = res.locals.redirectURL || "/listings";
  res.redirect(redirectURL);
};

module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "loggedout successfully");
    res.redirect("/listings");
  });
};
