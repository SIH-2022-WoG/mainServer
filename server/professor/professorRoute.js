'use strict';

const express = require('express');
const professorController = require('./professorController');
const professorRouter = express.Router();
const professorPublicRouter = express.Router();

/**PATCH : update a professor profile */
professorRouter.patch('/updateProfile', (req, res, next) => {
  professorController.updateProfile(req, res);
});

/**GET : view a professor */
professorPublicRouter.get('/viewProfile', (req, res, next) => {
  professorController.viewProfile(req, res);
});

/**GET : paginated professors */

/************************** College related routes ****************************************/
/** POST : Create a college */
professorRouter.post('/createCollege', (req, res, next) => {
  professorController.createCollege(req, res);
});

module.exports = {
  professorRouter,
  professorPublicRouter,
};
