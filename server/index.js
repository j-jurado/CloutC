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

app.get("/getScore", async (req, res) => {
    console.log("GETTING SCORE...");
    
    var followerScore;
    if(userInformation.followers_count == 0){
        followerScore = 0;
    } else if(userInformation.followers_count == 1){
        followerScore = 15;
    } else {
        followerScore = Math.round(Math.log10(userInformation.followers_count)*100);
    }

    //Needs to be inverted so that a larger ratio hurts the score
    var followersToLikesRatio = Math.round(userInformation.followers_count/userInformation.average_likes);
    var likesRatioScore;
    if(followersToLikesRatio == 0 || userInformation.average_likes == 0){
        likesRatioScore = 0;
    } else if (followersToLikesRatio == 1){
        likesRatioScore = 15;
    } else {
        likesRatioScore = Math.round(Math.log10(followersToLikesRatio)*100);
    }

    //Needs to be inverted so that a larger ratio hurts the score
    var followersToRetweetsRatio = Math.round(userInformation.followers_count/userInformation.average_retweets);
    var retweetsRatioScore;
    if(followersToRetweetsRatio == 0 || userInformation.average_retweets == 0){
        retweetsRatioScore = 0;
    } else if (followersToRetweetsRatio == 1){
        retweetsRatioScore = 15;
    } else {
        retweetsRatioScore = Math.round(Math.log10(followersToRetweetsRatio)*100);
    }

    var cloutScore = Math.round(followerScore*0.6 + likesRatioScore*0.3 + retweetsRatioScore*0.3);
    userInformation["clout_score"] = cloutScore;
    res.json({"code": 1});
})
app.get("/getFollowers", async (req, res) => {
    console.log("GETTING FOLLOWERS...");
    var followers;
    params = {screen_name : screenName, skip_status: true, include_user_entities: false, count: 200};
    client.get('followers/list', params, function(error, info, response) {
        if(!error) {
            followers = info.users;
            var trending_followers = [];
            followers.sort((a, b) => parseFloat(b.followers_count) - parseFloat(a.followers_count));
            //console.log(followers);
            if(followers[0]) trending_followers.push(followers[0]);
            if(followers[1]) trending_followers.push(followers[1]);
            if(followers[2]) trending_followers.push(followers[2]);
            userInformation["trending_followers"] = trending_followers;
            res.json(info);
        } else {
            console.log(error);
            res.json(error);
        };
    })
});

app.get("/getTweets", async (req, res) => {
    console.log("GETTING TWEETS...");
    var tweets;
    params = {screen_name : screenName, include_rts : false, exclude_replies : true, trim_user : true, count: 200};
    //params = {screen_name : userInformation.screen_name};
    client.get('statuses/user_timeline', params, function(error, info, response) {
        if(!error) {
            tweets = info;
            //console.log(tweets);
            //console.log("Successfully retrieved tweets");
            var tweetCount = 0;
            var tweetLikes = 0;
            var tweetRetweets = 0;
            var retweetCount = 0;
            var maxLikes = -1;
            var maxRT = -1;
            var popularTweetID;
            var averageLikes = 0;
            var averageRTS = 0;
            tweets.map((tweet) => {
                
                if(tweet.retweeted_status == null){
                    tweetCount++;
                    tweetLikes += tweet.favorite_count;
                    tweetRetweets += tweet.retweet_count;
            
                    if(tweet.favorite_count >= maxLikes){
                        if(tweet.favorite_count > maxLikes){
                            popularTweetID = tweet.id_str;
                            maxLikes = tweet.favorite_count;
                        }
                        else if(tweet.retweet_count > maxRT){
                            popularTweetID = tweet.id_str;
                            maxRT = tweet.retweet_count;
                        }
                        //console.log(tweet);
                    } 
                } else {
                    retweetCount++;
                }
            })
            if(tweetCount != 0){
                averageLikes = tweetLikes/tweetCount;
                averageRTS = tweetRetweets/tweetCount;
            };
            //console.log("Tweet Count: " + tweetCount);
            //console.log("Retweet Count: " + retweetCount);
            //console.log("Average Likes: " + averageLikes);
            //console.log("Average Retweets: " + averageRTS);
            userInformation["tweet_count"] = tweetCount;
            userInformation["average_likes"] = Math.round(averageLikes);
            userInformation["average_retweets"] = Math.round(averageRTS);
            userInformation["trending_tweet"] = popularTweetID;
            //console.log(userInformation);
            //console.log(tweets);
            res.json(info);
        } else {
            console.log(error);
            res.json(error);
        }
    })
    //console.log("Finished getting tweets...")
})

app.get("/getUser", async (req, res) => {
    //getTweets();
    //test();
    console.log("Returning userInformation");
    console.log(userInformation);
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
            console.log(info);
            if(info.protected){
                console.log("PROFILE PRIVATE")
                res.json({"code": 1});
            } else {
                console.log("PROFILE PUBLIC");
                
                // var profilePic = info.profile_image_url_https.slice(0,-11);
                // var profilePicEnd = info.profile_image_url_https.slice(-4);
                // if(!info.default_profile_image){
                //     profilePic += ".jpg";
                // } else {
                //     profilePic += ".png";
                // }
                var profilePic = 
                    info.profile_image_url_https.slice(0,-11) + 
                    info.profile_image_url_https.slice(-4);

                userInformation = {
                    "id" : info.id,
                    "name" : info.name,
                    "screen_name" : info.screen_name,
                    "followers_count" : info.followers_count,
                    "friends_count" : info.friends_count,
                    "statuses_count" : info.statuses_count,
                    "profile_picture" : profilePic,
                };
                //console.log(info);
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