'use strict';

const studentService = require('./studentService');
const responseHelper = require('../utils/responseHelper');

module.exports = {
  updateProfile: (req, res) =>
    studentService.updateProfile(req, (err, resdata, statuscode) => {
      responseHelper(err, res, resdata, statuscode);
    }),
};
