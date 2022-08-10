'use strict';

const express = require('express');
const professorController = require('./professorController');
const professorRouter = express.Router();

/**PATCH : update a professor profile */
professorRouter.patch('/updateProfile', (req, res, next) => {
  professorController.updateProfile(req, res);
});

/**GET : get a professor */

/**GET : paginated professors */

/************************** College related routes ****************************************/
/** POST : Create a college */
professorRouter.post('/createCollege', (req, res, next) => {
  professorController.createCollege(req, res);
});

module.exports = {
  professorRouter,
};
