'use strict';

const collegeService = require('../college/collegeService');
const responseHelper = require('../utils/responseHelper');

module.exports = {
  getPendingColleges: (req, res) =>
    collegeService.getColleges(req, (err, resdata, statuscode) => {
      responseHelper(err, res, resdata, statuscode);
    }),
};
