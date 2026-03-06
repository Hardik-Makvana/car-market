const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

// SIGNUP FORM
router.get("/register", (req, res) => {
  res.render("users/register");
});

// REGISTER USER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.logIn(registeredUser, (err) => {
      if (err) {
        return res.send(err);
      }
      req.flash("success", "Welcome to CarMarket!");
      res.redirect("/cars");
    });
  } catch (e) {
    res.send(e.message);
  }
});

// LOGIN FORM
router.get("/login", (req, res) => {
  res.render("users/login");
});

// LOGIN USER
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/cars");
  }
);

// LOGOUT
router.get("/logout", (req, res) => {
  req.logout(() => {
    req.flash("success", "Logged out successfully!");
    res.redirect("/cars");
  });
});

module.exports = router;
