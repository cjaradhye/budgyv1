import React from "react";
import {Link, useNavigate} from 'react-router-dom'

function LoginPage(){
    let loggedIn = false;

    const navigate = useNavigate();

    function checkMonth(data, name){
        const date = new Date();
        const str_date = date.getMonth() + " " + date.getFullYear();
        let found = false;
        for (let i = 0; i < data.length ; i++){
            if (data[i].month === str_date){
                found = true;
                return i;
            }
        }
        if (found === false){
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "name": name,
                    "date": str_date
                })
            };

            try{
                fetch('http://localhost:8080/127.0.0.1:3100/addmonth', options).then((res)=>{
                    console.log(res);
                    if (res.status === 200) {
                        console.log(res.status);
                        console.log("Month added successfully");
                    } else {
                        console.log("Some error occured");
                    }
                })
            } catch (err) {
                console.log(err);
            }

            return (data.length);
            
        }
    }

    function checkUser(e){
        e.preventDefault();
        console.log("SUbmitted");
        const user = e.target.username.value;
        const password = e.target.password.value;
        async function fetchText() {
            let response = await fetch('http://localhost:8080/127.0.0.1:3100/');
            console.log(response.status); // 200
            console.log(response.statusText); // OK
            if (response.status === 200) {
                let data = await response.text();
                let jsonData = JSON.parse(data);
                
                for (let i = 0; i < jsonData.length ; i++ ){
                    if(jsonData[i].name===user){
                        if(jsonData[i].password===password){
                            loggedIn = true;
                            console.log("Successfully Logged in");
                            const curr_month_index = checkMonth(jsonData[i].data,user);
                            console.log(curr_month_index);
                            navigate("/home", {state:{name: user, month_index: curr_month_index}});
                        }else{
                            alert("Wrong password, try again");
                        }
                    }
                }
                if (loggedIn===false){
                    console.log("User does not exist. Redirecting to Sign up Page.");
                    navigate("/");
                }
            }
        }
        fetchText();
    }

    return (
        <form onSubmit={checkUser}>
            <h1>Login</h1>
            <input type="text" placeholder="Nickname" name="username"></input>
            <input type="password" placeholder="Password" name="password"></input>
            <button type="submit">Submit</button>
            <Link to="/sign-in">
                <button>Sign Up</button>
            </Link>
        </form>
    )
}

export default LoginPage;