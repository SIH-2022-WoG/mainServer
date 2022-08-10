'use strict';

const express = require('express');
const collegeProtectedRouter = express.Router();
const collegeController = require('./collegeController');

collegeProtectedRouter.patch('/updateProfile', (req, res, next) => {
  collegeController.updateProfile(req, res);
});

module.exports = { collegeProtectedRouter };
