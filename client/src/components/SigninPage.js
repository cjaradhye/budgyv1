import React from "react";
import { useNavigate } from "react-router-dom";

function SigninPage() {
    const navigate = useNavigate();

    async function handleSubmit(e){
        e.preventDefault();
        const nick = e.target.username.value;
        const password = e.target.password.value;
        const account = e.target.account.value;
        navigate("/");
        let res = await fetch("http://localhost:8080/127.0.0.1:3100/",{
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                name: nick,
                password: password,
                account: account
            })
        });
        

    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Sign Up</h1>
            <input type="text" name="username" placeholder="NickName"></input>`
            <input type="password" name="password" placeholder="Password"></input>
            <input type="number" placeholder="Money in account" name="account"></input>
            <button type="submit">Create an Account</button>
        </form>
    )
}

export default SigninPage;