'use strict';

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const college = require('../models/college').collegeDetails;
const commonConfig = require('../commonConfig.json');
const media = require('../models/media').mediaDetails;
const thesis = require('../models/thesis').thesisDetailsSchema;

const studentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      default: 'student',
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      unique: true,
    },
    currCollege: {
      type: college,
    },
    collegeId: {
      type: mongoose.Types.ObjectId,
      ref: 'College',
    },
    pastColleges: {
      type: college,
    },
    branch: {
      type: String,
      enum: commonConfig.branch.values,
      default: commonConfig.branch.default,
    },
    interests: {
      type: [{ type: String, trim: true }],
    },
    grade: {
      type: String,
    },
    thesis: {
      type: [{ type: thesis }],
    },
    status: {
      type: String,
      enum: commonConfig.status.values,
      default: commonConfig.status.default,
    },
    moderatedBy: {
      type: mongoose.Types.ObjectId,
    },
    iDproof: {
      type: [media],
    },
  },
  {
    timestamps: true,
  }
);

studentSchema.plugin(mongoosePaginate);
studentSchema.index({ interests: 1, branch: 1, collegeId: 1 });
module.exports = mongoose.mainConnection.model(
  'student',
  studentSchema,
  'students'
);
