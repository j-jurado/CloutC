import './Score.css';
import AnimatedNumber from 'react-animated-number'
import {useNavigate} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { TwitterTweetEmbed } from 'react-twitter-embed'; 
import Axios from 'axios';


function Score (){
    //const [staticInfo, setStaticInfo] = useState();
    const [user, setUser] = useState("");
    const [followerList, setFollowerList] = useState([]);
    //const userInfo = JSON.parse(staticInfo);
    //onst userInfo = staticInfo.value("follower_count");
    //userInfo = JSON.parse(userInfo);
    //const userInfo = JSON.stringify(staticInfo, null, 2);
    //const userSuperInfo = JSON.parse(userInfo);
    //const userInfo = JSON.stringify(staticInfo);
    //const userSuperInfo = JSON.parse(userInfo);

    //IDEAS:
    // 1. Go through back end and make individual functions that return the individual things
    // 2. Go to back end and make a list all the information in the exact order and return that list to the front end
    //var var0 = "1559823434028400640";
    //var var1 = '';
    //const [trendingTweetID, setTrendingTweetID] = useState("");
    


    useEffect(() => {
        const getData = async() => {
            const tweets = await Axios.get("http://localhost:3001/getTweets");
            const followers = await Axios.get("http://localhost:3001/getFollowers");
            const score = await Axios.get("http://localhost:3001/getScore");
            const user = Axios.get("http://localhost:3001/getUser").then((response) => {
                setUser(response.data);
                setFollowerList(response.data.trending_followers);
                //setTrendingTweetID(response.data.trending_tweet);
                //console.log(typeof trendingTweetID);
                //var0 = response.data.trending_tweet;
            })
            
        }
        getData();
        //setTrendingTweetID(user.trending_tweet);
        //var1 = user.trending_tweet;
        // Axios.get("http://localhost:3001/getTweets");
        // Axios.get("http://localhost:3001/getUser").then((response) => {
        //     setUser(response.data);
        // })
    }, []);

    //const var1 = trendingTweetID;

    return(
        // <div className='background'>
        //     <div className='White-Space'>
        //         <h1 id='screen-name'>Screen Name</h1>
        //         <h4 id='user-name'>User_name</h4>
        //         <h2>Most Liked Tweet</h2>
        //         <h2>Profile Stats</h2>
        //         <h2>Famous Followers</h2>
        //         <h3>Clout Score</h3>
        //         <h5>Above Average</h5>
        //         <h5>Average Likes</h5>
        //         <h5>Retweet Count</h5>
        //         <h5>Tweet Count</h5>
        //         <p>Paragraph in main page</p>
        //         <AnimatedNumber className="animated-number" value={400} 
        //         formatValue={v => v.toFixed(0)} 
        //         duration={1000} 
        //         frameStyle={perc => (
        //             {opacity: perc / 100}
        //         )} />
        //         {/*<ellipse />*/}
        //         <ellipse id='profile-pic' />
        //     </div>
        // </div>
        <body>
            <img src={user.profile_picture} width="10%" height="10%"/>
            <p>Name: {user.name}</p>
            <p>Screen Name: {user.screen_name}</p>
            <p>Followers: {user.followers_count}</p>
            <p>Following: {user.friends_count}</p>
            <h1>Profile Stats</h1>
            <p>Average Likes: {user.average_likes}</p>
            <p>Average Retweets: {user.average_retweets}</p>
            <p>Tweet Count: {user.statuses_count}</p>
            <h1>Trending Tweet</h1>
            <TwitterTweetEmbed key={user.trending_tweet} tweetId={user.trending_tweet}/>
            <div className="followerDisplay">
                <h1> Trending Followers</h1>
                {followerList.map((follower) => {
                    return(
                        <div>
                            <img src={follower.profile_image_url_https} width="2%" height="2%"/>
                            <p><a href={"https://twitter.com/"+follower.screen_name}>{follower.name}</a></p>
                            <p>{follower.screen_name}</p>
                            <p>Followers: {follower.followers_count}</p>
                            <p>Following: {follower.friends_count}</p>
                        </div>
                    );
                })}
            </div>
        </body>
    )
}
export default Score;