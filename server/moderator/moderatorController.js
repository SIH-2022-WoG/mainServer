'use strict';

const collegeService = require('../college/collegeService');
const studentService = require('../student/studentService');
const professorService = require('../professor/professorService');
const responseHelper = require('../utils/responseHelper');
const userService = require('../user/userService');
const moderatorService = require('../moderator/moderatorService');

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
        req.userId = resdata.data.user;
        req.body = {
          isActive: true,
        };
        userService.updateProfile(req, (err, userdata, statuscode) => {
          resdata.userdata = userdata;
          return responseHelper(err, res, resdata, statuscode);
        });
      } else {
        return responseHelper(err, res, resdata, statuscode);
      }
    });
  },

  setStatusProfessor: (req, res) => {
    const user = req.user;
    req.body.moderatedBy = user._id;

    professorService.updateProfile(req, (err, resdata, statuscode) => {
      if (parseInt(statuscode) === 200 && req.body.status === 'active') {
        req.userId = resdata.data.user;
        req.body = {
          isActive: true,
        };
        userService.updateProfile(req, (err, userdata, statuscode) => {
          resdata.userdata = userdata;
          return responseHelper(err, res, resdata, statuscode);
        });
      } else {
        return responseHelper(err, res, resdata, statuscode);
      }
    });
  },

  uploadFile: (req, res) => {
    moderatorService.uploadFile(req, (err, data, statusCode) => {
      if (statusCode === 200) {
        collegeService.createBulkColleges(req, (err, collegeData, code) => {
          return responseHelper(err, res, collegeData, code);
        });
      } else return responseHelper(err, res, data, statusCode);
    });
  },
};
