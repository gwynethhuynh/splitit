import React, { Component } from "react";
import { render } from "react-dom";
import ReceiptItemsPage from "./ReceiptItemsPage";
import { BrowserRouter, Routes, Route, Link, Redirect } from "react-router-dom";

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        console.log('Homepage')
        return (
        <BrowserRouter>
            <Routes>
                <Route exact path='/' element={<p>DThis is the homePage</p>}></Route>;
                <Route path='/hello' element={<ReceiptItemsPage/>}></Route>
            </Routes>
        </BrowserRouter> )
    }

}

