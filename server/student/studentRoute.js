'use strict';

const express = require('express');
const studentRouter = express.Router();
const studentPublicRouter = express.Router();
const studentController = require('./studentController');

/** PATCH : update profile */
studentRouter.patch('/updateProfile', (req, res, next) => {
  studentController.updateProfile(req, res);
});

/******************************** Public Routes ******************************/
studentPublicRouter.get('/viewProfile', (req, res, next) => {
  studentController.viewProfile(req, res);
});

module.exports = {
  studentRouter,
  studentPublicRouter,
};
