const express = require("express");
const router = express.Router();
const campgrounds = require('../controllers/campgrounds')
const catchasync = require("../utils/catchAsync");
const catchAsync = require("../utils/catchAsync");
const {storage} = require("../cloudinary")
const multer = require('multer')
const upload = multer({storage});
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware')
const path = require("path");
const Campground = require("../models/campground");

router.route('/')
      .get(catchAsync(campgrounds.index))
      .post(isLoggedIn,upload.array('image'),validateCampground ,catchAsync(campgrounds.createCampground));
     

router.get("/new", isLoggedIn, campgrounds.renderNewform);

router.route('/:id')
      .get(catchAsync(campgrounds.showCampground))
      .put(isLoggedIn,isAuthor,upload.array('image'),validateCampground,catchAsync(campgrounds.updateCampground))
      .delete(isLoggedIn, isAuthor ,catchasync(campgrounds.deleteCampground)); 


router.get("/:id/edit" ,isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm ));



 module.exports = router;