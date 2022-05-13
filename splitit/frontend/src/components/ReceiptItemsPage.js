import React, { Component } from "react";
import { render } from "react-dom";
import { useParams } from 'react-router-dom';

function withParams(Component) {
    return props => <Component {...props} params={useParams()} />;
}  

class ReceiptItemsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            receipt: false,
        }
        this.receiptId = this.props.params.receiptId;
    }

    render() {
        console.log("Reached ReceiptItemsPage");
        return ( 
        <div>
            <h3>Hello World!</h3>
            <h3>{this.receiptId}</h3>
            <p>{this.state.receipt}</p>
        </div>

        )
    }

}

export default withParams(ReceiptItemsPage);