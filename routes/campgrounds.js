const express = require("express");
const router = express.Router();
const catchasync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const {campgroundSchema} = require("../schema")
const {isLoggedIn} = require('../middleware')

const validateCampground = (req,res,next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
       next();
    } 
}

router.get("/",catchAsync(async function(req,res){
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}));

router.get("/new", isLoggedIn,(req,res) => {
    res.render("campgrounds/new");
});

router.post("/",isLoggedIn,validateCampground,catchAsync(async function(req,res,next){
    //    if(!req.body.campground) throw new ExpressError("Invalid Campground data  ",400)
    
    const campground=  new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`);   
}));

router.get("/:id" , catchAsync(async function(req,res){
    const campground = await Campground.findById(req.params.id).populate("reviews");
    if(!campground){
        req.flash('error' , 'Cannot find that campgroud!');
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show",{ campground });
}));

router.get("/:id/edit" ,isLoggedIn,catchAsync(async function(req,res){
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit",{campground});
}));

router.put("/:id",isLoggedIn,validateCampground,catchAsync(async function(req,res){
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success' , 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}));

 router.delete("/:id",isLoggedIn,catchasync(async function(req,res){
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted campground')
    res.redirect("/campgrounds"); 
 })); 


 module.exports = router;