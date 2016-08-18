var express = require("express");
var router  = express.Router({mergeParams : true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comment Routes

//Comment Create Form
router.get("/new", middleware.isLoggedIn, function(req, res) {
    //Find Campground in MongoDB
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp) {
        if(err) {
            console.log(err);
        }
        else {
            //Redirect to Comments New Page
            res.render("comments/new", {campground : foundCamp});
        }
    });
});

//Save the Comment to MongoDB
router.post("/", middleware.isLoggedIn, function(req, res) {
    //Find Campground in MongoDB
    Campground.findById(req.params.id, function(err, foundCamp) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else {
            Comment.create(req.body.comment, function(err, comment){
                if(err) {
                    console.log(err);
                }
                else {
                    //Add username and ID to comment
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id;
                    comment.save();

                    //Add comment to array
                    foundCamp.comments.push(comment);
                    foundCamp.save();

                    req.flash("success", "Sucessfully created comment.");

                    //Redirect to Comments New Page
                    res.redirect("/campgrounds/" + foundCamp._id);
                }
            });

        }
    });
});

//Edit the Comment (show form)
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    //Find Comment in MongoDB
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            console.log(err);
        }
        else {
            res.render("comments/edit", {comment : foundComment, campground_id : req.params.id});
        }
    });
});

//Update the Comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    //Find Comment in MongoDB
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err) {
            console.log(err);
            //Redirect back
            res.redirect("back");
        }
        else {
            req.flash("success", "Sucessfully updated comment.");

            //Redirect to Campground Show Page
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Delete the Comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    //Find Comment in MongoDB
    Comment.findByIdAndRemove(req.params.comment_id, req.body.comment, function(err) {
        if(err) {
            console.log(err);
            //Redirect back
            res.redirect("back");
        }
        else {
            //Redirect to Campground Show Page
            req.flash("success", "Sucessfully deleted comment.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;
