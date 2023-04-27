import React from "react";
import * as ReactDOMClient from 'react-dom/client';
import App from "./components/App";
import Expenses from "./components/Expenses";
import AddExpense from "./components/AddExpense";
import LoginPage from "./components/LoginPage";
import SigninPage from "./components/SigninPage";
import AddMoney from "./components/AddMoney";
import AddSection from "./components/AddSection";
import OweLend from "./components/OweLend";
import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Link,
  } from "react-router-dom";
import Savings from "./components/Savings";

const router = createBrowserRouter([
{
    path: "/home",
    element: (<App />)
},{
    path: "/expenses",
    element: (<Expenses />)
},{
    path: "/savings",
    element: (<Savings />)
}, {
    path: "/addexpense",
    element: (<AddExpense/>)
},{
    path: "/",
    element: (<LoginPage />)
},{
    path: "/sign-in",
    element: (<SigninPage />)
},{
    path: "/addmoney",
    element: (<AddMoney />)
},{
    path: "/addsection",
    element: (<AddSection />)
},{
    path: "/owelend",
    element: (<OweLend />)
}
]);

const container = document.getElementById("root");
const root = ReactDOMClient.createRoot(container);

root.render(<RouterProvider router={router} />)

