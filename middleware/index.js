var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {

        //Find Campground in MongoDB
        Campground.findById(req.params.id).exec(function(err, foundCamp) {
            if(err) {
                console.log(err);
                //Redirect to Campground Page
                req.flash("error", "Campground not found");
                res.redirect("back");
            }
            else if(foundCamp.author.id.equals(req.user._id)) { //Did user create this campground
                //Go to Next Function
                return next();
            }
            else {
                req.flash("error", "You don't have permission to do that.");
                res.redirect("back");
            }
        });

    }
    else {
        req.flash("error", "You need to login first");
        res.redirect("/login");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {

        //Find Campground in MongoDB
        Comment.findById(req.params.comment_id).exec(function(err, foundComment) {
            if(err) {
                console.log(err);
                //Redirect to Campground Page
                req.flash("error", "Comment not found");
                res.redirect("back");
            }
            else if(foundComment.author.id.equals(req.user._id)) { //Did user create this comment
                //Go to Next Function
                return next();
            }
            else {
                req.flash("error", "You don't have permission to do that.");
                res.redirect("back");
            }
        });

    }
    else {
        req.flash("error", "You need to login first");
        res.redirect("/login");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to login first.");
    res.redirect("/login");
}

module.exports = middlewareObj;
