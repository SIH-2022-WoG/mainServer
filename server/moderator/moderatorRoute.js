'use strict';

const express = require('express');
const moderatorRouter = express.Router();
const moderatorController = require('./moderatorController');

moderatorRouter.get('/pendingColleges', (req, res, next) => {
  moderatorController.getPendingColleges(req, res);
});

module.exports = {
  moderatorRouter,
};
