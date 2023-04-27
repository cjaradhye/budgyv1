import React from "react";
import Header from "./Header";
import {Link, useLocation} from "react-router-dom";

function App() {
    const location = useLocation();
    const userName = location.state.name;

    return (
    <div>
        <Header state={location.state}/>
        <div className="main-section">
            <h1>Hello, {userName}</h1>
            <Link to="/addexpense" state={location.state}>
                <button className="btn btn-outline-info addexpense">Add Expense</button>
            </Link>
            <Link to="/addmoney" state={location.state}>
                <button className="btn btn-outline-info addexpense">Add Money</button>
            </Link>
        </div>
    </div>)
}

export default App;