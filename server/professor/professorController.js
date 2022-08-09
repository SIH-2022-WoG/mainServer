'use strict';

const professorService = require('./professorService');
const responseHelper = require('../utils/responseHelper');

module.exports = {
  updateProfile: (req, res) =>
    professorService.updateProfile(req, (err, resdata, statuscode) => {
      responseHelper(err, res, resdata, statuscode);
    }),
};
