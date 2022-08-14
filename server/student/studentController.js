'use strict';

const studentService = require('./studentService');
const responseHelper = require('../utils/responseHelper');
const thesisService = require('../thesis/thesisService');

module.exports = {
  updateProfile: (req, res) =>
    studentService.updateProfile(req, (err, resdata, statuscode) => {
      responseHelper(err, res, resdata, statuscode);
    }),

  viewProfile: (req, res) =>
    studentService.viewProfile(req, (err, resdata, statuscode) => {
      responseHelper(err, res, resdata, statuscode);
    }),

  /** Incomplete function */
  createThesis: (req, res) => {
    const user = req.user._id;
  },
};
