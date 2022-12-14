'use strict';

const fetch = require('node-fetch');

const studentService = require('./studentService');
const responseHelper = require('../utils/responseHelper');
const thesisService = require('../thesis/thesisService');
const responseMessage = require('../utils/responseMessage');
const professorService = require('../professor/professorService');

module.exports = {
  updateProfile: (req, res) =>
    studentService.updateProfile(req, (err, resdata, statuscode) => {
      responseHelper(err, res, resdata, statuscode);
    }),

  viewProfile: (req, res) =>
    studentService.viewProfile(req, (err, resdata, statuscode) => {
      responseHelper(err, res, resdata, statuscode);
    }),

  uploadNonOCR: (req, res) => {
    return studentService.uploadNonOCR(req, (err, resdata, statuscode) => {
      return responseHelper(err, res, resdata, statuscode);
    });
  },

  createThesisExternal: async (req, res) => {
    req.query = {
      id: req.body.sid,
    };
    studentService.viewProfile(req, (err, studentData, statuscode) => {
      console.log(studentData);
      if (Number(statuscode) === 200) {
        const thesisBody = {
          college: studentData.data.currCollege,
          student: {
            name: studentData.data.name,
            studentId: studentData.data._id,
          },
          collegeId: studentData.data.currCollege.collegeId,
          fulltext: {
            cloudUrl: req.body.tUrl,
          },
          thesisMedia: {
            cloudUrl: req.body.mUrl,
          },
        };
        thesisService.createThesis(
          thesisBody,
          (err, thesisData, statuscode) => {
            if (Number(statuscode) === 200) {
              const thesisdata = thesisData.data;
              const thesis = {
                title: 'to be filled',
                thesisId: thesisdata._id,
                student: {
                  name: studentData.data.name,
                  studentId: studentData.data._id,
                },
              };
              req.body = {
                $push: { theses: thesis },
              };
              studentService.updateProfile(
                req,
                (err, studentData, statuscode) => {
                  return responseHelper(err, res, studentData, statuscode);
                }
              );
            } else return responseHelper(err, res, thesisData, statuscode);
          }
        );
      } else {
        return responseHelper(null, res, studentData, statuscode);
      }
    });
  },

  /** Incomplete function */
  createThesis: (req, res) => {
    const studentId = req.user.childId;
    console.log('INFO :::  Thesis creation by', req.user.email);
    let studentdata, response;
    req.query = {
      id: studentId,
    };

    // sanity check to check payload
    const { guides, branch, title } = req.body;
    if (!guides || !branch || !title) {
      response = responseMessage.incorrectPayload;
      return responseHelper(null, res, response, response.code);
    }

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
        const student = {
          name: studentdata.name,
          studentId: studentId,
          email: studentdata.email,
        };
        req.body.college = studentdata.currCollege;
        req.body.collegeId = studentdata.currCollege.collegeId;
        req.body.student = student;

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
              student: student,
            };
            req.body = {
              $push: { theses: thesis },
            };
            req.query.id = thesisdata.student.studentId;
            // updating
            studentService.updateProfile(req, (err, studentRes, statuscode) => {
              // if student update is sucessfull
              if (parseInt(statuscode) === 200) {
                // update the professors
                const guides = thesisdata.guides;
                console.log(guides);
                // for each professor in the guide
                const profRes = [];
                for (let x in guides) {
                  const prof = guides[x];
                  console.log('update for prof', prof);
                  const profId = prof.profId;
                  req.query.id = profId;
                  req.body = {
                    $push: { theses: thesis },
                  };
                  // update profile of professor
                  professorService.updateProfile(
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
                }
                // thesis + prof update + student update is sucessfull
                // resdata.studentRes = studentRes;
                // resdata.profRes = profRes;
                return responseHelper(err, res, resdata, statuscode);
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

  imageThesis: async (req, res) => {
    try {
      const studentId = req.user.childId;
      const iUrl = req.body.url;

      const url_to_fetch =
        TESSERACT_URL + '/tesseract' + '/extract' + '?url=' + iUrl;

      const tResponse = await fetch(url_to_fetch);
      const data = await tResponse.json();
      console.log(data);
    } catch (err) {
      console.log(err);
      return responseHelper(null, res, responseMessage.ErrorInQueryingDB, 500);
    }
  },
};
