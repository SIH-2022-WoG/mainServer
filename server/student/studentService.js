'use strict';

const Student = require('./studentModel');
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
      const student = await Student.findOneAndUpdate(
        { user: userId },
        req.body,
        {
          runValidators: true,
          new: true,
        }
      );
      if (!student) {
        response = new responseMessage.ObjectDoesNotExistInDB();
      } else {
        response = new responseMessage.GenericSuccessMessage();
        response.data = student;
      }
      return callback(null, response, response.code);
    } catch (err) {
      console.log(err);
      response = new responseMessage.GenericFailureMessage();
      return callback(null, response, response.code);
    }
  },
};
