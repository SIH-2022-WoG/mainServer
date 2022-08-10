'use strict';

const Professor = require('./professorModel');
const responseMessage = require('../utils/responseMessage');

module.exports = {
  updateProfile: async (req, callback) => {
    let response;
    try {
      const userId = req.user._id;
      if (!userId) {
        response = new responseMessage.GenericFailureMessage();
        return callback(null, response, response.code);
      }
      console.log('INFO ::: ', userId);
      const prof = await Professor.findOneAndUpdate(
        { user: userId },
        req.body,
        {
          runValidators: true,
          new: true,
        }
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

  viewProfile: async (req, callback) => {
    const profId = req.query.id;
    let response;
    if (!profId) {
      response = new responseMessage.GenericFailureMessage();
      response.message = 'Professor ID missing';
      console.log('INFO ::: Professor ID missing');
      return callback(null, response, response.code);
    }

    try {
      const prof = await Professor.findById(profId);
      response = new responseMessage.GenericSuccessMessage();
      response.data = prof;
      return callback(null, response, response.code);
    } catch (err) {
      console.log(err);
      response = new responseMessage.GenericFailureMessage();
      return callback(null, response, response.code);
    }
  },
};
