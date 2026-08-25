import React, { useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import { useContext } from 'react'
import axios from "axios"

const LoginPopup = ({setShowLogin}) => {
    const [currState, setCurrState] = useState("Login")

    const {url, token, setToken} = useContext(StoreContext)
    const [data, setData] = useState({
        name:"",
        email:"",
        password:"",
    });

    const onChangeHandler = (event) =>{
        const name = event.target.name;
        const value = event.target.value;

        setData(data=>({...data, [name]:value}));
 
    }
    const onLogin = async(event)=>{
        event.preventDefault();
        let newUrl = url;
        if(currState==="Login"){
            newUrl+="/api/user/login"
        }
        else{
            newUrl+="/api/user/register"
        }

        const responce = await axios.post(newUrl, data);
        if(responce.data.success){
            setToken(responce.data.token);
            localStorage.setItem("token", responce.data.token);
            setShowLogin(false);
        }
        else{
            alert(responce.data.message);
        }

    }


  return (
    <div className="login-popup">  
    <form onSubmit={onLogin} className="login-popup-container">

        <div className="login-popup-title">
            <h2>{currState}</h2>
            <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>

        <div className="login-popup-inputs">
            {currState === "Login" ? (<></>) : (<input name="name" onChange={onChangeHandler}
            value={data.name} type="text" placeholder="You name" required /> )}

            <input name="email" onChange={onChangeHandler}
            value={data.email} type="email" placeholder="Your email" required />

            <input name="password" onChange={onChangeHandler}
            value={data.password} type="password" placeholder="Password" required />
        </div>

        <button type='submit'> {currState === "Sign Up" ? "Create account" : "Login"} </button>

        <div className="login-popup-condition">
            <input type="checkbox" required />
            <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>

        {currState==="Login" ? <p> Create a new account? <span onClick={()=>setCurrState("Sign Up")}>Click here</span> </p> : 
            <p> Already have an account? <span onClick={()=>setCurrState("Login")}>Login here</span> </p>
        }
        
        
    </form>
    </div>
  )
}

export default LoginPopup