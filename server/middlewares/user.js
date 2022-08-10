'use strict';
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const responseMessage = require('../utils/responseMessage');
const responseHelper = require('../utils/responseHelper');
const User = require('../user/userModel');

module.exports = {
  isUserJWTAutheticatedMW: async (req, res, next) => {
    // 1) Getting token and check of it's there

    let token = req.body.token || req.headers.xAcessToken;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      const result = responseMessage.tokenNotProvided;
      return res.status(result.code).json(result);
    }

    try {
      // 2) Verification token
      const decoded = await promisify(jwt.verify)(token, JWT_SECRET);

      // 3) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        const response = responseMessage.userPropertyNotFound;
        return res.status(response.code).json(response);
      }

      // 4) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        const response = responseMessage.accessDenied;
        return res.status(response.code).json(response);
      }

      // GRANT ACCESS TO PROTECTED ROUTE
      req.user = currentUser;
      console.log('INFO ::: auth sucessfull for', currentUser.email);

      next();
    } catch (err) {
      console.log(`ERROR::${err}`);
      const response = responseMessage.tokenAuthenticationFailed;
      res.status(400).json(response);
    }
  },

  isUserModeratorMW: (req, res, next) => {
    const user = req.user;
    if (user.group !== 'moderator') {
      console.log('INFO ::: ', user.email, 'is not a moderator');
      const response = responseMessage.accessDenied;
      return responseHelper(null, res, response, response.code);
    } else {
      next();
    }
  },
};
