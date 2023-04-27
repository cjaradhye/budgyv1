import React, {useState} from "react";
import Header from "./Header";
import { useLocation} from "react-router";
import { Link } from "react-router-dom";

function Savings(){
    const location = useLocation();
    const name = location.state.name;
    const month_index = location.state.month_index;
    const [index, setIndex] = useState({sections: [], credit_history: []} )

    async function fetchData() {
        let response = await fetch("http://localhost:8080/127.0.0.1:3100/");
        if (response.status === 200) {
            let data = await response.text();
            let jsonData = JSON.parse(data);
            for (let i = 0; i < jsonData.length ; i++ ){
                if(jsonData[i].name===name){
                    const index = jsonData[i].data[month_index].index;
                    setIndex(index);
                    break;
                }
            }
        }
    }
    function handleSection(section){
        return(
            <tr>
                <td>{section.name}</td>
                <td>{section.amount}</td>
            </tr>
        )
    }
    function handleCredits(credit){
        return(
            <tr>
                <td>{credit.sender}</td>
                <td>{credit.to}</td>
                <td>{credit.amount}</td>
            </tr>
        )
    }
    fetchData();


    return (
        <div>
            <Header
                state={{...location.state}}
            />
            <div className="main-section">
                <h1>Savings</h1>
                <h5>Money in account is {index.total}</h5>

                <table>
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Amount</th>
                        </tr>
                        {index.sections.map(handleSection)}
                    </tbody>
                </table>
                <Link to="/addsection" state={{...location.state}}>
                    <button className="btn outline lg primary">Add Section</button>
                </Link>

                <h1>Credit History</h1>
                <table>
                    <tbody>
                        <tr>
                            <th>From</th>
                            <th>To</th>
                            <th>Amount</th>
                        </tr>
                        {index.credit_history.map(handleCredits)}
                    </tbody>
                </table>
            </div>
            
        </div>
    )
}

export default Savings;