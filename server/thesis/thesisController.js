'use strict';

const thesisService = require('./thesisService');
const responseHelper = require('../utils/responseHelper');

module.exports = {
  getAllThesis: (req, res) => {
    thesisService.getAllThesis(req, (err, resData, statusCode) => {
      responseHelper(err, res, resData, statusCode);
    });
  },

  viewOne: (req, res) => {
    thesisService.viewOne(req, (err, resData, statusCode) => {
      return responseHelper(err, res, resData, statusCode);
    });
  },
};
