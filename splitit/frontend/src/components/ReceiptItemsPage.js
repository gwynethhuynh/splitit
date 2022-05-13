import React, { Component } from "react";
import { render } from "react-dom";
import { useParams } from 'react-router-dom';
import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

function withParams(Component) {
    return props => <Component {...props} params={useParams()} />;
}  

class ReceiptItemsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            tax: 0,
            total: 0,

        }
        this.receiptId = this.props.params.receiptId;
        this.getRoomDetails();
    }

    getRoomDetails() {
        axios
            .get('/api/get-receipt' + '?receipt=' + this.receiptId)
            .then((response) => {
                this.setState({
                    items: response.data.items,
                    tax: response.data.tax,
                    total: response.data.total,
                });
                console.log(response);
            });

    }

    

    render() {
        console.log("Reached ReceiptItemsPage");
        console.log(this.state)
        return ( 
        <div>
            <h3>Receipt {this.receiptId}</h3>
            <div>
                {this.state.items.map(({ name, price }) => (
                    <p key={name}>Dish {name} costs {price}.</p>
                ))}
            </div>
            <p>Tax: {this.state.tax}</p>
            <p>Total: {this.state.total}</p>
        </div>

        )
    }

}

export default withParams(ReceiptItemsPage);