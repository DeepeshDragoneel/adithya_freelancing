import React, { useState } from "react";
import axios from "axios";
const WelcomePage = () => {
    const [name, setName] = useState(
        localStorage.getItem("user") !== null
            ? localStorage.getItem("user")
            : ""
    );
    const [email, setEmail] = useState(
        localStorage.getItem("email") !== null
            ? localStorage.getItem("email")
            : ""
    );
    const [error, setError] = useState("");

    const submitUser = async () => {
        console.log("submitUser");
        try {
            const result = await axios({
                method: "post",
                url: "http://localhost:8000/userSigin",
                data: {
                    name: name,
                    email: email,
                },
            });
            console.log(result);
            if (
                result.data === "User saved" ||
                result.data === "User already exist"
            ) {
                localStorage.setItem("user", name);
                localStorage.setItem("email", email);
                window.location.href = "/";
            } else {
                setError(result.data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <h1>Welcome to our ToDo app</h1>
            <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => {
                    setName(e.target.value);
                }}
            />
            <input
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                }}
            />
            <button
                onClick={() => {
                    submitUser();
                }}
            >
                Submit
            </button>
            {error !== "" ? <p>{error}</p> : null}
        </div>
    );
};

export default WelcomePage;
