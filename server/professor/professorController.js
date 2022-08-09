'use strict';

const professorService = require('./professorService');
const responseHelper = require('../utils/responseHelper');

module.exports = {
  updateProfile: professorService.updateProfile(
    req,
    (err, resdata, statuscode) => {
      responseHelper(null, err, resdata, statuscode);
    }
  ),
};
