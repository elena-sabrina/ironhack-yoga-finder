'use strict';

const express = require('express');
const router = new express.Router();
const routeGuard = require('./../middleware/route-guard');

const User = require('./../models/user');
const Class = require('./../models/class');

router.get('/', (req, res, next) => {
  res.render('home', { title: 'Hello World!' });
});

router.get('/locate', (req, res, next) => {
  if (req.session.location) {
    const longitude = req.session.location.longitude;
    const latitude = req.session.location.latitude;
    res.redirect(
      `/yoga/search?longitude=${longitude}&latitude=${latitude}&distance=10000&dayindication=today&categoryindication=any`
    );
  } else {
    res.render('notifications/locate');
  }
});

module.exports = router;
