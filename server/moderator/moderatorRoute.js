'use strict';

const express = require('express');
const moderatorRouter = express.Router();
const moderatorController = require('./moderatorController');

/** GET : pending colleges */
moderatorRouter.get('/pendingColleges', (req, res, next) => {
  moderatorController.getPendingColleges(req, res);
});

/** PATCH : activate/reject/deactivate a college */
moderatorRouter.patch('/setStatus', (req, res, next) => {
  moderatorController.setStatus(req, res);
});

module.exports = {
  moderatorRouter,
};
