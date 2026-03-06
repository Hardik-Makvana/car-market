const Car = require("./models/car");

const Review = require("./models/review");


// 🔐 LOGIN CHECK
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  next();
};

// 👑 OWNER CHECK
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const car = await Car.findById(id);

  if (!car.owner.equals(req.user._id)) {
    return res.redirect(`/cars/${id}`);
  }

  next();
};
module.exports.isReviewOwner = async (req, res, next) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not allowed to do that");
    return res.redirect("back");
  }

  next();
};
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    req.flash("error", "You must be logged in to sell a car!");
    return res.redirect("/login");
  }
  next();
};

