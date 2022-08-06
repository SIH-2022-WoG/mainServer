'use strict'

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const validators = require('../utils/validators');
const bcrypt = require('bcrypt');
const crypto = require('crypto')
const userConfig = require('./userConfig.json')


const userSchema = mongoose.Schema({
    email: {
        type: String,
        validate: validators.emailValidator,
        required: [true, 'Email is required !'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required !'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Password Confirmation is required !'],
        validate: {
            validator: function (el) {
                return el == this.password
            },
            message: 'Passwords dont match !'
        }
    },
    group: {
        type: String,
        required: true,
        enum: userConfig.userGroup.values,
    },
    avatar: {
        type: String
    },

    // forgot password and other DB stuffs
    passwordChangedAt: {
        type: Date
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetExpires: {
        type: Date,
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})


userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 8);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function (next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};



// create the user model and export it 
userSchema.plugin(mongoosePaginate);
module.exports = mongoose.mainConnection.model('User', userSchema, 'users')
