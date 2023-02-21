const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  createTime: Date,
  lastUpdateTime: Date,
  username: String,
  password: String,
  isAdmin: Boolean,
  fullName: String,
  phone: String,
  email: String,
  birthday: Date,
  avatar: String,
  address: String,
  userFollow: [String],
  experiencePoint: Number,
  level: Number,
  status: Boolean
});

module.exports = mongoose.model('User', userSchema);
