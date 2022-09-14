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
    
function followerShort(a, b) {

    if (a > 1000000) {
        a = (a /1000000).toFixed(1);
        b = "M";
    } else if (a > 1000){
        a = (a/1000).toFixed(1);
        b = "K";
    }
    else{
        a = a;
        b = " ";
    }
        
    return [a, b];
}

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
            <div className="blue-grad">
                <div className="white-box">
                    <div className="row-one">
                        <div className="rone-col-one">
                            <div className="user-pic-backg">
                                <img className="user-pic" src={user.profile_picture} width="10%" height="10%"/>
                            </div>
                        </div>
                        <div className="rone-col-two">
                            <h1>{user.screen_name}</h1> {/* screen name */}
                            <h4>{user.name}</h4>
                            {/* <h1>Screen Name: {user.screen_name}</h1> */}
                            {/* <h5>Followers: {user.followers_count} Following: {user.friends_count}</h5> */}
                            {/* <h5>{followerShort(user.followers_count)} Followers {followerShort(user.friends_count)} Following</h5> */}
                            
                            <h6>{followerShort(user.followers_count)}</h6>
                            <h5> Followers </h5>
                            <h6>{followerShort(user.friends_count)}</h6>
                            <h5> Following</h5>
                            {/* <p>Following: {user.friends_count}</p> */}
                        </div>
                        <div className="rone-col-three">
                            <h3>Clout Score</h3>
                            <div className="animated-num">
                                <AnimatedNumber value={user.clout_score} style={{fontSize: 120, fontFamily: "Oxanium"}}
                                formatValue={n => n.toFixed(0)}
                                frameStyle={percentage => percentage > 80 && percentage < 80 ? { opacity: 5 } : {}}
                                />
                            </div>
                            {/* <p>{user.clout_score}</p> */}
                        </div>
                    </div>
                    {/* <p>Name: {user.name}</p>
                    <p>Screen Name: {user.screen_name}</p>
                    <p>Followers: {user.followers_count}</p>
                    <p>Following: {user.friends_count}</p> */}
                    {/* <h1>Clout Score</h1>
                    <p>{user.clout_score}</p> */}
                    <div className="row-two">

                        <div className="rtwo-col-one">
                            <h2>Trending Tweet</h2>
                            {/* <div className="tweet"> */}
                                <TwitterTweetEmbed key={user.trending_tweet} tweetId={user.trending_tweet} options={{cards: 'hidden' }}/>
                            {/* </div> */}
                        </div>
                            
                        <div className="rtwo-col-two">
                            <h2>Profile Stats</h2>
                            <div className="num1">
                                <p>{user.average_likes}</p>
                            </div>
                            <br/>
                            <p>Average Likes</p>
                            <br/>
                            <div className="num2">
                                <p>{user.average_retweets}</p>
                            </div>
                            <br/>
                            <p>Average Retweets</p>
                            <br/>
                            <div className="num3">
                                <p>{user.statuses_count}</p>
                            </div>
                            <br/>
                            <p>Tweet Count</p>
                            {/* <p>Average Likes: {user.average_likes}</p>
                            <p>Average Retweets: {user.average_retweets}</p>
                            <p>Tweet Count: {user.statuses_count}</p> */}
                        </div>

                        <div className="rtwo-col-three">
                            <div className="followerDisplay">
                                <h2> Trending Followers</h2>
                                {followerList.map((follower) => {
                                    return(
                                        <div className="follow-columns">
                                            <div className="follow-col-1">
                                                <div className="follow-back">
                                                    <img className="flr-pic" src={follower.profile_image_url_https} width="75px" height="75px"/>
                                                </div>
                                            </div>
                                            <div className="follow-col-2">
                                               
                                                    <h3><a href={"https://twitter.com/"+follower.screen_name}>{follower.name}</a></h3>
                                                    <h4>{follower.screen_name}</h4>
                                                    {/* <h5>{follower.followers_count} Followers</h5> */}
                                                    <h5>{followerShort(follower.followers_count)} Followers</h5>
                                                    {/* <h5>Following: {follower.friends_count}</h5> */}
                                            </div>
                                            {/* <p>Following: {follower.friends_count}</p> */}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                            {/* <h2>Trending Tweet</h2>
                            <TwitterTweetEmbed key={user.trending_tweet} tweetId={user.trending_tweet}/>
                            <div className="followerDisplay">
                                <h2> Trending Followers</h2>
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
                            </div> */}
                    </div>
                </div>
            </div>
        </body>
    )
}
export default Score;