'use strict';

const { urlencoded } = require('express');
const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  image: {
    type: String
  },
  teacherid: {
    type: String,
    trim: true
  },
  teacher: {
    type: String,
    trim: true
  },
  locationlink: {
    type: String
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
    enum: ['hatha', 'vinyasa', 'yin', 'astanga', 'bikram', 'other'],
    default: 'Other'
  },
  startdate: {
    type: Date,
    min: Date.now(),
    max: '2022-01-01',
    default: Date.now()
  },
  enddate: {
    type: Date,
    min: Date.now(),
    max: '2022-01-01',
    default: Date.now()
  },
  description: {
    type: String
  }
});

module.exports = mongoose.model('Class', classSchema);
