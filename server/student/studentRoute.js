'use strict';

const express = require('express');
const studentRouter = express.Router();
const studentPublicRouter = express.Router();
const studentController = require('./studentController');

/** PATCH : update profile */
studentRouter.patch('/updateProfile', (req, res, next) => {
  studentController.updateProfile(req, res);
});

/** POST : create a thesis */
studentRouter.post('/createThesis', (req, res, next) => {
  studentController.createThesis(req, res);
});

/** POST : upload NonOCR Images */
studentRouter.post('/uploadNonOCR', (req, res, next) => {
  studentController.uploadNonOCR(req, res);
});

/******************************** Public Routes ******************************/
studentPublicRouter.get('/viewProfile', (req, res, next) => {
  studentController.viewProfile(req, res);
});

module.exports = {
  studentRouter,
  studentPublicRouter,
};
