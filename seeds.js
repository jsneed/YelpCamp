var mongoose   = require("mongoose"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment");

var data = [
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

function seedDB() {
    //Remove All Campgrounds
    Campground.remove({}, function(err){
        if(err) console.log(err);
        else {
            console.log("Removed Campgrounds collection");

            //Add a Few Campgrounds
            data.forEach(function(seed)
            {
                Campground.create(seed, function(err, camp)
                {
                    if(err) console.log(err);
                    else
                    {
                        console.log("added camp");
                        /*
                        //Create a Comment
                        Comment.create({text : "I hate camping", author : "Everbody"},
                            function(err, comment)
                            {
                                if(err) console.log(err);
                                else
                                {
                                    camp.comments.push(comment);
                                    camp.save();
                                    console.log("created new comment");
                                }
                            }
                        );
                        */camp.save();
                    }
                });

            });
        }
    });
}

module.exports = seedDB;
