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
  User.findById(id)
    .then((users) => {
      res.render('profile/edit', { users });
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

router.post('/:id/edit', routeGuard, (req, res, next) => {
  const id = req.params.id;
  const { name, email, password } = req.body;
  console.log(req.body);
  User.findByIdAndUpdate(id, {
    name,
    email
    //passwordHashAndSalt: passwordHashAndSalt,
    //picture: picture
  })
    .then((users) => {
      res.redirect('/profile');
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

module.exports = router;
