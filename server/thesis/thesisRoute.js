'use strict';

const express = require('express');
const thesisRouter = express.Router();
const thesisController = require('./thesisController');

thesisRouter.get('/viewAll', (req, res, next) => {
  thesisController.getAllThesis(req, res);
});

module.exports = {
  thesisRouter,
};
