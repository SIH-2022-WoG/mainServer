'use strict';

const responseMessage = require('../utils/responseMessage');
const Thesis = require('./thesisModel');

module.exports = {
  createThesis: async (body, callback) => {
    let response;
    try {
      const thesis = await Thesis.create(body);
      response = new responseMessage.GenericSuccessMessage();
      response.data = thesis;
      return callback(null, response, response.code);
    } catch (err) {
      console.log('ERROR ::: in thesis Service\n', err);
      response = new responseMessage.GenericFailureMessage();
      return callback(null, response, response.code);
    }
  },
};
