const express = require("express");
const app = express();
const mongoose = require('mongoose');
var Twitter = require('twitter');
const UserModel = require("./models/Users");
require('dotenv/config');
const cors = require("cors");
const { json } = require("express");
var user;
var screenName;
var userInformation;

app.use(express.json());
app.use(cors());

//Insert cluster link here once database is setup
//mongoose.connect("");
mongoose.connect("mongodb+srv://CloutC:CloutC123@cluster0.fkboauh.mongodb.net/?retryWrites=true&w=majority");

app.listen(3001, () => {
    console.log("SERVER RUNNING SUCCESSFULLY");
});

// Apply for developer key for access to twitter API.
// create an .env file and store variables like: apikey = 33453@443
// in the file you want to use them call variables like: apikey = process.env.apikey
// this hides all sensitive API credentials when posting on GitHub

//https://www.youtube.com/watch?v=Zsu3R0IOHps @4:53


//API credentials
const apiKey = process.env.apikey;
const apiSecreteKey = process.env.apikeysecret;
const accessToken = process.env.accesstoken;
const accessTokenSecret = process.env.accesstokensecret;

//Twitter access client
var client = new Twitter({
    consumer_key: apiKey,
    consumer_secret: apiSecreteKey,
    access_token_key: accessToken,
    access_token_secret:  accessTokenSecret
});

//(DELETE LATER) Test user profile fetch
// function getUserProfileInfo(scr_name) {
//     var params = {screen_name: scr_name};
//     client.get('users/show', params, function(error, info, response) {
//         if(!error) {
//             console.log("SHOWING USER INFORMATION...");
//             console.log(info);
//         } else {
//             console.log(error);
//         }
//     });
// }
// getUserProfileInfo("jesusjrdo");

//User profile fetch html compatible
function getUserProInfo(req, res) {
    var params = {screen_name: req.body};
    client.get('users/show', params, function(error, info, response) {
        if(!error) {
            console.log(info);
            res.json(info);
        } else {
            console.log(error);
        }
    });
}

//TODO: create front end textbox to call this function
//Look at:
//https://github.com/imar26/twitter-webapp/blob/master/server/app.js
//https://github.com/rgarber11/Dosca/blob/main/dosca-whiteboard/server/server.js
//https://github.com/machadop1407/MERN-Beginners/blob/main/server/index.js


// app.get("/getStaticInfo", (req, res) => {
//     console.log("ENTERING GET STATIC INFO..........");
//     console.log(user);
//     res.json(user);
// });

// app.get("/getStaticInfo1", async (req, res) => {
//     console.log("ENTERING GET STATIC INFO1..........");
//     console.log(userInformation.followers);
// })

// async function getTweets() {
//     console.log("GETTING TWEETS....");
//     var tweets;
//     params = {screen_name : screenName};
//     //params = {screen_name : userInformation.screen_name};
//     client.get('statuses/user_timeline', params, function(error, info, response) {
//         if(!error) {
//             tweets = info;
//             console.log("Successfully retrieved tweets");
//             var tweetCount = 0;
//             var tweetLikes = 0;
//             var tweetRetweets = 0;
//             var maxLikes = 0;
//             var maxRT = 0;
//             var popularTweetID;
//             tweets.map((tweet) => {
                
//                 if(tweet.retweeted_status == null){
//                     tweetCount++;
//                     tweetLikes += tweet.favorite_count;
//                     tweetRetweets += tweet.retweet_count;

//                     if(tweet.favorite_count > maxLikes){

//                     }
//                 }
//             })
//             console.log("Tweet Count: " + tweetCount);
//             console.log("Average Likes: " + tweetLikes/tweetCount);
//             console.log("Average Retweets: " + tweetRetweets/tweetCount);
//             userInformation["tweet_count"] = tweetCount;
//             userInformation["average_likes"] = tweetLikes/tweetCount;
//             userInformation["average_retweets"] = tweetRetweets/tweetCount;
//             console.log(userInformation);
//             //res.json(info);
//         } else {
//             console.log(error);
//             //res.json(error);
//         }
//     })
//     return 1;
// }

app.get("/getTweets", async (req, res) => {
    console.log("GETTING TWEETS...");
    var tweets;
    params = {screen_name : screenName, include_rts : false, exclude_replies : true, trim_user : true, count: 200};
    //params = {screen_name : userInformation.screen_name};
    client.get('statuses/user_timeline', params, function(error, info, response) {
        if(!error) {
            tweets = info;
            console.log("Successfully retrieved tweets");
            var tweetCount = 0;
            var tweetLikes = 0;
            var tweetRetweets = 0;
            var retweetCount = 0;
            var maxLikes = 0;
            var maxRT = 0;
            var popularTweetID;
            var averageLikes = 0;
            var averageRTS = 0;
            tweets.map((tweet) => {
                
                if(tweet.retweeted_status == null){
                    tweetCount++;
                    tweetLikes += tweet.favorite_count;
                    tweetRetweets += tweet.retweet_count;
                } else {
                    retweetCount++;
                }
            })
            if(tweetCount != 0){
                averageLikes = tweetLikes/tweetCount;
                averageRTS = tweetRetweets/tweetCount;
            }
            console.log("Tweet Count: " + tweetCount);
            console.log("Retweet Count: " + retweetCount);
            console.log("Average Likes: " + averageLikes);
            console.log("Average Retweets: " + averageRTS);
            userInformation["tweet_count"] = tweetCount;
            userInformation["average_likes"] = averageLikes;
            userInformation["average_retweets"] = averageRTS;
            console.log(userInformation);
            //console.log(tweets);
            res.json(info);
        } else {
            console.log(error);
            res.json(error);
        }
    })
    console.log("Finished getting tweets...")
})

app.get("/getUser", async (req, res) => {
    //getTweets();
    //test();
    console.log("Returning userInformation");
    res.json(userInformation);
})

// app.post("/createUser", async (req, res) => {
//     const user = req.body;
//     const newUser = new UserModel(user);
//     await newUser.save();

//     res.json(user);
// });

app.post("/validUser", async (req, res) => {
    console.log("RUNNING VALID USER FUNC");
    screenName = req.body.username;
    var params = {screen_name: screenName};
    //console.log(params);
    client.get('users/show', params, function(error, info, response) {
        if(!error) {
            user = info;
            //console.log(user);
            //console.log(info);
            if(info.protected){
                console.log("PROFILE PRIVATE")
                res.json({"code": 1});
            } else {
                console.log("PROFILE PUBLIC");
                userInformation = {
                    "id" : info.id,
                    "name" : info.name,
                    "screen_name" : info.screen_name,
                    "followers_count" : info.followers_count,
                    "friends_count" : info.friends_count,
                    "statuses_count" : info.statuses_count,
                };
                //await getTweets().then(alert);
                //getTweets();
                res.json(info);
            }
        } else {
            console.log(error);
            res.json({"code": 0});
        }
    });
});