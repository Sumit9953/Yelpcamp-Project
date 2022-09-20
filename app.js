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
const reviews = require("./routes/reviews")

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




app.use("/campgrounds",campgrounds);
app.use("/campgrounds/:id/reviews",reviews);

 app.get("/",function(req,res){
    res.render("home");
});



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