var express = require('express');
var router = express.Router();
const User = require("../models/UserModels");
const passport = require("passport");
const localStratagy = require("passport-local");
const Article = require('../models/ArticleModels');
passport.use(new localStratagy(User.authenticate()));
const imageupload = require("../helper/multer").single("image");
const proimageupload = require("../helper/profileMulter").single("avatar");
const fs = require("fs");

// router.get('/', async function(req, res, next) {
//     const articles = await Article.find();
//     const toparticles = await Article.find().sort({ views: -1 }).limit(5);
//     res.render('index', { title: 'News',
//     isLoggedIn: req.user ? true : false,
//     user: req.user,articles,toparticles
//     });
//   });