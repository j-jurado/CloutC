import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import './Login.css';

const Login = ({ authorize }) => {
    const errRef = useRef();
    const [username, setUsername] = useState("");
    const [errMsg, setErrMsg] = useState('');
    let navigate = useNavigate();

    const clickNav = () => {
        authorize();
        navigate("score");
    }

    const validUser = async () => {
        await Axios.post("http://localhost:3001/validUser", {
            username,
        }).then((response) => {
            if(Object.keys(response.data).length === 1){
                if(response.data.code === 0){
                    console.log("INVALID PROFILE");
                    setErrMsg('Invalid Profile');
                    console.log(errMsg);
                }
                if (response.data.code === 1) {
                    console.log("PRIVATE PROFILE");
                    setErrMsg('Private Profile');
                    console.log(errMsg);
                }
                errRef.current.focus();
            } else {
                console.log("VALID PROFILE");
                console.log(response.data);
                clickNav();
            }
        });
    }
    
    return (
    <div className="App">
        <div className="title-square">
            <h1>Clout C</h1>
            <img className='cloud' src={require("../assets/cloud.png")}/>
            <img className='cloud2' src={require("../assets/cloud2.png")}/>
            <img className='cloud3' src={require("../assets/cloud3.png")}/>
            <img className='cloud4' src={require("../assets/cloud4.png")}/>
          
            <div className="white-background">
                <input className='inputs'
                type="text"
                placeholder="Enter Username"
                onChange={(event) => {
                    setUsername(event.target.value);
                }}
                />
                <button className="buttns" onClick={validUser}> Calculate Score </button>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            </div>
        </div>
        <p>Calculate your popularity score by entering your twitter username.</p>
    </div>
    );
}
export default Login;