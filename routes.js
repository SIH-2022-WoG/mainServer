'use strict';

/**health check route */
const healthCheck = require('./server/utils/healthCheck');

// user routes
const { preloginRouter, postloginRouter} = require('./server/user/userRoute');

module.exports = function (app) {
  app.use('/healthcheck', healthCheck);

  app.use('/user/prl',[] , preloginRouter);
};
