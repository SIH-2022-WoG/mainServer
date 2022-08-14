'use strict';

const express = require('express');
const moderatorRouter = express.Router();
const moderatorController = require('./moderatorController');

/** GET : pending colleges */
moderatorRouter.get('/pendingColleges', (req, res, next) => {
  moderatorController.getPendingColleges(req, res);
});

/**GET : pending students */
moderatorRouter.get('/pendingStudents', (req, res, next) => {
  moderatorController.getPendingStudents(req, res);
});

/**GET : pending professors */
moderatorRouter.get('/pendingProfessors', (req, res, next) => {
  moderatorController.getPendingProfessors(req, res);
});

/** PATCH : activate/reject/deactivate a student */
moderatorRouter.patch('/student/setStatus', (req, res, next) => {
  moderatorController.setStatusStudent(req, res);
});

/** PATCH : activate/reject/deactivate a professor */
moderatorRouter.patch('/professor/setStatus', (req, res, next) => {
  moderatorController.setStatusProfessor(req, res);
});

/** PATCH : activate/reject/deactivate a college */
moderatorRouter.patch('/college/setStatus', (req, res, next) => {
  moderatorController.setStatusCollege(req, res);
});

module.exports = {
  moderatorRouter,
};
