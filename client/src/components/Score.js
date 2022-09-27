import './Score.css';
import AnimatedNumber from 'react-animated-number'
import { useEffect, useState } from 'react';
import { TwitterTweetEmbed } from 'react-twitter-embed'; 
import Axios from 'axios';

//TODO:
//Login Page:
//1. Cloud images are stretched - need to fix sizing
//2. Cloud animation timing - need to space out more
//3. Title and Box need to be higher up on screen
//4. Invalid Profile tag needs to be brighter red - it looks purple

//Score Page:
//1. Page only covers 3/4 of the screen - need to stretch it to edges
//2. Need to put more space between followers and following counts under screen name
//3. Need to put high resolution profile pic for trending followers
//4. Clean up unused CSS code

function Score (){
    const [user, setUser] = useState("");
    const [followerList, setFollowerList] = useState([]);
    
    function followerShort(a, b) {
        if (a > 1000000) {
            a = (a /1000000).toFixed(1);
            b = "M";
        } else if (a > 1000){
            a = (a/1000).toFixed(1);
            b = "K";
        } else{
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
            })
        }
        getData();
    }, []);

    return(
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
                            <h1>{user.screen_name}</h1> 
                            <h4>{user.name}</h4>
                            <h6>{followerShort(user.followers_count)}</h6>
                            <h5> Followers </h5>
                            <h6>{followerShort(user.friends_count)}</h6>
                            <h5> Following</h5>
                        </div>

                        <div className="rone-col-three">
                            <h3>Clout Score</h3>
                            <div className="animated-num">
                                <AnimatedNumber value={user.clout_score} style={{fontSize: 120, fontFamily: "Oxanium"}}
                                formatValue={n => n.toFixed(0)}
                                frameStyle={percentage => percentage > 80 && percentage < 80 ? { opacity: 5 } : {}}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row-two">
                        <div className="rtwo-col-one">
                            <h2>Trending Tweet</h2>
                                <TwitterTweetEmbed key={user.trending_tweet} tweetId={user.trending_tweet} options={{cards: 'hidden' }}/>
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
                                                    <h5>{followerShort(follower.followers_count)} Followers</h5>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
    )
}
export default Score;