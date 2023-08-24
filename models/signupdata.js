const mongoose = require("mongoose");
const Schemasignup = mongoose.Schema;

const userDetailsSchemasignup = new Schemasignup({
  name: String,
  email: String,
  phone: String,
  password: String,
  
});

const UserDetailssignup = mongoose.model("usersignup", userDetailsSchemasignup);
module.exports = UserDetailssignup;
