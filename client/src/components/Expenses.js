import React, {useState} from "react";
import Header from "./Header";
import Card from "./Card";
import { useLocation } from "react-router";

function Expenses() {
    const location = useLocation();
    const name = location.state.name;
    const month_index = location.state.month_index;
    const [expenses, setExpenses] = useState([]);
    

    async function fetchData(){
        let response = await fetch('http://localhost:8080/127.0.0.1:3100/');
        if (response.status === 200) {
            let data = await response.text();
            let jsonData = JSON.parse(data);
            for (let i = 0; i < jsonData.length ; i++ ){
                if(jsonData[i].name===name){
                    const expenses = jsonData[i].data[month_index].expenses;
                    setExpenses(expenses);
                    break;
                }
            }
        }
    }

    function handleExpense(expense){
        return(
            <tr>
                <td>{expense.subject}</td>
                <td>{expense.amount}</td>
            </tr>
        )
    }

    fetchData();
    return (
        <div>
            <Header
                state = {location.state}
            />
            <div className = "express main-section">
                
            
                <h1>Expenses</h1>
                <table>
                    <tbody>
                        <tr>
                            <th>Subject</th>
                            <th>Amount</th>
                        </tr>
                        {expenses.map(handleExpense)}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default Expenses;