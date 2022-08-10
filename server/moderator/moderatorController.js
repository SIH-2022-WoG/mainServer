'use strict';

const collegeService = require('../college/collegeService');
const responseHelper = require('../utils/responseHelper');

module.exports = {
  getPendingColleges: (req, res) => {
    req.searchQuery = { status: 'pending' };
    collegeService.getColleges(req, (err, resdata, statuscode) => {
      responseHelper(err, res, resdata, statuscode);
    });
  },

  setStatus: (req, res) => {
    const user = req.user;
    req.body.moderatedBy = user._id;

    collegeService.updateProfile(req, (err, resdata, statuscode) => {
      responseHelper(err, res, resdata, statuscode);
    });
  },
};
