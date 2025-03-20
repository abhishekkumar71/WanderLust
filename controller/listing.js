const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const maptoken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: maptoken });

module.exports.index = async (req, res) => {
  let { category } = req.query;
  if (typeof category !== "undefined") {
    let AllListings = await Listing.find({ category: category });
    if (!AllListings.length) {
      req.flash("error", " Oops!!No listings Found");
      return res.redirect("/listings");
    } else {
      res.render("listings/index.ejs", { AllListings });
    }
  }
  let AllListings = await Listing.find({});
  res.render("listings/index.ejs", { AllListings });
};

module.exports.searchListing = async (req, res) => {
  let { location } = req.query;
  let AllListings = await Listing.find({ location: location });
  if (!AllListings.length) {
    req.flash("error", " Oops!!No listings Found");
    return res.redirect("/listings");
  } else {
  res.render("listings/index.ejs", { AllListings });
  }
};

module.exports.getNewListing = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.postNewListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 2,
    })
    .send();
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  console.log(req.body.listing.category);
  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "New Listing Added!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing requested doesn't exist!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing requested doesn't exist!");
    res.redirect("/listings");
  }
  let originalUrl = listing.image.url;
  originalUrl = originalUrl.replace("/upload", "/upload/h_200,w_200");
  res.render("listings/edit.ejs", { listing, originalUrl });
};

module.exports.updateListing = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "send valid data!");
  }
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Updated Successfully!");

  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedList = await Listing.findByIdAndDelete(id);
  console.log(deletedList);
  req.flash("success", "Listing Deleted!");

  res.redirect("/listings");
};
