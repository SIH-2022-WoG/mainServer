'use strict';

const collegeService = require('./collegeService');
const responseHelper = require('../utils/responseHelper');

module.exports = {
  updateProfile: (req, res) => {
    collegeService.updateProfile(req, (err, resData, statusCode) => {
      responseHelper(err, res, resData, statusCode);
    });
  },
};
