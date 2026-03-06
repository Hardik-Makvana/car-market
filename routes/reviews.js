const express = require("express");
const router = express.Router({ mergeParams: true });
const Car = require("../models/car");
const Review = require("../models/review");
const { isLoggedIn } = require("../middleware");
const { isReviewOwner } = require("../middleware");

router.post("/", isLoggedIn,  async (req, res) => {
  console.log("REQ BODY 👉", req.body);

  const car = await Car.findById(req.params.id);
  const review = new Review(req.body.review);

  review.author = req.user._id ;
  car.reviews.push(review);
  await review.save();
  await car.save();

  req.flash("success", "Review added!");
  res.redirect(`/cars/${car._id}`);
});

router.delete("/:reviewId", isReviewOwner, async (req, res) => {
  const { id, reviewId } = req.params;

  await Car.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId }
  });

  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review deleted!");
  res.redirect(`/cars/${id}`);
});


module.exports = router;
