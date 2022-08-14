'use strict';

const collegeService = require('../college/collegeService');
const studentService = require('../student/studentService');
const professorService = require('../professor/professorService');
const responseHelper = require('../utils/responseHelper');
const userService = require('../user/userService');

module.exports = {
  getPendingColleges: (req, res) => {
    req.searchQuery = { status: 'pending' };
    collegeService.getColleges(req, (err, resdata, statuscode) => {
      responseHelper(err, res, resdata, statuscode);
    });
  },

  getPendingStudents: (req, res) => {
    req.searchQuery = { status: 'pending' };
    studentService.getStudents(req, (err, resdata, statuscode) => {
      responseHelper(err, res, resdata, statuscode);
    });
  },

  getPendingProfessors: (req, res) => {
    req.searchQuery = { status: 'pending' };
    professorService.getProfessors(req, (err, resdata, statuscode) => {
      responseHelper(err, res, resdata, statuscode);
    });
  },

  setStatusCollege: (req, res) => {
    const user = req.user;
    req.body.moderatedBy = user._id;

    collegeService.updateProfile(req, (err, resdata, statuscode) => {
      responseHelper(err, res, resdata, statuscode);
    });
  },

  setStatusStudent: (req, res) => {
    const user = req.user;
    req.body.moderatedBy = user._id;

    studentService.updateProfile(req, (err, resdata, statuscode) => {
      if (parseInt(statuscode) === 200 && req.body.status === 'active') {
        req.body = {
          active: true,
        };
        userService.updateProfile(req, (err, userdata, statuscode) => {
          resdata.userdata = userdata;
          return responseHelper(err, res, resdata, statuscode);
        });
      }
      return responseHelper(err, res, resdata, statuscode);
    });
  },

  setStatusProfessor: (req, res) => {
    const user = req.user;
    req.body.moderatedBy = user._id;

    professorService.updateProfile(req, (err, resdata, statuscode) => {
      if (parseInt(statuscode) === 200 && req.body.status === 'active') {
        req.body = {
          active: true,
        };
        userService.updateProfile(req, (err, userdata, statuscode) => {
          resdata.userdata = userdata;
          return responseHelper(err, res, resdata, statuscode);
        });
      }
      return responseHelper(err, res, resdata, statuscode);
    });
  },
};
