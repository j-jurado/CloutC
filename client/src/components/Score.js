import './Score.css';
import AnimatedNumber from 'react-animated-number'
import {useNavigate} from 'react-router-dom';
import { useEffect, useState } from 'react';
import Axios from 'axios';


function Score (){
    const [staticInfo, setStaticInfo] = useState();
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

    useEffect(() => {
        Axios.get("http://localhost:3001/getTweets").then((response) => {
          //setListOfUsers(response.data);
        });
    }, []);

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
        <h1>Score Page</h1>
    )
}
export default Score;