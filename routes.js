'use strict';

/**health check route */
const healthCheck = require('./server/utils/healthCheck');

// User Routes
const { preloginRouter, postloginRouter } = require('./server/user/userRoute');

// Professor Routes
const {
  professorRouter,
  professorPublicRouter,
} = require('./server/professor/professorRoute');

// student Routes
const {
  studentRouter,
  studentPublicRouter,
} = require('./server/student/studentRoute');

// moderator Routes
const {
  moderatorRouter,
  moderatorFileUploadRouter,
} = require('./server/moderator/moderatorRoute');

// college Routes
const {
  collegeProtectedRouter,
  collegePublicRouter,
} = require('./server/college/collegeRoute');

// thesis Routes
const { thesisRouter } = require('./server/thesis/thesisRoute');

/****************************   Middlewares ***************************/
const { multerSingleUpload } = require('./server/middlewares/fileUpload');
const {
  isUserJWTAutheticatedMW,
  isUserModeratorMW,
} = require('./server/middlewares/user');

module.exports = function (app) {
  app.use('/healthcheck', healthCheck);

  app.use('/user/prl', [], preloginRouter);
  app.use('/prof/protected', [isUserJWTAutheticatedMW], professorRouter);
  app.use('/prof/public', [], professorPublicRouter);
  app.use('/student/protected', [isUserJWTAutheticatedMW], studentRouter);
  app.use('/student/public', [], studentPublicRouter);
  app.use(
    '/moderator/auth',
    [isUserJWTAutheticatedMW, isUserModeratorMW],
    moderatorRouter
  );
  app.use(
    '/moderator/fileUpload',
    [isUserJWTAutheticatedMW, isUserModeratorMW, multerSingleUpload],
    moderatorFileUploadRouter
  );
  app.use(
    '/college/protected',
    [isUserJWTAutheticatedMW],
    collegeProtectedRouter
  );
  app.use('/college/public', [], collegePublicRouter);
  app.use('/thesis', [], thesisRouter);
};
