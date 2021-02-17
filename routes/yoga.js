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

  const year = today.toISOString().substring(0, 4);
  const month = today.toISOString().substring(5, 7);
  const todayasstring = today.toISOString().substring(8, 10);

  function addxvaluetoday(todayasstring, valuetoadd) {
    const todayasanumber = parseInt(todayasstring);
    const newdayasanumber = todayasanumber + valuetoadd;
    const newday = newdayasanumber.toString();
    return newday;
  }

  const tomorrowday = addxvaluetoday(todayasstring, 1);
  const tomorrowdayAndone = addxvaluetoday(todayasstring, 2);
  const tomorrowdayAndtwo = addxvaluetoday(todayasstring, 3);
  const tomorrowdayAndthree = addxvaluetoday(todayasstring, 4);
  const tomorrowdayAndfour = addxvaluetoday(todayasstring, 5);
  const tomorrowdayAndfive = addxvaluetoday(todayasstring, 6);

  console.log(tomorrowday);

  const starttimeTomorrow =
    year + '-' + month + '-' + tomorrowday + 'T' + '00:00:01.000+00:00';

  const endtimeTomorrow =
    year + '-' + month + '-' + tomorrowday + 'T' + '23:59:59.999+00:00';

  console.log('tomorrow');
  console.log(starttimeTomorrow);
  console.log(endtimeTomorrow);

  const starttimeTomorrowAndone =
    year + '-' + month + '-' + tomorrowdayAndone + 'T' + '00:00:01.000+00:00';

  const endtimeTomorrowAndone =
    year + '-' + month + '-' + tomorrowdayAndone + 'T' + '23:59:59.999+00:00';

  console.log('tomorrow + 1');
  console.log(starttimeTomorrowAndone);
  console.log(endtimeTomorrowAndone);

  const starttimeTomorrowAndtwo =
    year + '-' + month + '-' + tomorrowdayAndtwo + 'T' + '00:00:01.000+00:00';

  const endtimeTomorrowAndtwo =
    year + '-' + month + '-' + tomorrowdayAndtwo + 'T' + '23:59:59.999+00:00';

  console.log('tomorrow + 2');
  console.log(starttimeTomorrowAndtwo);
  console.log(endtimeTomorrowAndtwo);

  const starttimeTomorrowAndthree =
    year + '-' + month + '-' + tomorrowdayAndthree + 'T' + '00:00:01.000+00:00';

  const endtimeTomorrowAndthree =
    year + '-' + month + '-' + tomorrowdayAndthree + 'T' + '23:59:59.999+00:00';

  console.log('tomorrow + 3');
  console.log(starttimeTomorrowAndthree);
  console.log(endtimeTomorrowAndthree);

  const starttimeTomorrowAndfour =
    year + '-' + month + '-' + tomorrowdayAndfour + 'T' + '00:00:01.000+00:00';

  const endtimeTomorrowAndfour =
    year + '-' + month + '-' + tomorrowdayAndfour + 'T' + '23:59:59.999+00:00';

  console.log('tomorrow + 4');
  console.log(starttimeTomorrowAndfour);
  console.log(endtimeTomorrowAndfour);

  const starttimeTomorrowAndfive =
    year + '-' + month + '-' + tomorrowdayAndfive + 'T' + '00:00:01.000+00:00';

  const endtimeTomorrowAndfive =
    year + '-' + month + '-' + tomorrowdayAndfive + 'T' + '23:59:59.999+00:00';

  console.log('tomorrow + 5');
  console.log(starttimeTomorrowAndfive);
  console.log(endtimeTomorrowAndfive);

  const latitude = req.query.latitude;
  const longitude = req.query.latitude;
  const distance = req.query.latitude;

  //Save Location in session cookie
  req.session.location = { latitude, longitude };
  console.log(req.session.location);

  //What if session cookie location is not defined
  /*if (typeof latitiude != 'undefined') {
    console.log('unable to locate you. Using default location');
    latitiude = -8.83;
    longitude = 115.09;
  }*/

  const dayindication = req.query.dayindication;
  const categoryindication = req.query.categoryindication;

  if (dayindication == 'today') {
    console.log('dayindication is today');
    console.log(categoryindication);
    const setdayfilter = starttimeToday;

    Class.find()
      /* .where('location')
      .within()
      .circle({
        center: [longitude, latitude],
        radius: 100000,
        unique: true
      })*/
      .where({ startdate: { $gte: starttimeToday, $lt: endtimeToday } })
      //.where({ category: categoryindication })

      .sort({ startdate: 1 })
      .sort({ location: -1 })
      .then((classes) => {
        //console.log('location');
        //console.log(latitude, longitude);
        res.render('yoga/search', {
          classes,
          latitude: latitude,
          longitude: longitude,
          setdayfilter
        });
      })
      .catch((error) => {
        console.log(error);
        next(error);
      });
  } else if (dayindication == 'tomorrow') {
    console.log('dayindication is tomorrow');
    console.log(categoryindication);
    const setdayfilter = starttimeTomorrow;

    Class.find()
      /*.where('location')
      .within()
      .circle({
        center: [longitude, latitude],
        radius: 100000,
        unique: true
      })*/
      .where({ startdate: { $gte: starttimeTomorrow, $lt: endtimeTomorrow } })
      //.where({ category: categoryindication })

      .sort({ startdate: 1 })
      .sort({ location: -1 })
      .then((classes) => {
        //console.log('location');
        //console.log(latitude, longitude);
        res.render('yoga/search', {
          classes,
          latitude: latitude,
          longitude: longitude,
          setdayfilter
        });
      })
      .catch((error) => {
        console.log(error);
        next(error);
      });
  } else if (dayindication == 'tomorrowandone') {
    console.log('dayindication is tomorrowandone');
    console.log(categoryindication);
    const setdayfilter = starttimeTomorrowAndone;

    Class.find()
      /*.where('location')
        .within()
        .circle({
          center: [longitude, latitude],
          radius: 100000,
          unique: true
        })*/
      .where({
        startdate: { $gte: starttimeTomorrowAndone, $lt: endtimeTomorrowAndone }
      })
      //.where({ category: categoryindication })

      .sort({ startdate: 1 })
      .sort({ location: -1 })
      .then((classes) => {
        //console.log('location');
        //console.log(latitude, longitude);
        res.render('yoga/search', {
          classes,
          latitude: latitude,
          longitude: longitude,
          setdayfilter
        });
      })
      .catch((error) => {
        console.log(error);
        next(error);
      });
  } else if (dayindication == 'tomorrowandtwo') {
    console.log('dayindication is tomorrowandtwo');
    console.log(categoryindication);
    const setdayfilter = starttimeTomorrowAndtwo;

    Class.find()
      /*.where('location')
          .within()
          .circle({
            center: [longitude, latitude],
            radius: 100000,
            unique: true
          })*/
      .where({
        startdate: { $gte: starttimeTomorrowAndtwo, $lt: endtimeTomorrowAndtwo }
      })
      //.where({ category: categoryindication })

      .sort({ startdate: 1 })
      .sort({ location: -1 })
      .then((classes) => {
        //console.log('location');
        //console.log(latitude, longitude);
        res.render('yoga/search', {
          classes,
          latitude: latitude,
          longitude: longitude,
          setdayfilter
        });
      })
      .catch((error) => {
        console.log(error);
        next(error);
      });
  } else if (dayindication == 'tomorrowandthree') {
    console.log('dayindication is tomorrowandthree');
    console.log(categoryindication);
    const setdayfilter = starttimeTomorrowAndthree;

    Class.find()
      /*.where('location')
            .within()
            .circle({
              center: [longitude, latitude],
              radius: 100000,
              unique: true
            })*/
      .where({
        startdate: {
          $gte: starttimeTomorrowAndthree,
          $lt: endtimeTomorrowAndthree
        }
      })
      //.where({ category: categoryindication })

      .sort({ startdate: 1 })
      .sort({ location: -1 })
      .then((classes) => {
        //console.log('location');
        //console.log(latitude, longitude);
        res.render('yoga/search', {
          classes,
          latitude: latitude,
          longitude: longitude,
          setdayfilter
        });
      })
      .catch((error) => {
        console.log(error);
        next(error);
      });
  } else if (dayindication == 'tomorrowandfour') {
    console.log('dayindication is tomorrowandfour');
    console.log(categoryindication);
    const setdayfilter = starttimeTomorrowAndfour;

    Class.find()
      /*.where('location')
              .within()
              .circle({
                center: [longitude, latitude],
                radius: 100000,
                unique: true
              })*/
      .where({
        startdate: {
          $gte: starttimeTomorrowAndfour,
          $lt: endtimeTomorrowAndfour
        }
      })
      //.where({ category: categoryindication })

      .sort({ startdate: 1 })
      .sort({ location: -1 })
      .then((classes) => {
        //console.log('location');
        //console.log(latitude, longitude);
        res.render('yoga/search', {
          classes,
          latitude: latitude,
          longitude: longitude,
          setdayfilter
        });
      })
      .catch((error) => {
        console.log(error);
        next(error);
      });
  } else if (dayindication == 'tomorrowandfive') {
    console.log('dayindication is tomorrowandfive');
    console.log(categoryindication);
    const setdayfilter = starttimeTomorrowAndfive;
    console.log(setdayfilter);

    Class.find()
      /*.where('location')
                .within()
                .circle({
                  center: [longitude, latitude],
                  radius: 100000,
                  unique: true
                })*/
      .where({
        startdate: {
          $gte: starttimeTomorrowAndfive,
          $lt: endtimeTomorrowAndfive
        }
      })
      //.where({ category: categoryindication })

      .sort({ startdate: 1 })
      .sort({ location: -1 })
      .then((classes) => {
        //console.log('location');
        //console.log(latitude, longitude);
        res.render('yoga/search', {
          classes,
          latitude: latitude,
          longitude: longitude,
          setdayfilter
        });
      })
      .catch((error) => {
        console.log(error);
        next(error);
      });
  } else {
    console.log('no dayindication');
    console.log(categoryindication);
    const setdayfilter = 'All dates';

    Class.find()
      /* .where('location')
      .within()
      .circle({
        center: [longitude, latitude],
        radius: 100000,
        unique: true
      })*/
      .where({ startdate: { $gte: starttimeToday } })
      //.where({ category: categoryindication })

      .sort({ startdate: 1 })
      .sort({ location: -1 })
      .then((classes) => {
        //console.log('location');
        //console.log(latitude, longitude);
        res.render('yoga/search', {
          classes,
          latitude: latitude,
          longitude: longitude,
          setdayfilter
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

router.get('/filter', (req, res, next) => {
  res.render('yoga/filter');
});

module.exports = router;
