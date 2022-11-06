'use strict';

const Student = require('./studentModel');
const responseMessage = require('../utils/responseMessage');

/**Basic filter for getall */
const basicFilter = {
  name: 1,
  currCollege: 1,
  _id: 1,
};

/** Helper Function to Paginate The API */
async function getPaginatedResults(query, options, callback) {
  let response;
  try {
    const results = await Student.paginate(query, options);
    if (!results.total) {
      console.log(
        'INFO::: No results found based on query: ' + JSON.stringify(query)
      );
      response = new responseMessage.ObjectDoesNotExistInDB();
      return callback(null, response, response.code);
    } else {
      console.log(
        'INFO::: results returned for query: ' + JSON.stringify(query)
      );
      response = new responseMessage.GenericSuccessMessage();
      response.total = results.total;
      response.limit = results.limit;
      response.page = results.page;
      response.pages = results.pages;
      response.data = results.docs;
      return callback(null, response, response.code);
    }
  } catch (err) {
    console.log(
      'ERROR ::: In finding results for query: ' +
        JSON.stringify(query) +
        '. Error: ' +
        JSON.stringify(err)
    );
    console.log(`ERROR ::: ${err.message}, stack: ${err.stack}`);
    response = new responseMessage.GenericFailureMessage();
    return callback(null, response, response.code);
  }
}

module.exports = {
  updateProfile: async (req, callback) => {
    let response;
    try {
      let studentId;
      if (req.query && req.query.id) {
        studentId = req.query.id;
      } else if (req.user) {
        studentId = req.user.childId;
      }

      if (!studentId) {
        response = new responseMessage.GenericFailureMessage();
        return callback(null, response, response.code);
      }

      const student = await Student.findByIdAndUpdate(studentId, req.body, {
        runValidators: true,
        new: true,
      });
      if (!student) {
        response = new responseMessage.ObjectDoesNotExistInDB();
      } else {
        response = new responseMessage.GenericSuccessMessage();
        response.data = student;
      }
      return callback(null, response, response.code);
    } catch (err) {
      console.log(err);
      response = new responseMessage.GenericFailureMessage();
      return callback(null, response, response.code);
    }
  },

  viewProfile: async (req, callback) => {
    let studentId;
    if (req.query && req.query.id) {
      studentId = req.query.id;
    } else if (req.user) {
      studentId = req.user.childId;
    }
    let response;
    if (!studentId) {
      response = new responseMessage.GenericFailureMessage();
      response.message = 'Student ID missing';
      console.log('INFO ::: Student ID missing');
      return callback(null, response, response.code);
    }
    console.log('INFO  ::::   viewing student', studentId);
    try {
      const student = await Student.findById(studentId);
      response = new responseMessage.GenericSuccessMessage();
      response.data = student;
      return callback(null, response, response.code);
    } catch (err) {
      console.log(err);
      response = new responseMessage.GenericFailureMessage();
      return callback(null, response, response.code);
    }
  },

  getStudents: (req, callback) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort || '-createdAt';
    const query = req.searchQuery || {};
    const filter = req.searchFilter || basicFilter;
    const options = {
      page: page,
      limit: limit,
      select: filter,
      sort: sort,
    };
    getPaginatedResults(query, options, callback);
  },

  uploadNonOCR: async (req, callback) => {
    const studentId = req.user.childId;
    console.log(studentId);
    const response = new responseMessage.GenericSuccessMessage();
    return callback(null, response, response.code);
  },
};
