const express = require("express");
const app = express();
const mongoose = require('mongoose');
var Twitter = require('twitter');
require('dotenv/config');

//Insert cluster link here once database is setup
//mongoose.connect("");

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
function getUserProfileInfo(scr_name) {
    var params = {screen_name: scr_name};
    client.get('users/show', params, function(error, info, response) {
        if(!error) {
            console.log("SHOWING USER INFORMATION...");
            console.log(info);
        } else {
            console.log(error);
        }
    });
}
getUserProfileInfo("jesusjrdo");

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

