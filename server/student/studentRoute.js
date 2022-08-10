'use strict';

const express = require('express');
const studentRouter = express.Router();
const studentController = require('./studentController');

/** PATCH : update profile */
studentRouter.patch('/updateProfile', (req, res, next) => {
  studentController.updateProfile(req, res);
});

module.exports = {
  studentRouter,
};
