'use strict';

/**health check route */
const healthCheck = require('./server/utils/healthCheck');

// user routes
const { preloginRouter, postloginRouter } = require('./server/user/userRoute');
const {
  isUserJWTAutheticatedMW,
  isUserModeratorMW,
} = require('./server/middlewares/user');
const { professorRouter } = require('./server/professor/professorRoute');
const { studentRouter } = require('./server/student/studentRoute');
const { moderatorRouter } = require('./server/moderator/moderatorRoute');

module.exports = function (app) {
  app.use('/healthcheck', healthCheck);

  app.use('/user/prl', [], preloginRouter);
  app.use('/prof', [isUserJWTAutheticatedMW], professorRouter);
  app.use('/student', [isUserJWTAutheticatedMW], studentRouter);
  app.use(
    '/moderator',
    [isUserJWTAutheticatedMW, isUserModeratorMW],
    moderatorRouter
  );
};
