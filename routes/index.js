'use strict';

const express = require('express');
const router = new express.Router();
const routeGuard = require('./../middleware/route-guard');

router.get('/', (req, res, next) => {
  res.render('home', { title: 'Hello World!' });
});

router.get('/profile', routeGuard, (req, res, next) => {
  res.render('teacher/profile');
});

module.exports = router;
