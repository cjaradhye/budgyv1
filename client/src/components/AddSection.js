import React from "react";
import { useLocation, useNavigate } from "react-router";
import Header from "./Header";


function AddSection(){
    const location = useLocation();
    const navigate = useNavigate();
    console.log(location.state);
    const month_index = location.state.month_index;
    const name = location.state.name;
    console.log("This is the index" + month_index)


    function handleSubmit(e) {
        e.preventDefault();
        const sectionName = e.target.name.value;
        const amount = e.target.amount.value;

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "name": name,
                "monthIndex": month_index,
                "sectionName": sectionName,
                "amount": amount
            })
        };
        navigate("/savings", {state:{...location.state}});
        try{
            fetch('http://localhost:8080/127.0.0.1:3100/addsection', options).then((res)=>{
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
            <h1>Add a new Section</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name='name' placeholder="Section Name"></input>
                <input type="number" name="amount" placeholder="Amount"></input>
                <button type="submit">Add Section</button>
            </form>
        </div>
    )
}

export default AddSection;