'use strict';

/**health check route */
const healthCheck = require('./server/utils/healthCheck');

// user routes
const { preloginRouter, postloginRouter } = require('./server/user/userRoute');
const {
  isUserJWTAutheticatedMW,
  isUserModeratorMW,
} = require('./server/middlewares/user');
const {
  professorRouter,
  professorPublicRouter,
} = require('./server/professor/professorRoute');
const { studentRouter } = require('./server/student/studentRoute');
const { moderatorRouter } = require('./server/moderator/moderatorRoute');
const {
  collegeProtectedRouter,
  collegePublicRouter,
} = require('./server/college/collegeRoute');

module.exports = function (app) {
  app.use('/healthcheck', healthCheck);

  app.use('/user/prl', [], preloginRouter);
  app.use('/prof/protected', [isUserJWTAutheticatedMW], professorRouter);
  app.use('/prof/public', [], professorPublicRouter);
  app.use('/student', [isUserJWTAutheticatedMW], studentRouter);
  app.use(
    '/moderator',
    [isUserJWTAutheticatedMW, isUserModeratorMW],
    moderatorRouter
  );
  app.use(
    '/college/protected',
    [isUserJWTAutheticatedMW],
    collegeProtectedRouter
  );
  app.use('/college/public', [], collegePublicRouter);
};
