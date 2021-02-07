'use strict';

const express = require('express');
const router = new express.Router();
const routeGuard = require('./../middleware/route-guard');

const User = require('./../models/user');
const Class = require('./../models/class');

//STORAGE CLOUDINARY
const uploadMiddleware = require('./../middleware/file-upload');

//Display all classes

router.get('/', (req, res, next) => {
  Class.find()
    .then((classes) => {
      res.render('yoga/index', { classes });
    })
    .catch((error) => {
      next(error);
    });
});

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
    let image;
    if (req.file) {
      image = req.file.path;
    }
    const classes = new Class({
      name: data.name,
      teacher: data.teacher,
      place: data.place,
      image: image
    });
    classes
      .save()
      .then((classes) => {
        console.log('Class created');
        res.render('yoga/create');
      })
      .catch((error) => {
        next(error);
      });
  }
);

//Display one class

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  Class.findById(id)
    .then((classes) => {
      if (classes === null) {
        const error = new Error('Class does not exist.');
        error.status = 404;
        next(error);
      } else {
        res.render('yoga/detailpage', { classes: classes });
      }
    })
    .catch((error) => {
      if (error.kind === 'ObjectId') {
        error.status = 404;
      }
      next(error);
    });
});

// MAP MAP MAP

function initMap() {
  const mapElement = document.getElementById('google-map');

  let map = new google.maps.Map(mapElement, {
    center: { lat: 38.7134585, lng: -9.1457345 },
    zoom: 13
  });

  const marker = new google.maps.Marker({
    position: { lat: 38.7154585, lng: -9.1407345 },
    map: map
  });

  marker.addListener('click', (event) => {
    alert('Welcome home!');
  });

  const addedMarkers = [];

  map.addListener('click', (event) => {
    const latitude = event.latLng.lat();
    const longitude = event.latLng.lng();

    const addedMarker = new google.maps.Marker({
      position: {
        lat: latitude,
        lng: longitude
      },
      map: map
    });

    addedMarker.addListener('click', () => {
      // Taking marker out of map
      // when marker is clicked
      addedMarker.setMap(null);
    });

    addedMarkers.push(addedMarker);
  });

  setInterval(() => {
    for (const item of addedMarkers) {
      item.setMap(null);
    }
  }, 10000);

  const locationTrigger = document.getElementById('locate-user');

  locationTrigger.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates = position.coords;
        const latitude = coordinates.latitude;
        const longitude = coordinates.longitude;
        const locationMarker = new google.maps.Marker({
          position: {
            lat: latitude,
            lng: longitude
          },
          map: map
          // map
        });
      },
      (error) => {
        console.log(error);
      }
    );
  });
}

module.exports = router;
