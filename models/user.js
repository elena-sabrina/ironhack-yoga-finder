'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 6,
    maxlength: 30,
    required: true
  },
  email: {
    type: String,
    minlength: 10,
    required: true,
    trim: true,
    lowercase: true
  },
  passwordHashAndSalt: {
    type: String
  },
  picture: {
    type: String
  }
});

module.exports = mongoose.model('User', userSchema);
