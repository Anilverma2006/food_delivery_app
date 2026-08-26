import React, {
    useState,
    useContext
} from "react";

import "./LoginPopup.css";

import { assets } from "../../assets/assets";

import {
    StoreContext
} from "../../context/StoreContext";

import axios from "axios";

import {
    useNavigate
} from "react-router-dom";

const LoginPopup = ({ setShowLogin }) => {

    const [currState, setCurrState] =
        useState("Login");

    const {
        url,
        setToken,
        setRole
    } = useContext(StoreContext);

    const navigate = useNavigate();

    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const onChangeHandler = (event) => {

        const name =
            event.target.name;

        const value =
            event.target.value;

        setData((data) => ({
            ...data,
            [name]: value,
        }));
    };

    const onLogin = async (event) => {

        event.preventDefault();

        let newUrl = url;

        if (currState === "Login") {
            newUrl += "/api/user/login";
        } else {
            newUrl += "/api/user/register";
        }

        try {

            const response =
                await axios.post(
                    newUrl,
                    data
                );

            if (response.data.success) {

                const token =
                    response.data.token;

                const role =
                    response.data.role || "user";

                /*
                 * Save authentication
                 */
                localStorage.setItem(
                    "token",
                    token
                );

                localStorage.setItem(
                    "role",
                    role
                );

                /*
                 * Update React context
                 */
                setToken(token);
                setRole(role);

                /*
                 * Close popup
                 */
                setShowLogin(false);

                /*
                 * Role decides first page
                 */
                if (role === "admin") {

                    navigate("/add", {
                        replace: true
                    });

                } else {

                    navigate("/", {
                        replace: true
                    });
                }

            } else {

                alert(
                    response.data.message
                );
            }

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Something went wrong"
            );
        }
    };

    return (
        <div className="login-popup">

            <form
                onSubmit={onLogin}
                className="login-popup-container"
            >

                <div className="login-popup-title">

                    <h2>
                        {currState}
                    </h2>

                    <img
                        onClick={() =>
                            setShowLogin(false)
                        }
                        src={assets.cross_icon}
                        alt=""
                    />

                </div>

                <div className="login-popup-inputs">

                    {currState === "Login"
                        ? null
                        : (
                            <input
                                name="name"
                                onChange={
                                    onChangeHandler
                                }
                                value={data.name}
                                type="text"
                                placeholder="Your name"
                                required
                            />
                        )}

                    <input
                        name="email"
                        onChange={
                            onChangeHandler
                        }
                        value={data.email}
                        type="email"
                        placeholder="Your email"
                        required
                    />

                    <input
                        name="password"
                        onChange={
                            onChangeHandler
                        }
                        value={data.password}
                        type="password"
                        placeholder="Password"
                        required
                    />

                </div>

                <button type="submit">
                    {currState === "Sign Up"
                        ? "Create account"
                        : "Login"}
                </button>

                <div className="login-popup-condition">

                    <input
                        type="checkbox"
                        required
                    />

                    <p>
                        By continuing, I agree
                        to the terms of use &
                        privacy policy.
                    </p>

                </div>

                {currState === "Login" ? (

                    <p>
                        Create a new account?

                        <span
                            onClick={() =>
                                setCurrState("Sign Up")
                            }
                        >
                            Click here
                        </span>
                    </p>

                ) : (

                    <p>
                        Already have an account?

                        <span
                            onClick={() =>
                                setCurrState("Login")
                            }
                        >
                            Login here
                        </span>
                    </p>

                )}

            </form>

        </div>
    );
};

export default LoginPopup;