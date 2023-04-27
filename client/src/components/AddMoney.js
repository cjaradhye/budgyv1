import { useState } from "react";
import React from "react";
import Header from "./Header";
import {Link, useLocation, useNavigate} from "react-router-dom";

function AddMoney(){

    const location = useLocation();
    const navigate = useNavigate();
    const name = location.state.name;
    const month_index = location.state.month_index;
    const [index, setIndex] = useState({sections: []});

    async function fetchData(){
        let response = await fetch('http://localhost:8080/127.0.0.1:3100/');
        console.log(response.status); // 200
        console.log(response.statusText); // OK
        if (response.status === 200) {
            let data = await response.text();
            let jsonData = JSON.parse(data);
            for (let i = 0; i < jsonData.length ; i++ ){
                if(jsonData[i].name===name){
                    const index = jsonData[i].data[month_index].index;
                    setIndex(index);
                }
            }
        }
    }
    fetchData();

    function handleSection(section){
        return(
            <div>
                <input type="radio" id="html" name="to" value={section.name}></input>
                <label for="html">{section.name} ( {section.amount} left. )</label><br />
            </div>
        )
    }

    async function sendData(e){
        e.preventDefault();
        const senderName = e.target.name.value;
        const to = e.target.to.value;
        const newAmt = e.target.amount.value;
        
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "name": name,
                "monthIndex": month_index,
                "senderName": senderName,
                "to": to,
                "amount": newAmt
            })
        };
        navigate("/expenses", {state:{...location.state}});
        try{
            fetch('http://localhost:8080/127.0.0.1:3100/addmoney', options).then((res)=>{
                console.log(res);
                // let resJson = await res.json();
                if (res.status === 200) {
                    console.log(res.status);
                    console.log("Money added successfully");
                } else {
                    console.log("Some error occured");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }
    return (
    <div>
        <Header />
        <h1>Add Money</h1>
        <form onSubmit={sendData}>
            <input type='text' name="name" placeholder="Name of Person"></input>
            <h4>To</h4>
            {index.sections.map(handleSection)}
            <input type='number' name="amount" placeholder="Amount"></input>
            <button type="submit">Add</button>
        </form>
    </div>)
}

export default AddMoney;