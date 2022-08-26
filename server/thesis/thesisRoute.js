'use strict';

const express = require('express');
const thesisRouter = express.Router();
const thesisController = require('./thesisController');

thesisRouter.get('/viewAll', (req, res, next) => {
  thesisController.getAllThesis(req, res);
});

thesisRouter.get('/viewOne', (req, res, next) => {
  thesisController.viewOne(req, res);
});

thesisRouter.post('/evaluate', (req, res, next) => {
  thesisController.evaluateThesis(req, res);
});

module.exports = {
  thesisRouter,
};
