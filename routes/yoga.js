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
    console.log(req.body);
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
      startdate: data.startdate,
      enddate: data.enddate
    });
    classes
      .save()
      .then((classes) => {
        res.redirect('/locate');
        //res.render('yoga/${class._id}');
      })
      .catch((error) => {
        next(error);
      });
  }
);

//Display all classes Today

router.get('/search', (req, res, next) => {
  // Setting the Dates
  //Today Endtime
  const today = new Date(Date.now());
  const todaydateandtimenow = today.toISOString().substring(0, 23);
  const todaydate = today.toISOString().substring(0, 11);
  const starttimeToday = todaydateandtimenow + '+00:00';
  const endtimeToday = todaydate + '23:59:59.999+00:00';

  console.log('today');
  console.log(starttimeToday);
  console.log(endtimeToday);

  //Tomorrow Endtime
  const tomorrow = new Date(Date.now());
  tomorrow.setDate(tomorrow.getDate() + 1);

  const starttimeTomorrow =
    tomorrow.getFullYear() +
    '-' +
    ((tomorrow.getMonth() < 10 ? '0' : '') + tomorrow.getMonth()) +
    '-' +
    ((tomorrow.getDate() < 10 ? '0' : '') + tomorrow.getDate()) +
    'T' +
    '00:00:00.001+00:00';

  const endtimeTomorrow =
    tomorrow.getFullYear() +
    '-' +
    ((tomorrow.getMonth() < 10 ? '0' : '') + tomorrow.getMonth()) +
    '-' +
    ((tomorrow.getDate() < 10 ? '0' : '') + tomorrow.getDate()) +
    'T' +
    '23:59:59.999+00:00';

  console.log('tomorrow');
  console.log(starttimeTomorrow);
  console.log(endtimeTomorrow);

  const latitude = req.query.latitude;
  const longitude = req.query.latitude;
  const distance = req.query.latitude;

  //Save Location in session cookie
  //req.session.location = { latitude, longitude };
  //console.log(req.session.location);

  //What if session cookie location is not defined
  /*if (typeof latitiude != 'undefined') {
    console.log('unable to locate you. Using default location');
    latitiude = -8.83;
    longitude = 115.09;
  }*/

  const dayindication = req.query.dayindication;
  console.log('dayindication');
  console.log(dayindication);

  if (dayindication == 'today') {
    console.log('dayindication is today');
    Class.find()
      .where('location')
      .within()
      .circle({
        center: [longitude, latitude],
        radius: 100000,
        unique: true
      })
      .where({ startdate: { $gte: starttimeToday, $lt: endtimeToday } })
      //.where({ startdate: { $gte: starttime, $lt: endtime } })

      .sort({ startdate: 1 })
      .sort({ location: -1 })
      .then((classes) => {
        //console.log('location');
        //console.log(latitude, longitude);
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
  } else if (dayindication == 'tomorrow') {
    console.log('dayindication is tomorrow');

    Class.find()
      .where('location')
      .within()
      .circle({
        center: [longitude, latitude],
        radius: 100000,
        unique: true
      })
      .where({ startdate: { $gte: starttimeTomorrow, $lt: endtimeTomorrow } })
      //.where({ startdate: { $gte: starttime, $lt: endtime } })

      .sort({ startdate: 1 })
      .sort({ location: -1 })
      .then((classes) => {
        //console.log('location');
        //console.log(latitude, longitude);
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
  } else {
    console.log('no dayindication');

    Class.find()
      .where('location')
      .within()
      .circle({
        center: [longitude, latitude],
        radius: 100000,
        unique: true
      })
      .where({ startdate: { $gte: starttimeToday } })
      //.where({ startdate: { $gte: starttime, $lt: endtime } })

      .sort({ startdate: 1 })
      .sort({ location: -1 })
      .then((classes) => {
        //console.log('location');
        //console.log(latitude, longitude);
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
  }
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
    // startdate: data.startdate,
    // enddate: data.enddate
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

router.get('/class/:id/confirm-deletion', routeGuard, (req, res, next) => {
  const id = req.params.id;

  Class.findById(id)
    .then((classes) => {
      console.log('loading deletion approval page');
      res.render('notifications/okdelete', { classes });
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

router.post('/class/:id/delete', (req, res, next) => {
  const id = req.params.id;
  Class.findByIdAndRemove(id)
    .then(() => {
      res.redirect('/profile');
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
