'use strict';

const { urlencoded } = require('express');
const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  image: {
    type: String
  },
  teacherid: {
    type: String,
    trim: true,
    required: true
  },
  teacher: {
    type: String,
    trim: true
  },
  url: {
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
    default: 'other'
  },
  startdate: {
    type: Date,
    min: '2021-01-01',
    max: '2022-01-01',
    default: Date.now()
  },
  enddate: {
    type: Date,
    min: '2021-01-01',
    max: '2022-01-01',
    default: Date.now()
  },
  description: {
    type: String
  }
});

module.exports = mongoose.model('Class', classSchema);
