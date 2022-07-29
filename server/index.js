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

// npm install twitter
// npm install dotenv

// Apply for developer key for access to twitter API.
// create an .env file and store variables like: apikey = 33453@443
// in the file you want to use them call variables like: apikey = process.env.apikey
// this hides all sensitive API credentials when posting on GitHub

//https://www.youtube.com/watch?v=Zsu3R0IOHps @4:53


//API Credentials
const apiKey = process.env.apikey;
const apiSecreteKey = process.env.apikeysecret;
const accessToken = process.env.accesstoken;
const accessTokenSecret = process.env.accesstokensecret;

var client = new Twitter({
    consumer_key: apiKey,
    consumer_secret: apiSecreteKey,
    access_token_key: accessToken,
    access_token_secret:  accessTokenSecret
});

//Example of API get request
var params = {screen_name: 'Jae78613139'};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if(!error) {
        console.log(tweets);
    } else {
        console.log(error);
    }
});