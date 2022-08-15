'use strict';

const User = require('./userModel');
const Student = require('../student/studentModel');
const Moderator = require('../moderator/moderatorModel');
const Professor = require('../professor/professorModel');
const mongoose = require('mongoose');
const responseMessage = require('../utils/responseMessage');

module.exports = {
  signUpTransaction: async (req, callback) => {
    let session;
    let response;
    try {
      session = await mongoose.mainConnection.startSession();
      const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' },
      };
      let resdata = {};
      const transactionResults = await session.withTransaction(async () => {
        // user transaction
        let user = await User.create([req.body], { session });
        let child;
        //  child transaction
        if (user && user[0]) {
          user = user[0];
          if (user.group === 'student') {
            child = await Student.create([{ user: user._id }], { session });
          } else if (user.group === 'professor') {
            child = await Professor.create([{ user: user._id }], { session });
          } else if (user.group === 'moderator') {
            child = await Moderator.create([{ user: user._id }], { session });
          }
          // update user transaction
          if (child && child[0]) {
            child = child[0];
            const childId = child._id;
            // console.log(user._id);
            const updatedUser = await User.findByIdAndUpdate(
              user._id,
              { childId },
              { new: true, runValidators: true, session }
            );
            // console.log(updatedUser);
            if (updatedUser) {
              resdata.user = updatedUser;
              return updatedUser;
            } else {
              await session.abortTransaction();
              console.log('failed to update user with child id');
              return user;
            }
          } else {
            await session.abortTransaction();
            console.log('failed to create a child user');
            return user;
          }
        } else {
          await session.abortTransaction();
          console.log('failed to create a user');
          return user;
        }
      }, transactionOptions);

      if (transactionResults) {
        response = new responseMessage.GenericSuccessMessage();
        response.data = resdata;
      } else {
        response = new responseMessage.GenericFailureMessage();
      }
      return callback(null, response, response.code);
    } catch (err) {
      console.log(
        'The transaction was aborted due to an unexpected error: ' + err
      );
      response = new responseMessage.GenericFailureMessage();
      return callback(null, response, response.code);
    } finally {
      console.log('session is closed');
      await session.endSession();
    }
  },
};
