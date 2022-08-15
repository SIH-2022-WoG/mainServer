'use strict';

const userService = require('./userService');
const responseHelper = require('../utils/responseHelper');
const responseMessage = require('../utils/responseMessage');
const moderatorService = require('../moderator/moderatorService');
const professorService = require('../professor/professorService');
const studentService = require('../student/studentService');
const userTransaction = require('./userTransaction');

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
  // signup: async (req, res) => {
  //   userService.signup(req.body, (err, userRes, statusCode) => {
  //     if (parseInt(statusCode) === 200) {
  //       const user = userRes.data.user;
  //       req.body = {
  //         user: user._id,
  //       };
  //       if (user.group === 'moderator') {
  //         moderatorService.create(req, (err, childRes, statusCode) => {
  //           if (parseInt(statusCode) === 200) {
  //             user.childId = childRes.data._id;
  //             req.user = user;
  //             req.body = { childId: user.childId };
  //             userService.updateProfile(req, (e, finalRes, code) => {
  //               return responseHelper(e, res, finalRes, code);
  //             });
  //           } else {
  //             return responseHelper(err, res, childRes, statusCode);
  //           }
  //         });
  //       } else if (user.group === 'student') {
  //         // student
  //       } else if (user.group === 'professor') {
  //         // professor
  //       }
  //     } else {
  //       console.log('user creation fails');
  //       return responseHelper(err, res, userRes, statusCode);
  //     }
  //   });
  // },

  signup: (req, res) => {
    userTransaction.signUpTransaction(req, (err, userRes, statusCode) => {
      return responseHelper(err, res, userRes, statusCode);
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
