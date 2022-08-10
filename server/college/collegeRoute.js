'use strict';

const express = require('express');
const collegeProtectedRouter = express.Router();
const collegePublicRouter = express.Router();
const collegeController = require('./collegeController');

/*************** Protected Routes *******************/
/**PATCH : update Profile */
collegeProtectedRouter.patch('/updateProfile', (req, res, next) => {
  collegeController.updateProfile(req, res);
});

/********************************Public Routes****************** */

/**GET : get all active colleges */
collegePublicRouter.get('/getAllActiveColleges', (req, res, next) => {
  collegeController.getAllActiveColleges(req, res);
});

/**GET : view 1 college */
collegePublicRouter.get('/view', (req, res, next) => {
  collegeController.viewCollege(req, res);
});

module.exports = { collegeProtectedRouter, collegePublicRouter };
