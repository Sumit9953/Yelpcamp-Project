const Campground = require("../models/campground");

module.exports.index = async function(req,res){
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}

module.exports.renderNewform = (req,res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async function(req,res,next){
    //    if(!req.body.campground) throw new ExpressError("Invalid Campground data  ",400)
    const campground=  new Campground(req.body.campground);
    campground.images =  req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`);   
}

module.exports.showCampground = async function(req,res){
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate("author");
    if(!campground){
        req.flash('error' , 'Cannot find that campgroud!');
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show",{ campground });
}

module.exports.renderEditForm = async function(req,res){
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error' , 'Cannot find that campgroud!');
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/edit",{campground});
}

module.exports.updateCampground = async function(req,res){
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success' , 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async function(req,res){
    
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted campground')
    res.redirect("/campgrounds"); 
 }