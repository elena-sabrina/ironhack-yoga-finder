'use strict';

const express = require('express');
const router = new express.Router();
const routeGuard = require('./../middleware/route-guard');

const User = require('./../models/user');
const Class = require('./../models/class');

//STORAGE CLOUDINARY
const uploadMiddleware = require('./../middleware/file-upload');

//Display all classes

router.get('/search', (req, res, next) => {
  const { latitude, longitude, distance } = req.query;
  console.log(latitude);
  console.log(longitude);
  console.log(distance);
  Class.find()
    .then((classes) => {
      res.render('yoga/search', { classes });
    })
    .catch((error) => {
      next(error);
    });
});

// Create new classes
router.get('/create', routeGuard, (req, res, next) => {
  res.render('yoga/create');
});

router.post(
  '/create',
  routeGuard,
  uploadMiddleware.single('image'),
  (req, res, next) => {
    const data = req.body;
    let image;
    if (req.file) {
      image = req.file.path;
    }
    const classes = new Class({
      name: data.name,
      image: data.image,
      teacher: data.teacher,
      location: {
        coordinates: [data.longitude, data.latitude]
      },
      level: data.level,
      category: data.category,
      date: data.date
    });
    classes
      .save()
      .then((classes) => {
        console.log('Class created');
        res.render('yoga/search');
        //res.render('yoga/${class._id}');
      })
      .catch((error) => {
        next(error);
      });
  }
);

//Display one class

router.get('/class:id', (req, res, next) => {
  const id = req.params.id;
  Class.findById(id)
    .then((classes) => {
      if (classes === null) {
        const error = new Error('Class does not exist.');
        error.status = 404;
        next(error);
      } else {
        res.render('yoga/detailpage', { classes });
      }
    })
    .catch((error) => {
      if (error.kind === 'ObjectId') {
        error.status = 404;
      }
      next(error);
    });
});

module.exports = router;
