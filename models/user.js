//Lớp người dùng User
const mongoose = require("mongoose");

//Đối tượng người dùng
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

// Phương thức get/set
UserSchema.methods.getUsername = function () {
  return this.username;
};
UserSchema.methods.setUsername = function (username) {
  this.username = username;
};
UserSchema.methods.getPassword = function () {
  return this.password;
};
UserSchema.methods.setPassword = function (password) {
  this.password = password;
};
UserSchema.methods.getEmail = function () {
  return this.email;
};
UserSchema.methods.setEmail = function (email) {
  this.email = email;
};

module.exports = UserSchema;
