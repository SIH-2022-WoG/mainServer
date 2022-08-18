'use strict';

const Moderator = require('../moderator/moderatorModel');
const responseMessage = require('../utils/responseMessage');

module.exports = {
  create: async (req, callback) => {
    let response;
    try {
      const moderator = await Moderator.create(req.body);
      if (moderator) {
        response = new responseMessage.GenericSuccessMessage();
        response.data = moderator;
      } else {
        response = new responseMessage.GenericFailureMessage();
      }

      return callback(null, response, response.code);
    } catch (err) {
      console.log('error in mod service\n', err);
      response = new responseMessage.GenericFailureMessage();
      return callback(null, response, response.code);
    }
  },

  uploadFile: (req, callback) => {
    const response = new responseMessage.GenericSuccessMessage();
    response.data = {
      filename: req.file.filename,
    };
    return callback(null, response, response.code);
  },
};
