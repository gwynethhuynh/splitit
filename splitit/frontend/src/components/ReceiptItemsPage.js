import React, { Component } from "react";
import { render } from "react-dom";

export default class ReceiptItemsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        console.log("Reached ReceiptItemsPage");
        return <p>Items</p>;
    }

}
