const express = require('express')
const router = express.Router();
const session = require("express-session");
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user');
const users = require('../controllers/users')
const passport = require('passport');
const LocalStrategy = require("passport-local")

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local' , { failureFlash:true , failureRedirect:'/login',keepSessionInfo: true}) ,users.login)

router.get('/logout',users.logout)

module.exports = router;