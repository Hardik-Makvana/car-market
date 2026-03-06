require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const flash = require("connect-flash");


// AUTH
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

// LAYOUT
const expressLayouts = require("express-ejs-layouts");
// ======================
// BASIC MIDDLEWARE
// ======================
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ROUTES
const carRoutes = require("./routes/cars");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

// ======================
// VIEW ENGINE
// ======================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/boilerplate");

// ======================
// SESSION CONFIG
// ======================
const sessionConfig = {
  secret: process.env.SESSION_SECRET || "thisisasecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

// ======================
// PASSPORT CONFIG
// ======================
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// ======================
// ROUTES
// ======================
app.use("/cars", carRoutes);
app.use("/cars/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

// HOME
app.get("/", (req, res) => {
  res.redirect("/cars");
});

// ======================
// DATABASE
// ======================
const MONGO_URL = process.env.MONGO_URL ;

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ======================
// SERVER
// ======================
app.listen(8080, () => {
  console.log("Server running on port 8080");
});
