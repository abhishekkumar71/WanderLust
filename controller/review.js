const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.postReview = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let newRev = new Review(req.body.review);
  newRev.author = req.user._id;
  console.log(newRev.author);
  console.log(newRev);
  await newRev.save();
  listing.reviews.push(newRev);
  await listing.save();

  console.log("review saved");
  req.flash("success", "New Review Added!");

  res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");

  res.redirect(`/listings/${id}`);
};
