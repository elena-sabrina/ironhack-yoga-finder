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
    coordinates: [
      {
        type: Number,
        min: -180,
        max: 180
      }
    ],
    type: {
      type: String,
      default: 'Point',
      required: true
    }
  },
  level: {
    type: String,
    enum: ['beginner', 'advanced', 'proficient', 'any'],
    default: 'any'
  },
  category: {
    type: String,
    enum: ['Hatha', 'Vinyasa', 'Yin', 'Other'],
    default: 'Other'
  },
  date: {
    type: Date
  }
});

module.exports = mongoose.model('Class', classSchema);
