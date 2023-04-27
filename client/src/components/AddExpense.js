import { useState } from "react";
import React from "react";
import Header from "./Header";
import {Link, useLocation, useNavigate} from "react-router-dom";

function AddExpense(){
    let num_of_sections = 1;
    const location = useLocation();
    const navigate = useNavigate();
    const name = location.state.name;
    const month_index = location.state.month_index;
    const [index, setIndex] = useState({sections: [], categories: [], lend:[]});
    const [input, setInput] = useState([{key:1, section:'', amount:''}]);
    const [splitNames, setNames] = useState([{key:1, name:'', amount: ''}]);
    const [showform, setShowForm] = useState([false, false]);
    const [totalAmt, setTotal] = useState({splits:[0,0], sections:[0]});

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
    async function sendData(e){
        e.preventDefault();
        const newSub = e.target.subject.value;
        const category = e.target.category.value;
        const newAmt = 0;
        const section = '';
        input.map((inp)=>{
            console.log(inp);
            const section_name = "section" + inp.key;
            const amount_name = section_name+"-amount";
            inp.section = e.target[section_name].value;
            inp.amount = e.target[amount_name].value;
        })
        splitNames.map((single)=>{
            const section_name = "splitName" + single.key;
            const amount_name = section_name+"-amount";
            single.name = e.target[section_name].value;
            single.amount = e.target[amount_name].value;
        })
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "name": name,
                "monthIndex": month_index,
                "subject": newSub,
                "input": {...input},
                "category": category,
                "splitNames":{...splitNames}
            })
        };
        navigate("/expenses", {state:{...location.state}});
        try{
            fetch('http://localhost:8080/127.0.0.1:3100/addexpense', options).then((res)=>{
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
    function handleAddCategory(e){
        const categoryName = e.target.categoryName.value;

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "name": name,
                "monthIndex": month_index,
                "categoryName": categoryName
            })
        };
        console.log(location.state);
        navigate("/home", {state:{...location.state}});
        try{
            fetch('http://localhost:8080/127.0.0.1:3100/addcategory', options).then((res)=>{
                if (res.status === 200) {
                    console.log("Category Added.");
                } else {
                    console.log("Some error occured");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }
    function handleSection(section, name_of_section){
        return(
            <div>
                <input type="radio" id="html" name={name_of_section} value={section.name}></input>
                <label htmlFor="html">{section.name} ( {section.amount} left. )</label><br />
            </div>
        )
    }
    function handleAddClickSection(e){
        e.preventDefault();
        setInput((prev)=>{
            console.log(prev);
            const new_key = prev.slice(-1)[0].key + 1;
            prev.push({key:new_key, section:'', amount:''});
            return (prev)
        })
    }
    function handleInput(each_input){
        const name_of_section = "section" + each_input.key;
        return(
            <div>
                {index.sections.map((section)=>{return (handleSection(section, name_of_section))})}
                <input type='number' name={name_of_section + "-amount"} placeholder="Amount"></input>
            </div>
        )
    }
    function handleCategory(category){
        return(
            <div>
                <input type="radio" id="html" name="category" value={category}></input>
                <label htmlFor="html">{category}</label><br />
            </div>
        )
    }
    function handleFormShow(e){
        e.preventDefault();
        const val = parseInt(e.target.value);
        setShowForm((prev)=>{
            prev[val] = !prev[val];
            return prev;
        })

    }
    function handleName(single, name){
        return(
            <option value={single.name} />
        )
    }
    function handleAddClickSplit(e){
        e.preventDefault();
        setNames((prev)=>{
            console.log(prev);
            const new_key = prev.slice(-1)[0].key + 1;
            prev.push({key:new_key, name:'', amount:''});
            return (prev)
        })
    }
    function handleSplitNames(each_input){
        const name_of_section = "splitName" + each_input.key;
        return(
            <div>
                <input name={name_of_section} className="form-control" list="datalistOptions" id="exampleDataList" placeholder="Type to search..." />
                <datalist id="datalistOptions">
                    {index.lend.map((single)=>{return (handleName(single, name_of_section))})}
                </datalist>
                <input type='number' onChange={handleChangeSplit} name={name_of_section+"-amount"} placeholder="Amount"></input>
            </div>
        )
    }
    function handleChangeSplit(e){
       const key = parseInt(e.target.name[9])-1;   //DOES NOT WORK FOR DOUBLE DIGIT SPLIT NAME KEYS
        setTotal((prev)=>{
            const total = parseInt(e.target.value) + parseInt(prev.splits[key]);
            prev.splits[key] = total;
            return (prev);
        })
    }

    return (
    <div>
        <Header />
        <h1>Add Expense</h1>
    
        <div className="minor-section">
            <form onSubmit={sendData}>
                <button onClick={handleFormShow} value='0'>Split Bill</button><br />
                <div className="minor-section" style={showform[0]? {display:"block"}:{display:"none"}}>
                    {splitNames.map(handleSplitNames)}
                    <button type="button" onClick={handleAddClickSplit}>Add Name</button>
                </div>
                <input type='text' name="subject" placeholder="Name of Expense"></input>
                <h4>Section</h4>
                {input.map(handleInput)}
                <button type="button" onClick={handleAddClickSection}>Add Section</button>
                <h4>Categories</h4>
                {index.categories.map(handleCategory)}
                <button type="submit">Add</button>
                <br></br>
                <br></br>
                <input class="form-control" type="text" value={totalAmt.splits[0]} aria-label="Disabled input example" disabled />

            </form>
        </div>

        <div className="minor-section">
            <h3> Add Category </h3>
            <form onSubmit={handleAddCategory}>
                <input type="text" name="categoryName" placeholder="Category Name"></input>
                <button className="btn" type="submit">Add Category</button>
            </form>
        </div>
    </div>
    )
}

export default AddExpense;
