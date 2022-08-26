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
        // console.log(thesisData);
        if (!thesisData.fulltext) {
          response = new responseMessage.GenericFailureMessage();
          return responseHelper(null, res, response, response.code);
        }
        try {
          const lang = Number(req.query.lang) || 0;
          const endPoint = ELASTIC_API + `/plagiarism/calculate/?lang=${lang}`;
          const body = {
            fileUrl: thesisData.fulltext.cloudUrl,
          };
          // console.log(body);
          const result = await fetch(endPoint, {
            method: 'post',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
          });
          const data = await result.json();
          // const thesisId = req.query.id;
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

          let createIndex;
          if (req.body.status === 'accepted') {
            const createUrl = ELASTIC_API + '/plagiarism/create/';
            const body = {
              fileUrl: thesisData.fulltext.cloudUrl,
              thesisId: thesisData._id,
              title: thesisData.title,
            };
            console.log(createUrl);
            createIndex = await fetch(createUrl, {
              method: 'post',
              body: JSON.stringify(body),
              headers: { 'Content-Type': 'application/json' },
            });
          }
          response = new responseMessage.GenericSuccessMessage();
          response.data = thesis;
          response.newIndex = createIndex;
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
