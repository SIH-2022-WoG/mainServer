"use strict";

const express = require("express");
const userController = require("./userController");

const preloginRouter = express.Router();
const postloginRouter = express.Router();

// prelogin
preloginRouter.post("/signup", (req, res, next) => {
  userController.signup(req, res);
});

preloginRouter.post("/login", (req, res, next) => {
  userController.login(req, res);
});

preloginRouter.post("/forgotPassword", (req, res, next) => {
  userController.forgotPassword(req, res);
});

preloginRouter.patch("/resetPassword/:token", (req, res, next) => {
  userController.resetPassword(req, res);
});

//postlogin
postloginRouter.patch("/updateMyPassword", (req, res, next) => {
  userController.updatePassword(req, res);
});

//postlogin
postloginRouter.put("/updateProfile", (req, res, next) => {
  userController.updateProfile(req, res);
});

module.exports = {
  preloginRouter,
  postloginRouter,
};
