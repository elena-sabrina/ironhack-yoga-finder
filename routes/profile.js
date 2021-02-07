'use strict';

const express = require('express');
const router = new express.Router();
const routeGuard = require('../middleware/route-guard');

const User = require('../models/user');
const Class = require('../models/class');

/*router.get('/profile', routeGuard, (req, res, next) => {
  Class.find()
    .then((classes) => {
      res.render('teacher/profile', { classes });
    })
    .catch((error) => {
      next(error);
    });
});*/

router.get('/', routeGuard, (req, res, next) => {
  res.render('profile/teacher');
});

module.exports = router;
