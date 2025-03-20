const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMessage = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

userSchema.plugin(passportLocalMessage);
module.exports = mongoose.model("User", userSchema);
