'use strict';

const College = require('./collegeModel');
const responseMessage = require('../utils/responseMessage');

module.exports = {
  createCollege: async (body, callback) => {
    let response;
    try {
      const college = await College.create(body);
      response = new responseMessage.GenericSuccessMessage();
      response.data = college;
      return callback(null, response, response.code);
    } catch (err) {
      console.log(err);
      response = new responseMessage.GenericFailureMessage();
      return callback(null, response, response.code);
    }
  },
};
