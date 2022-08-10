'use strict';

const collegeService = require('./collegeService');
const responseHelper = require('../utils/responseHelper');

module.exports = {
  updateProfile: (req, res) => {
    collegeService.updateProfile(req, (err, resData, statusCode) => {
      responseHelper(err, res, resData, statusCode);
    });
  },

  getAllActiveColleges: (req, res) => {
    req.searchQuery = { status: 'active' };
    collegeService.getColleges(req, (err, resData, statusCode) => {
      responseHelper(err, res, resData, statusCode);
    });
  },

  viewCollege: (req, res) => {
    collegeService.viewCollege(req, (err, resData, statusCode) => {
      responseHelper(err, res, resData, statusCode);
    });
  },
};
