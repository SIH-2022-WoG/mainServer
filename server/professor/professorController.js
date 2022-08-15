'use strict';

const professorService = require('./professorService');
const responseHelper = require('../utils/responseHelper');
const collegeService = require('../college/collegeService');
const responseMessage = require('../utils/responseMessage');

module.exports = {
  updateProfile: (req, res) =>
    professorService.updateProfile(req, (err, resdata, statuscode) => {
      responseHelper(err, res, resdata, statuscode);
    }),

  createCollege: (req, res) => {
    if (!req.user) {
      const response = new responseMessage.GenericFailureMessage();
      response.message = 'Professor ID missing';
      console.log('INFO ::: Professor ID missing');
      return responseHelper(null, res, response, response.code);
    }

    req.body.createdBy = req.user._id;

    collegeService.createCollege(req.body, (err, resdata, statuscode) => {
      responseHelper(err, res, resdata, statuscode);
    });
  },

  viewProfile: (req, res) =>
    professorService.viewProfile(req, (err, resdata, statuscode) => {
      responseHelper(err, res, resdata, statuscode);
    }),

  textSearch: (req, res) => {
    professorService.textSearch(req, (err, data, code) => {
      responseHelper(err, res, data, code);
    });
  },
};
