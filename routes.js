'use strict';

/**health check route */
const healthCheck = require('./server/utils/healthCheck');

// user routes
const { preloginRouter, postloginRouter } = require('./server/user/userRoute');
const { isUserJWTAutheticatedMW } = require('./server/middlewares/user');
const { professorRouter } = require('./server/professor/professorRoute');
const { studentRouter } = require('./server/student/studentRoute');

module.exports = function (app) {
  app.use('/healthcheck', healthCheck);

  app.use('/user/prl', [], preloginRouter);
  app.use('/prof', [isUserJWTAutheticatedMW], professorRouter);
  app.use('/student', [isUserJWTAutheticatedMW], studentRouter);
};
