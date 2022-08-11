'use strict';

const userService = require('./userService');
const responseHelper = require('../utils/responseHelper');
const Professor = require('../professor/professorModel');
const Student = require('../student/studentModel');
const Moderator = require('../moderator/moderatorModel');

const sendToken = (res, userRes) => {
  const token = userRes.token;
  const cookieOptions = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (ENVIRONMENT === 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);
};

module.exports = {
  signup: (req, res) => {
    userService.signup(req.body, async (err, userRes, statusCode) => {
      sendToken(res, userRes);
      if (!userRes.data) {
        console.log('ERROR ::: ', JSON.stringify(userRes));
        userRes.message = `UserId not valid for ${JSON.stringify(req.body)}`;
        return responseHelper(err, res, userRes, 400);
      }

      const userId = userRes.data.userId;
      const group = req.body.group;
      console.log(group);
      let newuser;
      console.log(userId);
      try {
        if (group == 'student') {
          newuser = await Student.create({
            user: userId,
          });
        } else if (group == 'professor') {
          newuser = await Professor.create({
            user: userId,
          });
        } else if (group == 'moderator') {
          newuser = await Moderator.create({
            user: userId,
          });
        }
      } catch (err) {
        console.log(err);
        // delete the created user
      }
      userRes.newuser = newuser;
      responseHelper(err, res, userRes, statusCode);
    });
  },

  login: (req, res) => {
    userService.login(req.body, (err, userRes, statusCode) => {
      sendToken(res, userRes);
      responseHelper(err, res, userRes, statusCode);
    });
  },

  updatePassword: (req, res) => {
    userService.updatePassword(req, (err, userRes, statusCode) => {
      sendToken(res, userRes);
      responseHelper(err, res, userRes, statusCode);
    });
  },

  updateProfile: (req, res) => {
    userService.updateProfile(req, (err, userRes, statusCode) => {
      responseHelper(err, res, userRes, statusCode);
    });
  },

  forgotPassword: (req, res) => {
    userService.forgotPassword(req.body, (err, userRes, statusCode) => {
      responseHelper(err, res, userRes, statusCode);
    });
  },

  resetPassword: (req, res) => {
    userService.resetPassword(req, (err, userRes, statusCode) => {
      responseHelper(err, res, userRes, statusCode);
    });
  },
};
