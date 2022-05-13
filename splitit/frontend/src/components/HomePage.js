import React, { Component } from "react";
import { render } from "react-dom";
import ReceiptItemsPage from "./ReceiptItemsPage";
import { BrowserRouter, Routes, Route, Link, Redirect } from "react-router-dom";
import AddReceiptPage from "./AddReceiptPage";

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
                <Route exact path='/' element={<p>Thi s is the homePage</p>}></Route>;
                <Route path='/hello' element={<ReceiptItemsPage/>}></Route>
                <Route path='/add' element={<AddReceiptPage/>}></Route>
            </Routes>
        </BrowserRouter> )
    }

}

