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
  }):
)*/

router.get('/search', (req, res, next) => {
  const latitude = req.query.latitude;
  const longitude = req.query.latitude;
  const distance = req.query.latitude;
  /*for (classlisting of classes) {
    var rawstartdate = classlisting.startdate;
    var starttime = moment(rawstartdate, "ddd MMM Do YYYY HH:mm:SS").format('HH:mm');

  }*/

  req.session.location = { latitude, longitude };

  Class.find()
    .where('location')
    .within()
    .circle({
      center: [longitude, latitude],
      radius: 100000,
      unique: true
    })
    .sort({ date: 1 })
    .sort({ location: -1 })
    .then((classes) => {
      console.log('location');
      console.log(latitude, longitude);
      res.render('yoga/search', {
        classes,
        latitude: latitude,
        longitude: longitude
      });
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

//Display one class

router.get('/class/:id', (req, res, next) => {
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

// Edit classes

router.get('/class/:id/edit', routeGuard, (req, res, next) => {
  const id = req.params.id;

  Class.findById(id)
    .then((classes) => {
      console.log('start editing your class');
      res.render('yoga/edit', { classes });
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

router.post('/class/:id', (req, res, next) => {
  const id = req.params.id;
  // const data = req.body;
  Class.findByIdAndUpdate(id, {
    // name: data.name,
    // image: data.image,
    // teacher: data.teacher,
    // location: {
    //   coordinates: [data.longitude, data.latitude]
    // },
    // level: data.level,
    // category: data.category,
    // date: data.date
  })
    .then((classes) => {
      console.log('Class edited');
      res.redirect(`/yoga/class/${id}`);
    })
    .catch((err) => {
      next(err);
    });
});

// Delete classes

router.post('/class:id/delete', (req, res, next) => {
  const id = req.params.id;
  Class.findByIdAndRemove(id)
    .then(() => {
      res.redirect('/yoga/classes');
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
