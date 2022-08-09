import './Score.css';
import AnimatedNumber from 'react-animated-number'
import {useNavigate} from 'react-router-dom';
import { useEffect } from 'react';


function Score (){
    return(
        <div className='background'>
            <div className='White-Space'>
                <h1 id='screen-name'>Screen Name</h1>
                <h4 id='user-name'>User_name</h4>
                <h2>Most Liked Tweet</h2>
                <h2>Profile Stats</h2>
                <h2>Famous Followers</h2>
                <h3>Clout Score</h3>
                <h5>Above Average</h5>
                <h5>Average Likes</h5>
                <h5>Retweet Count</h5>
                <h5>Tweet Count</h5>
                <p>Paragraph in main page</p>
                <AnimatedNumber className="animated-number" value={400} 
                formatValue={v => v.toFixed(0)} 
                duration={1000} 
                frameStyle={perc => (
                    {opacity: perc / 100}
                )} />
                {/*<ellipse />*/}
                <ellipse id='profile-pic' />
            </div>
        </div>
    )
}
export default Score;