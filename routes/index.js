'use strict';

const express = require('express');
const router = new express.Router();
const routeGuard = require('./../middleware/route-guard');

const User = require('./../models/user');
const Class = require('./../models/class');

router.get('/', (req, res, next) => {
  res.render('home', { title: 'Hello World!' });
});

module.exports = router;
