//import parallel from 'async/parallel';
var asyncs = require("async");

var mongoose   = require("mongoose"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    User       = require("./models/user");

var userData = [
    {
        username: "charlie",
        password: "test123"
    },
    {
        username: "woodstock",
        password: "test123"
    },
    {
        username: "lucy",
        password: "test123"
    },
    {
        username: "snoopy",
        password: "test123"
    }
];

var campData = [
    {
        name: "Cloud's Rest",
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Frankfurter andouille ground round salami. Boudin sausage rump strip steak sirloin. Jerky capicola picanha, salami fatback ham hock shoulder andouille shankle pork chop spare ribs pastrami rump. Shoulder sausage ground round, short ribs ball tip beef brisket chuck venison. Shank salami venison, tenderloin leberkas bacon hamburger chicken meatball porchetta ball tip spare ribs. Jerky tail pork loin chicken rump. Prosciutto fatback capicola alcatra, kielbasa frankfurter chicken corned beef doner shank flank biltong pork t-bone."
    },
    {
        name: "Desert Mesa",
        image: "https://farm4.staticflickr.com/3859/15123592300_6eecab209b.jpg",
        description: "Bacon ipsum dolor amet pork belly pork chop chuck flank short ribs corned beef drumstick tri-tip alcatra porchetta. Hamburger beef ribs shank pork belly jowl short loin salami swine pastrami. Ribeye swine t-bone pork chop shankle jerky pancetta tail. Picanha boudin capicola venison andouille sausage jowl. Tongue tail sirloin, shoulder filet mignon hamburger strip steak leberkas cupim short loin beef alcatra flank boudin. Swine pork beef shank flank short loin pork chop kielbasa fatback doner pig jerky turducken. Pig short loin tongue pastrami, salami frankfurter bresaola brisket corned beef venison pork belly."
    },
    {
        name: "Canyon Floor",
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Fatback biltong pig cupim sirloin bresaola doner pastrami shankle. Short ribs pancetta kielbasa, picanha andouille sirloin leberkas ball tip jerky meatball pork. Short ribs turkey brisket, meatball beef ribs meatloaf beef prosciutto. Spare ribs pastrami pork capicola doner ham sausage kielbasa biltong pork belly picanha corned beef prosciutto swine."
    }
];

var users = [];
var camps = [];

function setupUsers(){

    asyncs.each(userData, function(seedUser, callback) {

        var newUser = new User({username : seedUser.username});
        User.register(newUser, seedUser.password, function(err, user) {
            if(err) {
                console.log("1");
                console.log(err);
                callback(err);
            }
            else {
                users.push(user);
                //console.log(user);
                callback();
            }
        });
    }, function(err ){
        if(err) console.log(err);
        else {
            console.log("all users entered");
            setupCamps();
        }
    });

}

function setupCamps(){

    asyncs.forEachOf(campData, function (camp, index, callback) {
        var author = {
            id: users[index]._id,
            username: users[index].username
        };
        var newCamp = new Campground({name : camp.name, image : camp.image, description : camp.description, author : author});
        Campground.create(newCamp, function(err, camp){
            if(err) {
                callback(err);
            }
            else {
                camps.push(camp);
                //console.log(camp);
                callback();
            }
        });
    }, function(err) {
        if(err) console.log(err);
        else {
            console.log("all camps entered");
            setupComments();
        }
    });

}

function setupComments() {

    asyncs.forEachOf(camps, function (camp, index, callback) {
        var str = "I ";
        for(var j = 0; j < index+1; j++) {
            str += "really ";
        }
        str += "hate camping";

        Comment.create({text : str}, function(err, comment){
            if(err) {
                callback(err);
            }
            else {
                //Add username and ID to comment
                comment.author.username = users[index + 1].username;
                comment.author.id = users[index + 1]._id;
                comment.save();

                //Add comment to array
                camp.comments.push(comment);
                camp.save();

                //console.log(comment);
                callback();
            }
        });
    }, function(err) {
        if(err) console.log(err);
        else {
            console.log("all comments entered");
        }
    });

}

function seedDB2() {
    Campground.remove({}, function(err){
        if(err) {
            console.log(err);
            process.exit(1);
        }
        else {
            console.log("Removed Campgrounds collection");

            //If removing camps work, remove comments
            Comment.remove({}, function(err){
                if(err) {
                    console.log(err);
                    process.exit(1);
                }
                else {
                    console.log("Removed Comments collection");

                    //If removing comments work, remove users
                    User.remove({}, function(err){
                        if(err) {
                            console.log(err);
                            process.exit(1);
                        }
                        else {
                            console.log("Removed Users collection");

                            setupUsers();

                        }
                    });
                }
            });
        }
    });

}

module.exports = seedDB2;
