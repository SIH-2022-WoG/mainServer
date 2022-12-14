'use strict';

const College = require('./collegeModel');
const responseMessage = require('../utils/responseMessage');
const commonConfig = require('../commonConfig.json');
const fs = require('fs');
const reader = require('xlsx');
/**Basic filter for getall */
const basicFilter = {
  name: 1,
  description: 1,
  _id: 1,
};

/** Helper Function to Paginate The API */
async function getPaginatedResults(query, options, callback) {
  let response;
  try {
    const results = await College.paginate(query, options);
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
  createCollege: async (body, callback) => {
    let response;
    try {
      const college = await College.create(body);
      response = new responseMessage.GenericSuccessMessage();
      response.data = college;
      return callback(null, response, response.code);
    } catch (err) {
      console.log(err);
      response = new responseMessage.GenericFailureMessage();
      return callback(null, response, response.code);
    }
  },

  getColleges: (req, callback) => {
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

  updateProfile: async (req, callback) => {
    let response;
    const collegeId = req.query.id;

    if (!collegeId) {
      response = responseMessage.incorrectPayload;
      return callback(null, response, response.code);
    }

    try {
      const newCollege = await College.findByIdAndUpdate(collegeId, req.body, {
        new: true,
        runValidators: true,
      });
      response = new responseMessage.GenericSuccessMessage();
      response.data = newCollege;
      return callback(null, response, response.code);
    } catch (err) {
      console.log('ERROR ::: ', err);
      response = new responseMessage.GenericFailureMessage();
      return callback(null, response, response.code);
    }
  },

  viewCollege: async (req, callback) => {
    let response;
    const collegeId = req.query.id;

    if (!collegeId) {
      response = responseMessage.incorrectPayload;
      return callback(null, response, response.code);
    }
    try {
      const college = await College.findById(collegeId);
      if (college) {
        response = new responseMessage.GenericSuccessMessage();
        response.data = college;
      } else {
        response = new responseMessage.GenericFailureMessage();
      }
      return callback(null, response, response.code);
    } catch (err) {
      console.log('ERROR ::: ', err);
      response = new responseMessage.GenericFailureMessage();
      return callback(null, response, response.code);
    }
  },

  textSearch: async (req, callback) => {
    const searchText = req.query.text;
    if (!searchText || searchText.length > parseInt(commonConfig.searchLen)) {
      const response = new responseMessage.GenericFailureMessage();
      response.message = 'please provide a search query';
      return callback(null, response, parseInt(response.code));
    }

    const searchQuery = {
      $text: {
        $search: searchText,
      },
      status: commonConfig.status.active,
    };
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort || 'name';
    const options = {
      page: page,
      limit: limit,
      select: basicFilter,
      sort: sort,
    };
    getPaginatedResults(searchQuery, options, callback);
  },

  /** Create Bulk Colleges */
  createBulkColleges: async (req, callback) => {
    let response;
    try {
      const filename = req.file.filename;
      const file = reader.readFile(__dirname + '/../../uploadFile/' + filename);
      const data = [];
      const sheets = file.SheetNames;
      const moderatorId = req.user.childId;
      for (let i = 0; i < sheets.length; i++) {
        const temp = reader.utils.sheet_to_json(
          file.Sheets[file.SheetNames[i]]
        );
        temp.forEach((res) => {
          res['createdBy'] = moderatorId;
          res['moderatedBy'] = moderatorId;
          data.push(res);
        });
      }

      const newColleges = await College.insertMany(data);
      response = new responseMessage.GenericSuccessMessage();
      response.data = { newColleges };
      return callback(null, response, response.code);
    } catch (err) {
      console.log('ERROR in bulk import ::: ' + err);
      response = new responseMessage.GenericFailureMessage();
      return callback(null, response, response.code);
    }
  },
};
