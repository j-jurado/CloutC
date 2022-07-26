const express = require("express");
const cors = require("cors");
var Twitter = require('twitter');
const app = express();
require('dotenv/config');
var screenName;
var userInformation;

app.use(express.json());
app.use(cors());

app.listen(3001, () => {
    console.log("SERVER RUNNING SUCCESSFULLY");
});

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

app.get("/getScore", async (req, res) => {
    console.log("GETTING SCORE...");
    
    var followerScore;
    if(userInformation.followers_count == 0){
        followerScore = 0;
    } else {
        followerScore = Math.ceil(0.5*Math.ceil(Math.sqrt(userInformation.followers_count)));
    }

    var likesToFollowersRatio = userInformation.average_likes/userInformation.followers_count;
    var likesRatioScore;
    if(likesToFollowersRatio == 0 || userInformation.followers_count == 0){
        likesRatioScore = 1;
    } else {
        likesRatioScore = Math.ceil(userInformation.statuses_count*likesToFollowersRatio);
    }

    var retweetsToFollowersRatio = userInformation.average_retweets/userInformation.followers_count;
    var retweetsRatioScore;
    if(retweetsToFollowersRatio == 0 || userInformation.followers_count == 0){
        retweetsRatioScore = 1;
    } else {
        retweetsRatioScore = Math.ceil(userInformation.statuses_count*retweetsToFollowersRatio);
    }

    var cloutScore = Math.round(Math.ceil(followerScore*0.3) + Math.sqrt(likesRatioScore) + Math.sqrt(retweetsRatioScore));
    userInformation["clout_score"] = cloutScore;

    console.log("follower score: " + followerScore);
    console.log("likes ratio: " + likesToFollowersRatio);
    console.log("likes score: " + likesRatioScore);
    console.log("rts score: " + retweetsRatioScore);
    console.log("rts ratio: " + retweetsToFollowersRatio);
    console.log("clout score: " + cloutScore);

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
    client.get('statuses/user_timeline', params, function(error, info, response) {
        if(!error) {
            tweets = info;
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
                        } else if(tweet.retweet_count > maxRT){
                            popularTweetID = tweet.id_str;
                            maxRT = tweet.retweet_count;
                        }
                    } 
                } else {
                    retweetCount++;
                }
            })
            if(tweetCount != 0){
                averageLikes = tweetLikes/tweetCount;
                averageRTS = tweetRetweets/tweetCount;
            };
            userInformation["tweet_count"] = tweetCount;
            userInformation["average_likes"] = Math.round(averageLikes);
            userInformation["average_retweets"] = Math.round(averageRTS);
            userInformation["trending_tweet"] = popularTweetID;
            res.json(info);
        } else {
            console.log(error);
            res.json(error);
        }
    })
})

app.get("/getUser", async (req, res) => {
    console.log("Returning userInformation");
    console.log(userInformation);
    res.json(userInformation);
})

app.post("/validUser", async (req, res) => {
    console.log("RUNNING VALID USER FUNC");
    screenName = req.body.username;
    var params = {screen_name: screenName};
    client.get('users/show', params, function(error, info, response) {
        if(!error) {
            user = info;
            console.log(info);
            if(info.protected){
                console.log("PROFILE PRIVATE")
                res.json({"code": 1});
            } else {
                console.log("PROFILE PUBLIC");
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
                res.json(info);
            }
        } else {
            console.log(error);
            res.json({"code": 0});
        }
    });
});