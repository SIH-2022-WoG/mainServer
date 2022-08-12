'use strict';

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const professor = require('../models/professor').profDetails;
const student = require('../models/student').studentDetails;
const college = require('../models/college').collegeDetails;
const media = require('../models/media').mediaDetails;
const commonConfig = require('../commonConfig.json');
const thesisConfig = require('./thesisConfig.json');

const thesisSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    guides: [
      {
        type: professor,
        required: true,
      },
    ],
    student: {
      type: student,
      required: true,
    },
    abstract: {
      type: String,
      trim: true,
    },
    document: {
      type: media,
    },
    /**this contains a redunsant info */
    college: {
      type: college,
      required: true,
    },
    collegeId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    branch: {
      type: commonConfig.branch,
      required: true,
    },
    interests: [
      {
        type: String,
        trim: true,
      },
    ],
    fulltext: {
      type: media,
    },
    dateOfAcceptance: {
      type: Date,
    },
    plagiarismReport: {
      type: Map,
      of: [],
    },
    status: {
      type: String,
      enum: thesisConfig.status.values,
      default: thesisConfig.status.default,
    },
    plagPercentage: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

thesisSchema.plugin(mongoosePaginate);
module.exports = mongoose.mainConnection.model(
  'thesis',
  thesisSchema,
  'thesiss'
);
