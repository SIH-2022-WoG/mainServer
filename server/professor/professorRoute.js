'use strict';

const express = require('express');
const professorController = require('./professorController');
const professorRouter = express.Router();

professorRouter.patch('/updateProfile', (req, res, next) => {
  professorController.updateProfile(req, res);
});

module.exports = {
  professorRouter,
};
