'use strict';

const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  image: {
    type: String
  },
  teacher: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  level: {
    type: String,
    enum: ['beginner', 'advanced', 'proficient', 'any'],
    default: 'any'
  },
  type: {
    type: String,
    enum: ['Hatha', 'Vinyasa', 'Yin', 'Other'],
    default: 'Other'
  },
  date: {
    type: Date
  }
});

module.exports = mongoose.model('Class', classSchema);
