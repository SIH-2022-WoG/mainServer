"use strict";

const userService = require("./userService");
const responseHelper = require("../utils/responseHelper");

const sendToken = (res, userRes) => {
  const token = userRes.token;
  userRes.token = undefined;

  const cookieOptions = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (ENVIRONMENT === "production") {
    cookieOptions.secure = true;
  }

  res.cookie("jwt", token, cookieOptions);
};

module.exports = {
  signup: (req, res) => {
    userService.signup(req.body, (err, userRes, statusCode) => {
      sendToken(res, userRes);
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
    })
  },

  resetPassword: (req, res) => {
    userService.resetPassword(req, (err, userRes, statusCode) => {
      responseHelper(err, res, userRes, statusCode);
    })
  }
};
