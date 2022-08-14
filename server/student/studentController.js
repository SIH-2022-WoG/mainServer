'use strict';

const studentService = require('./studentService');
const responseHelper = require('../utils/responseHelper');
const thesisService = require('../thesis/thesisService');
const responseMessage = require('../utils/responseMessage');

module.exports = {
  updateProfile: (req, res) =>
    studentService.updateProfile(req, (err, resdata, statuscode) => {
      responseHelper(err, res, resdata, statuscode);
    }),

  viewProfile: (req, res) =>
    studentService.viewProfile(req, (err, resdata, statuscode) => {
      responseHelper(err, res, resdata, statuscode);
    }),

  /** Incomplete function */
  createThesis: (req, res) => {
    const studentId = req.user.childId;
    let studentdata;
    req.query = {
      id: studentId,
    };
    studentService.viewProfile(req, (err, resdata, statuscode) => {
      if (parseInt(statuscode) === 200) {
        studentdata = resdata.data;
      } else {
        return responseHelper(err, res, resdata, statuscode);
      }
    });

    /** Adding student credentials to the data */
    req.body.student = {
      name: studentdata.name,
      studentId: studentId,
      email: studentdata.email,
    };
    req.body.college = studentdata.currCollege;
    req.body.collegeId = college.collegeId;

    thesisService.createThesis(req.body, (err, resdata, statuscode) => {
      responseHelper(err, res, resdata, statuscode);
    });
  },
};
