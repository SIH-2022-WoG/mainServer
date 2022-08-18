'use strict';

const thesisService = require('./thesisService');
const responseHelper = require('../utils/responseHelper');

module.exports = {
  getAllThesis: (req, res) => {
    thesisService.getAllThesis(req, (err, resData, statusCode) => {
      responseHelper(err, res, resData, statusCode);
    });
  },
};
