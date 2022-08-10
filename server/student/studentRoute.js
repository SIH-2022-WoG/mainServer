'use strict';

const express = require('express');
const studentRouter = express.Router();
const studentController = require('./studentController');

studentRouter.patch('/updateProfile', (req, res, next) => {
  studentController.updateProfile(req, res);
});

module.exports = {
  studentRouter,
};
