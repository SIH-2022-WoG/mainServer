'use strict';

const fetch = require('node-fetch');
const thesisService = require('./thesisService');
const responseHelper = require('../utils/responseHelper');
const responseMessage = require('../utils/responseMessage');
const commonConfig = require('../commonConfig.json');

module.exports = {
  getAllThesis: (req, res) => {
    thesisService.getAllThesis(req, (err, resData, statusCode) => {
      responseHelper(err, res, resData, statusCode);
    });
  },

  viewOne: (req, res) => {
    thesisService.viewOne(req, (err, resData, statusCode) => {
      return responseHelper(err, res, resData, statusCode);
    });
  },

  evaluateThesis: (req, res) => {
    let response;
    thesisService.viewOne(req, async (err, resdata, statuscode) => {
      if (parseInt(statuscode) === 200) {
        const thesisData = resdata.data;
        if (!thesisData.fulltext) {
          response = new responseMessage.GenericFailureMessage();
          return responseHelper(null, res, response, response.code);
        }
        try {
          const lang = Number(req.query.lang) || 0;
          const endPoint = ELASTIC_API + `/plagiarism/calculate/?lang=${lang}`;
          const body = {
            fileUrl: req.body.fileUrl,
          };
          const result = await fetch(endPoint, {
            method: 'post',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
          });
          const data = await result.json();
          const thesisId = req.query.id;
          // console.log(data);
          if (Number(data.percentage) < commonConfig.allowedPlag) {
            req.body = {
              status: 'accepted',
            };
          } else {
            req.body = {
              status: 'rejected',
            };
          }
          req.body.plagiarismReport = data.report;
          req.body.plagPercentage = data.percentage;
          const thesis = await thesisService.updateThesis(req);
          response = new responseMessage.GenericSuccessMessage();
          response.data = thesis;
          return responseHelper(null, res, response, response.code);
        } catch (err) {
          console.log(err);
          response = new responseMessage.GenericFailureMessage();
          return responseHelper(null, res, response, response.code);
        }
      } else {
        return responseHelper(err, res, resdata, statuscode);
      }
    });
  },
};
