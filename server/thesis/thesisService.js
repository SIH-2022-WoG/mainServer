'use strict';

const responseMessage = require('../utils/responseMessage');
const Thesis = require('./thesisModel');

/**Basic filter for getall */
const basicFilter = {
  title: 1,
  abstract: 1,
  branch: 1,
  college: 1,
  student: 1,
  guides: 1,
  _id: 1,
};

/** Helper Function to Paginate The API */
async function getPaginatedResults(query, options, callback) {
  let response;
  try {
    const results = await Thesis.paginate(query, options);
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
  createThesis: async (body, callback) => {
    let response;
    try {
      const thesis = await Thesis.create(body);
      response = new responseMessage.GenericSuccessMessage();
      response.data = thesis;
      return callback(null, response, response.code);
    } catch (err) {
      console.log('ERROR ::: in thesis Service\n', err);
      response = new responseMessage.GenericFailureMessage();
      return callback(null, response, response.code);
    }
  },

  getAllThesis: (req, callback) => {
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
};
