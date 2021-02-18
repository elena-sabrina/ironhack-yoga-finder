'use strict';

const express = require('express');
const router = new express.Router();
const routeGuard = require('../middleware/route-guard');

const User = require('../models/user');
const Class = require('../models/class');

router.get('/', routeGuard, (req, res, next) => {
  const userId = req.session.userId;

  Class.find()
    .where({ teacherid: userId })

    .then((classes) => {
      console.log('hello classes');
      res.render('profile/teacher', { classes, userId });
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/:id/edit', routeGuard, (req, res, next) => {
  const id = req.params.id;

  User.findByIdAndUpdate(id, {
    //name
    //email,
    //passwordHashAndSalt: passwordHashAndSalt,
    //picture
  })
    .then((users) => {
      res.render('profile/edit');
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

module.exports = router;
