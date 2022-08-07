import { useRef, useState, useEffect} from "react";
import Axios from 'axios';

function Login() {
    const errRef = useRef();
    const [listOfUsers, setListOfUsers] = useState([]);
    const [username, setUsername] = useState("");
    const [errMsg, setErrMsg] = useState('');

    const validUser = async () => {
        Axios.post("http://localhost:3001/validUser", {
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
            }
        });
    }
    
    return (
    <div className="App">
        <div>
            <input
            type="text"
            placeholder="username..."
            onChange={(event) => {
                setUsername(event.target.value);
            }}
            />
            <button onClick={validUser}> input </button>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        </div>
    </div>
    );
}
 
export default Login;