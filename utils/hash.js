// Mã hóa mật khẩu bằng bcrypt
const bcrypt = require("bcrypt");// Thư viện mã hóa 
const mongoose = require("mongoose");// Thư viện kết nối MongoDB
const UserSchema = require("../models/user");


//Mã hóa mật khẩu
UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  bcrypt.hash(this.password, 10, (err, password) => {
    if (err) return next(err);
    this.password = password;
    next();
  });
});
//So sánh mật khẩu
// UserSchema.methods.comparePassword = function (password, cb) {
//   bcrypt.compare(password, this.password, (err, isMatch) => {
//     if (err) return cb(err);
//     else {
//       if (!isMatch) return cb(null, isMatch);
//       return cb(null, isMatch);
//     }
//   });
// };
module.exports = mongoose.model("User", UserSchema);