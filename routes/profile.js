'use strict';

const express = require('express');
const router = new express.Router();
const routeGuard = require('../middleware/route-guard');

const User = require('../models/user');
const Class = require('../models/class');

router.get('/', routeGuard, (req, res, next) => {
  Class.find()
    .then((classes) => {
      console.log('hello classes');

      res.render('profile/teacher', { title: 'Hello World!' });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
