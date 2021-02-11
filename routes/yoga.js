//'use strict';

const express = require('express');
const router = new express.Router();
const routeGuard = require('./../middleware/route-guard');

const User = require('./../models/user');
const Class = require('./../models/class');

//STORAGE CLOUDINARY
const uploadMiddleware = require('./../middleware/file-upload');

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
    console.log(data);
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

//Display all classes

/* LOCATION NEAR TRY FAILED
Class.find({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [115.0849, -8.82914] },
        $minDistance: 1000,
        $maxDistance: 5000
      }
    }
  })
)*/

router.get('/search', (req, res, next) => {
  const latitude = req.query.latitude;
  const longitude = req.query.latitude;
  const distance = req.query.latitude;

  console.log('log req.query via router/terminal:');
  console.log(req.query);

  Class.find()
    .where('location')
    .within()
    .circle({
      center: [longitude, latitude],
      radius: 120,
      unique: true
    })
    .then((classes) => {
      res.render('yoga/search', { classes });
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

//Display one class

router.get('/class:id', (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  const query = req.query;
  console.log('log detailpage consoles');
  console.log(req.params.id);
  console.log(req.body);
  console.log(req.query);

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
