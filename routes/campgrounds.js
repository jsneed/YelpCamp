var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//Campground Routes

//Index - Show All Campgrounds
router.get("/", function(req, res) {
    //Print user info from passport
    //console.log(req.user);

    //Get All Cats
    Campground.find({}, function(err, camps){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("campgrounds/index", {campgrounds : camps});
        }
    })
});

//Create a new campground
router.post("/", middleware.isLoggedIn, function(req, res) {
    //Get data from form
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;

    var author = {
        id: req.user._id,
        username: req.user.username
    };
    //Create new camp object
    var newCamp = {name : name, image : image, description : description, author : author};

    //Add camp to Mongo
    Campground.create(newCamp, function(err, camp){
        if(err) {
            console.log(err);
        }
        else {
            //Redirect to Campgrounds Page
            req.flash("success", "Sucessfully created campground.");
            res.redirect("/campgrounds");
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//Show - Display one Campground
router.get("/:id", function(req, res) {
    //Find Campground in MongoDB
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp) {
        if(err) {
            console.log(err);
        }
        else {
            //Redirect to Campgrounds Page
            res.render("campgrounds/show", {campground : foundCamp});
        }
    });
});

//Edit Campground
router.get("/:id/edit", middleware.checkCampOwnership, function(req, res) {
    //Find Campground in MongoDB (again)
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp) {
        if(err) {
            console.log(err);
            //Redirect to Campgrounds Page
            req.flash("error", "Campground not found.");
            res.redirect("back");
        }
        else {
            //Redirect to Campgrounds Page
            res.render("campgrounds/edit", {campground : foundCamp});
        }
    });
});

//Update Campground
router.put("/:id", middleware.checkCampOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp) {
        if(err) {
            console.log(err);
            //Redirect to Campgrounds Page
            res.redirect("/campgrounds");
        }
        else {
            //Redirect to Campground Page
            req.flash("success", "Sucessfully updated campground.");
            res.redirect("/campgrounds/" + updatedCamp._id);
        }
    });
});

//Delete Campground
router.delete("/:id", middleware.checkCampOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            console.log(err);
            //Redirect to Campgrounds Page
            res.redirect("/campgrounds");
        }
        else {
            req.flash("success", "Sucessfully deleted campground.");
            //Redirect to Campgrounds Page
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
