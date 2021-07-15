const mongoose = require('mongoose');

const User = new mongoose.Schema({

  id: {
    type: String,
    unique: true
  },

  name: String,

  tag: String,

  desc: String,

  avatar: String,

  github: String,

  website: String,

  certified: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model('User', User);