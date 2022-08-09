'use strict';

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const college = require('../models/college').collegeDetails;
const commonConfig = require('../commonConfig.json');

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
    numThesis: {
      type: Number,
      default: 0,
    },
    currCollege: {
      type: college,
    },
    pastColleges: {
      type: college,
    },
    branch: {
      type: String,
      enum: commonConfig.branch.values,
      default: commonConfig.branch.default,
    },
    interests: [
      {
        type: String,
        trim: true,
      },
    ],
    grade: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

studentSchema.plugin(mongoosePaginate);
studentSchema.index({ interests: 1, branch: 1 });
module.exports = mongoose.mainConnection.model(
  'student',
  studentSchema,
  'students'
);
