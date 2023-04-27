import { useState } from "react";
import React from "react";
import Header from "./Header";
import { useLocation, useNavigate } from "react-router";

function OweLend(){
    const location = useLocation();
    const navigate = useNavigate();
    const name = location.state.name;
    const month_index = location.state.month_index;
    const [index, setIndex] = useState({owe: [], lend: []});
    const [hidden, setHidden] = useState(false);

    async function fetchData(){
        let response = await fetch('http://localhost:8080/127.0.0.1:3100/');
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
    function payOff(e){
        console.log(e.target.value);
    }
    function handleClick(){
        setHidden((prev)=>{
            return (!prev);
        })
    }
    function handleSubmit(e){
        let lender = e.target.lender.value;
        const amount = e.target.amount.value;
        const type = e.target.type.value;
        const subject = e.target.subject.value;
        console.log("This is the name " + lender);
        if(lender===''){
            lender = e.target.newLender.value;
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "name": name,
                "monthIndex": month_index,
                "lender": lender,
                "amount": amount,
                "type": type,
                "subject": subject
            })
        };
        navigate("/home", {state:{...location.state}});
        try{
            fetch('http://localhost:8080/127.0.0.1:3100/addowelend', options).then((res)=>{
                console.log(res);
                // let resJson = await res.json();
                if (res.status === 200) {
                    console.log(res.status);
                    console.log("Expense added successfully");
                } else {
                    console.log("Some error occured");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }
    function handleOL(single){
        return(
        <tr>
            <td>{single.name}</td>
            <td>{single.amount}</td>
            <td><button onClick={payOff} value={single.name}>Pay off</button></td>
        </tr>
        )
    }
    function handleName(single){
        return(
        <div>
        <input type="radio" id="html" name="lender" value={single.name}></input>
        <label for="html">{single.name}</label><br />
        </div>)
    }

    return(
        <div>
            <Header state = {location.state}/>
            <div className="main-section">
                
                <h1>Owe</h1>
                <table>
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Button</th>
                        </tr>
                        {index.owe.map(handleOL)}
                    </tbody>
                </table>
                <h1>Lend</h1>
                <table>
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Button</th>
                        </tr>
                        {index.lend.map(handleOL)}
                    </tbody>
                </table>
                <button onClick={handleClick}>+</button>
                <form onSubmit={handleSubmit} style={hidden? {display:"block"} : {display:"none"}}>
                    <input type="radio" id="html" name="type" value="0"></input>
                    <label for="html">Owe</label><br />
                    <input type="radio" id="html" name="type" value="1"></input>
                    <label for="html">Lend</label><br />
                    {index.owe.map(handleName)}
                    {index.lend.map(handleName)}
                    <input type="text" placeholder="New" name="newLender"></input>

                    <input type="number" placeholder="Amount" name="amount"></input>
                    <input type="text" placeholder="Subject" name="subject"></input>
                    <button type="submit">Add</button>
                </form>
                
            </div>
        </div>
    )
}

export default OweLend;
