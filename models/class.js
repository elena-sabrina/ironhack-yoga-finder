'use strict';

const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  teacher: {
    type: String,
    trim: true
  },
  place: {
    type: String,
    trim: true
  },
  image: {
    type: String
  }
});

module.exports = mongoose.model('Class', classSchema);
