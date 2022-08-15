'use strict';

const studentService = require('./studentService');
const responseHelper = require('../utils/responseHelper');
const thesisService = require('../thesis/thesisService');
const responseMessage = require('../utils/responseMessage');
const professorService = require('../professor/professorService');
const { response } = require('express');

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
    console.log('INFO :::  Thesis creation by', req.user.email);
    let studentdata, response;
    req.query = {
      id: studentId,
    };
    studentService.viewProfile(req, (err, resdata, statuscode) => {
      if (parseInt(statuscode) === 200) {
        studentdata = resdata.data;
        // console.log(studentdata);

        if (!studentdata.currCollege) {
          response = responseMessage.accessDenied;
          response.info = 'cant add thesis untill you set your college';
          return responseHelper(null, res, response, response.code);
        }

        /** Adding student credentials to the data */
        req.body.student = {
          name: studentdata.name,
          studentId: studentId,
          email: studentdata.email,
        };
        req.body.college = studentdata.currCollege;
        req.body.collegeId = studentdata.currCollege.collegeId;

        // create thesis
        thesisService.createThesis(req.body, (err, resdata, statuscode) => {
          // if thesis creation is sucessfull
          if (parseInt(statuscode) === 200) {
            // update the students with the thesis data
            const thesisdata = resdata.data;
            const thesis = {
              title: thesisdata.title,
              guides: thesisdata.guides,
              thesisId: thesisdata._id,
            };
            req.body = {
              $push: { theses: thesis },
            };
            req.query.id = thesisdata.student.studentId;
            // updating
            studentService.updateProfile(req, (err, studentRes, statuscode) => {
              const profRes = [];
              // if student update is sucessfull
              if (parseInt(statuscode) === 200) {
                // update the professors
                const guides = thesisdata.guides;
                // for each professor in the guide
                for (let prof in guides) {
                  const profId = prof.profId;
                  req.query.id = profId;
                  req.body = {
                    $push: { theses: thesis },
                  };
                  // update profile
                  professor = professorService.updateProfile(
                    req,
                    (err, profres, statuscode) => {
                      // if any of the professor update fails
                      if (statuscode !== 200) {
                        return responseHelper(err, res, profres, statuscode);
                      } else {
                        profRes.push(profres);
                      }
                    }
                  );
                  // thesis + prof update + student update is sucessfull
                  resdata.studentRes = studentRes;
                  resdata.profRes = profRes;
                  return responseHelper(err, res, resdata, statuscode);
                }
              } else {
                // if student update fails
                return responseHelper(err, res, studentRes, statuscode);
              }
            });
          } else {
            return responseHelper(err, res, resdata, statuscode);
          }
        });
      } else {
        return responseHelper(err, res, resdata, statuscode);
      }
    });
  },
};
