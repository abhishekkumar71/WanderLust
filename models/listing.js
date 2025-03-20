const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { ref, string } = require("joi");
const listingSchema = new Schema({
  title: {
    type: String,

    required: true,
  },
  description: String,
  // image: {
  //   type: String,
  //   default:
  //     "https://plus.unsplash.com/premium_photo-1732568817442-342a8c77fb80?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyOXx8fGVufDB8fHx8fA%3D%3D",
  //   set: (v) =>
  //     v === ""
  //       ? "https://plus.unsplash.com/premium_photo-1732568817442-342a8c77fb80?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyOXx8fGVufDB8fHx8fA%3D%3D"
  //       : v,
  // },
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  category: {
    type: String,
    enum: [
      "Mountains",
      "Beaches",
      "Skyscrapers",
      "Apartments",
      "Rooms",
      "Pools",
      "Arctic",
      "Farms",
      "Hotels",
      "Lakes",
      "Camps",
      "Forts",
      "Adventures",
      "others",
    ],
    required: true,
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    console.log("triggered");
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
