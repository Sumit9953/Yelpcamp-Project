const { urlencoded } = require("express");
const express = require("express");
const mongoose = require("mongoose")
const ejsMate = require("ejs-mate");
const catchasync = require("./utils/catchAsync")
const methodoverride = require("method-override");
const Campground = require("./models/campground");
const catchAsync = require("./utils/catchAsync");

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

app.get("/",function(req,res){
    res.render("home");
});

app.get("/campgrounds",catchAsync(async function(req,res){
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}));

app.get("/campgrounds/new", function(req,res){
    res.render("campgrounds/new");
});

app.post("/campgrounds",catchAsync(async function(req,res,next){
   
    const campground=  new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
    
}));

app.get("/campgrounds/:id" ,catchAsync(async function(req,res){
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show",{campground});
}));

app.get("/campgrounds/:id/edit" ,catchAsync(async function(req,res){
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit",{campground});
}));

app.put("/campgrounds/:id",catchAsync(async function(req,res){
    const { id } = req.params;
     const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`);
}));

 app.delete("/campgrounds/:id",catchasync(async function(req,res){
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds"); 
 }));

app.use((err,req,res,next) => {
    res.send("Oh Boy, Something went Wrong!");

})

app.listen("3000",function(){
    console.log("server started on port 3000");
})