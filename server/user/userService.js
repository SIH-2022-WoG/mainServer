'use strict';

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('./userModel');
const responseMessage = require('../utils/responseMessage');
const sendEmail = require('../utils/sendEmail');
const { default: mongoose } = require('mongoose');

const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

module.exports = {
  signup: async (body, callback) => {
    // sanity check
    const { email, password, passwordConfirm, group } = body;

    if (!email || !password || !passwordConfirm || !group) {
      const response = responseMessage.incorrectPayload;
      return callback(null, response, response.code);
    }

    try {
      if (await User.findOne({ email })) {
        const response = responseMessage.operationProhibited;
        return callback(null, response, response.code);
      }

      const user = await User.create({
        email,
        password,
        passwordConfirm,
        group,
      });
      const token = signToken(user._id);
      const response = new responseMessage.GenericSuccessMessage();
      response.data = {
        user: user,
      };
      response.token = token;
      return callback(null, response, response.code);
    } catch (err) {
      console.log(`ERROR:::${err}`);
      const response = new responseMessage.GenericFailureMessage();
      return callback(null, response, response.code);
    }
  },

  login: async (body, callback) => {
    const { email, password } = body;

    try {
      // 1) Check if email and password exist
      if (!email || !password) {
        const response = responseMessage.incorrectPayload;
        return callback(null, response, response.code);
      }
      // 2) Check if user exists && password is correct
      const user = await User.findOne({ email }).select('+password');

      if (!user || !(await user.correctPassword(password, user.password))) {
        const response = new responseMessage.AuthenticationFailure();
        return callback(null, response, response.code);
      }

      // 3) If everything ok, send token to client
      const token = signToken(user._id);
      const response = new responseMessage.AuthenticationSuccess();
      response.token = token;
      response.group = user.group;
      response.childId = user.childId;
      return callback(null, response, response.code);
    } catch (err) {
      console.log(`ERROR:::${err}`);
      const response = new responseMessage.GenericFailureMessage();
      return callback(null, response, response.code);
    }
  },

  updateProfile: async (req, callback) => {
    const userId = req.userId || req.user._id;
    if (!userId) {
      const response = new responseMessage.GenericFailureMessage();
      console.log('user id missing');
      return callback(null, response, response.code);
    }

    try {
      console.log(`User update for ${userId}, ${req.user.email}`);
      console.log(`${JSON.stringify(req.body)}`);
      const newUser = await User.findByIdAndUpdate(userId, req.body, {
        new: true,
        runValidators: true,
      }).exec();

      if (!newUser) {
        const response = new responseMessage.invalidMongooseId();
        return callback(null, response, response.code);
      }

      const response = new responseMessage.GenericSuccessMessage();
      response.data = {
        newUser,
      };
      return callback(null, response, response.code);
    } catch (err) {
      console.log(`ERROR:::${err}`);
      const response = new responseMessage.GenericFailureMessage();
      return callback(null, response, response.code);
    }
  },

  updatePassword: async (req, callback) => {
    const {
      user: { _id: id },
      body: { currentPassword, password, confirmPassword },
    } = req;

    try {
      const user = await User.findById(id).select('+password');

      const correct = await user.correctPassword(
        currentPassword,
        user.password
      );

      if (!correct) {
        const response = new responseMessage.UpdateBadRequest();
        return callback(null, response, response.code);
      }

      user.password = password;
      user.passwordConfirm = confirmPassword;

      await user.save();
      const response = new responseMessage.GenericSuccessMessage();
      const token = signToken(id);
      response.token = token;

      return callback(null, response, response.code);
    } catch (err) {
      console.log(`ERROR:::${err}`);
      const response = new responseMessage.GenericFailureMessage();
      return callback(null, response, response.code);
    }
  },

  forgotPassword: async (body, callback) => {
    const { email } = body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        const response = responseMessage.userPropertyNotFound;
        return callback(null, response, response.code);
      }
      console.log(user);
      const token = user.createPasswordResetToken();

      await user.save({ validateBeforeSave: false });

      // Change for production
      const url = `http://localhost:3000/reset/${token}`;

      const message = `Forgot your password? Change it right away using this link: ${url}. Ignore if this is not your activity. Valid for 10 minute.`;

      try {
        await sendEmail({
          email,
          subject: 'Password Reset Mail',
          message,
        });

        const response = responseMessage.emailSent;
        return callback(null, response, response.code);
      } catch (err) {
        console.log(`ERROR:::${err}`);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save({ validateBeforeSave: false });

        const response = responseMessage.emailNotSent;
        return callback(null, response, response.code);
      }
    } catch (err) {
      console.log(`ERROR:::${err}`);
      const response = new responseMessage.GenericFailureMessage();
      return callback(null, response, response.code);
    }
  },

  resetPassword: async (req, callback) => {
    const { token } = req.params;
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      const response = responseMessage.userPropertyNotFound;
      return callback(null, response, response.code);
    }
    const { password, confirmPassword } = req.body;
    user.password = password;
    user.passwordConfirm = confirmPassword;

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    const response = new responseMessage.GenericSuccessMessage();
    return callback(null, response, response.code);
  },
};
