'use strict';

const { Router } = require('express');

const bcryptjs = require('bcryptjs');
const User = require('./../models/user');

//STORAGE CLOUDINARY
const uploadMiddleware = require('./../middleware/file-upload');

const router = new Router();

//ROUTES

router.get('/sign-up', (req, res, next) => {
  res.render('authentication/sign-up');
});

router.post(
  '/sign-up',
  uploadMiddleware.single('picture'),
  (req, res, next) => {
    const { name, email, password } = req.body;
    let picture;
    if (req.file) {
      picture = req.file.path;
    }

    User.findOne({
      email: email
    })
      .then((user) => {
        if (user) {
          throw new Error('There is already a user with this email');
        } else {
          return bcryptjs.hash(password, 12);
        }
      })
      .then((passwordHashAndSalt) => {
        //const picture = req.file ? req.file.path : undefined;
        let picture;
        if (req.file) {
          picture = req.file.path;
        }
        console.log(picture);
        return User.create({
          name,
          email,
          passwordHashAndSalt: passwordHashAndSalt,
          picture: picture
        });
      })
      .then((user) => {
        req.session.userId = user._id;
        res.redirect('/profile');
      })
      .catch((error) => {
        next(error);
      });
  }
);

router.get('/sign-in', (req, res, next) => {
  res.render('authentication/sign-in');
});

router.post('/sign-in', (req, res, next) => {
  let user;
  const { email, password } = req.body;
  User.findOne({ email })
    .then((document) => {
      if (!document) {
        return Promise.reject(new Error("There's no user with that email."));
      } else {
        user = document;
        return bcryptjs.compare(password, user.passwordHashAndSalt);
      }
    })
    .then((result) => {
      if (result) {
        req.session.userId = user._id;

        res.redirect('/profile');
      } else {
        return Promise.reject(
          new Error("Your password and email don't match.")
        );
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/sign-out', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
