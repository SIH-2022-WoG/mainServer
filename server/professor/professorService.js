'use strict';

const Professor = require('./professorModel');
const responseMessage = require('../utils/responseMessage');
const commonConfig = require('../commonConfig.json');

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
    const results = await Professor.paginate(query, options);
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
    let response, profId;
    if (req.query && req.query.id) {
      profId = req.query.id;
    } else if (req.user) {
      profId = req.user.childId;
    }
    if (!profId) {
      response = new responseMessage.GenericFailureMessage();
      return callback(null, response, response.code);
    }

    try {
      console.log('INFO :::: profile update for ', JSON.stringify(profId));
      console.log('INFO ::: Update INFO', JSON.stringify(req.body));
      const prof = await Professor.findByIdAndUpdate(profId, req.body, {
        runValidators: true,
        new: true,
      });
      if (!prof) {
        response = new responseMessage.ObjectDoesNotExistInDB();
      } else {
        response = new responseMessage.GenericSuccessMessage();
        response.data = prof;
      }
      return callback(null, response, response.code);
    } catch (err) {
      console.log(err);
      response = new responseMessage.GenericFailureMessage();
      return callback(null, response, response.code);
    }
  },

  viewProfile: async (req, callback) => {
    let response, profId;
    if (req.query && req.query.id) {
      profId = req.query.id;
    } else if (req.user) {
      profId = req.user.childId;
    }
    if (!profId) {
      response = new responseMessage.GenericFailureMessage();
      response.message = 'Professor ID missing';
      console.log('INFO ::: Professor ID missing');
      return callback(null, response, response.code);
    }

    try {
      const prof = await Professor.findById(profId);
      response = new responseMessage.GenericSuccessMessage();
      response.data = prof;
      return callback(null, response, response.code);
    } catch (err) {
      console.log(err);
      response = new responseMessage.GenericFailureMessage();
      return callback(null, response, response.code);
    }
  },

  getProfessors: (req, callback) => {
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

  textSearch: async (req, callback) => {
    const searchText = req.query.text;
    if (!searchText || searchText.length > parseInt(commonConfig.searchLen)) {
      const response = responseMessage.GenericFailureMessage();
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
};
