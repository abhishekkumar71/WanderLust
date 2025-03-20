const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, ValidateListing } = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer = require("multer");
const { storage } = require("../CloudConfig.js");
const upload = multer({ storage });
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    ValidateListing,
    wrapAsync(listingController.postNewListing)
  );
router.get("/search", wrapAsync(listingController.searchListing));
// .post(upload.single("listing[image]"), (req, res) => {
//   res.send(req.file);
// });

// NEW ROUTE
router.get("/new", isLoggedIn, listingController.getNewListing);

router
  .route("/:id")

  // SHOW ROUTE
  .get(wrapAsync(listingController.showListing))
  // UPDATE ROUTE
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    ValidateListing,
    wrapAsync(listingController.updateListing)
  )

  // DELETE ROUTE
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// EDIT ROUTE
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);

module.exports = router;
