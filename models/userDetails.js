const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userDetailsSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  issue: String,
  file: String, // Store the filename, not the file content
  note: String,
});

const UserDetails = mongoose.model("userDetails", userDetailsSchema);
module.exports = UserDetails;
