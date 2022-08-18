'use strict';

const mongoose = require('mongoose');
const profDetails = require('./professor').profDetails;
const student = require('./student').studentDetails;

const thesisDetailsSchema = new mongoose.Schema({
  _id: false,
  title: {
    type: String,
    required: true,
  },
  guides: {
    type: [profDetails],
  },
  thesisId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  student: {
    type: student,
  },
});

module.exports = {
  thesisDetailsSchema,
};
