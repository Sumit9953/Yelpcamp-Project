const { urlencoded } = require("express");
const express = require("express");
const mongoose = require("mongoose")
const ejsMate = require("ejs-mate");
const Joi = require("joi");
const {campgroundSchema , reviewSchema} = require("./schema")
const catchasync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const methodoverride = require("method-override");
const Campground = require("./models/campground");
const catchAsync = require("./utils/catchAsync");
const Review = require("./models/review");
const campgrounds = require("./routes/campgrounds")


const app = express();
app.engine('ejs',ejsMate);
app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}));
app.use(methodoverride('_method'));


mongoose.connect("mongodb://localhost:27017/yelp-camp2");

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open" , () => {
    console.log("Database Connected");
});

const validateCampground = (req,res,next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
       next();
    } 
}

 const validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
       next();
    }
 }

app.use("/campgrounds",campgrounds)

 app.get("/",function(req,res){
    res.render("home");
});

app.post("/campgrounds/:id/reviews", validateReview , catchasync(async(req,res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete("/campgrounds/:id/reviews/:reviewId", catchAsync(async (req,res) => {
    const {id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id , {$pull:{reviews:reviewId}}); 
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

app.all("*",(req,res,next) => {
 next(new ExpressError('Page Not Found',404));
});

app.use((err,req,res,next) => {
    const {statusCode = 500 } = err;
    if(!err.message) err.message = "Oh No,Something went wronge";
    res.status(statusCode).render('error',{err});
})

app.listen("3000",function(){
    console.log("server started on port 3000");
})