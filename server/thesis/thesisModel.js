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
    /** thesis details */
    title: {
      type: String,
    },
    abstract: {
      type: String,
      trim: true,
    },
    document: {
      type: media,
    },
    textextract: {
      type: media,
    },
    branch: {
      type: String,
      enum: commonConfig.branch.values,
      default: commonConfig.branch.default,
    },
    interests: {
      type: [{ type: String, trim: true }],
    },
    fulltext: {
      type: media,
    },
    dateOfAcceptance: {
      type: Date,
    },
    plagiarismReport: {
      type: Map,
      of: [mongoose.Types.ObjectId],
    },
    status: {
      type: String,
      enum: thesisConfig.status.values,
      default: thesisConfig.status.default,
    },
    plagPercentage: {
      type: Number,
      default: 0,
    },

    /** References */
    student: {
      type: student,
    },
    college: {
      type: college,
    },
    collegeId: {
      type: mongoose.Types.ObjectId,
      ref: 'College',
      required: true,
    },
    guides: {
      type: [{ type: professor, required: true }],
      required: true,
    },
  },
  { timestamps: true }
);

thesisSchema.plugin(mongoosePaginate);
thesisSchema.index({ branch: 1, interests: 1, collegeId: 1 });
module.exports = mongoose.mainConnection.model(
  'Thesis',
  thesisSchema,
  'theses'
);
