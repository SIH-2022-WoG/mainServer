'use strict';

const Professor = require('./professorModel');
const responseMessage = require('../utils/responseMessage');

module.exports = {
  updateProfile: async (req, callback) => {
    let response;
    try {
      const userId = req.userId;
      const prof = await Professor.findOneAndUpdate(
        { user: userId },
        req.body,
        { new: true, runValidators: true }
      );
      if (!prof) {
        response = new responseMessage.ObjectDoesNotExistInDB();
      } else {
        response = new responseMessage.GenericSuccessMessage();
        response.data = prof;
      }
      return callback(null, response, response.code);
    } catch (err) {
      console.log(err);
      response = new responseMessage.GenericFailureMessage();
      return callback(null, response, response.code);
    }
  },
};
