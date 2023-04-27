import React,{useState} from "react";
import { Link, useNavigate } from "react-router-dom";

function Header(props) {
    const [active, setActive] = useState([true, true, true, true])
    // function click(e) {
    //     e.preventDefault()
    //     const index = parseInt(e.target.name);
    //     const link = e.target.href;
    //     const new_active = [false,false,false];
    //     new_active[index] = true;
    //     setActive(new_active);
    //     console.log(active);
    // }       

    return (
        <nav className="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
        <div className="container-fluid">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <Link to="/" style={{ textDecoration: 'none' }}>
                <p className="navbar-brand">collegebudgy</p>
            </Link>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                    <Link to="/home" state={props.state} style={{ textDecoration: 'none' }}>
                    <p className={active[0] ? 'nav-link active': 'nav-link'} name="0" aria-current="page">Dashboard</p>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/savings" state={props.state} style={{ textDecoration: 'none' }}>
                    <p className={active[1] ? 'nav-link active': 'nav-link'} name="1">Savings</p>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/expenses" state={props.state} style={{ textDecoration: 'none' }}>
                    <p className={active[2] ? 'nav-link active': 'nav-link'} name="2">Expenses</p>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/owelend" state={props.state} style={{ textDecoration: 'none' }}>
                    <p className={active[3] ? 'nav-link active': 'nav-link'} name="2">Owe/Lend</p>
                    </Link>
                </li>
            </ul>
            <form className="d-flex" role="search">
                <input className="form-control me-2" type="search" placeholder="Command.." aria-label="Search" />
                <button className="btn btn-outline-light" type="submit">Go</button>
            </form>
            </div>
        </div>
        </nav>
    )
}

export default Header;