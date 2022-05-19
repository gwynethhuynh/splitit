import React, { Component } from "react";
import { render } from "react-dom";
import { useParams } from 'react-router-dom';
import axios from "axios";
import currency from "currency.js";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";
import {Grid, TextField, Typography, Button } from "@material-ui/core";
import { Link } from "react-router-dom";


function withParams(Component) {
    return props => <Component {...props} params={useParams()} />;
}  

class ReceiptItemsPage extends Component {
    // const [title, setTitle] = useState('');
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            tax: 0,
            total: 0,
            payers: [],
            payerAmounts: {},

        }
        this.receiptId = this.props.params.receiptId;
        this.getReceiptDetails();
        this.calculatePayerAmounts = this.calculatePayerAmounts.bind(this);
    }

    getReceiptDetails() {
        axios
            .get('/api/get-receipt' + '?receipt=' + this.receiptId)
            .then((response) => {
                let payers = response.data.items.map(() => "Kai, Jane");
                let payerAmounts = this.calculatePayerAmounts(payers, response.data.items, response.data.tax);
                this.setState({
                    items: response.data.items,
                    tax: response.data.tax,
                    total: response.data.total,
                    payers: payers,
                    payerAmounts: payerAmounts,
                });
                console.log(payers);
                console.log(response);
            });

    }

    updateReceipt = (e) => {
        e.preventDefault();
        console.log("Hello World!");
        console.log(this.state);
        let data = {
            items: this.state.items,
            tax: this.state.tax,
            total: this.state.total,
        }
        axios
            .put('/api/put-receipt/' + '?receipt=' + this.receiptId, data)
            .then(response => {
                console.log(response);
            })
            .catch(err => {
                console.log(err);
            });
    }

    updateDishName = (index, name) => {
        let newItems = JSON.parse(JSON.stringify(this.state.items));
        newItems[index].name = name;
        this.setState({items: newItems});
    }

    updateDishPrice = (index, price) => {
        let newItems = JSON.parse(JSON.stringify(this.state.items));
        newItems[index].price = price;
        let payerAmounts = this.calculatePayerAmounts(this.state.payers, newItems, this.state.tax);
        this.updateTotal(payerAmounts);
        this.setState({items: newItems, payerAmounts: payerAmounts});
    }

    updatePayers = (index, payers) => {
        let newPayers = JSON.parse(JSON.stringify(this.state.payers));
        newPayers[index] = payers;
        let payerAmounts = this.calculatePayerAmounts(newPayers, this.state.items, this.state.tax);
        this.updateTotal(payerAmounts);
        this.setState({payers: newPayers, payerAmounts: payerAmounts});
    }

    updateTax = (tax) => {
        let payerAmounts = this.calculatePayerAmounts(this.state.payers, this.state.items, tax);
        this.updateTotal(payerAmounts);
        this.setState({tax: tax, payerAmounts: payerAmounts});
        
    }

    updateTotal = (payerAmounts) => {
        let total = currency(0);
        for (let [_, amountOwed] of Object.entries(payerAmounts)) {
            total = total.add(amountOwed);
            console.log(total);
        }
        this.setState({total: total.value})
    }

    calculatePayerAmounts = (payers, items, tax) => {
        let payerAmounts = {};
        for(let i in items) {
            let item = items[i];
            let payers_i = payers[i].split(/,[ ]*/);
            let priceDistributed = currency(item.price).distribute(payers_i.length);
            for(let j in payers_i) {
                let payer = payers_i[j];
                if (!(payer in payerAmounts)) {
                    payerAmounts[payer] = currency(0);
                }
                payerAmounts[payer] = payerAmounts[payer].add(priceDistributed[j]);
            }
        }
        let subtotal = currency(0);
        for (let item of items) {
            subtotal = subtotal.add(currency(item.price));
        }
        console.log("subtotal: ", subtotal.value)
        for (let [payer, amountOwed] of Object.entries(payerAmounts)) {
            console.log("~~~~~~~~~~", amountOwed.value / subtotal.value, amountOwed.value, subtotal.value );
            let taxDistributed = currency(tax).multiply(amountOwed.value / subtotal.value);
            /* TODO: consider uneven division/ remainder */
            console.log("--------->", taxDistributed.value);
            payerAmounts[payer] = payerAmounts[payer].add(taxDistributed.value);
            console.log(payer, amountOwed.value);
            console.log(payer, payerAmounts[payer].value);
        }
        return payerAmounts;
    }
    

    render() {
        console.log("Reached ReceiptItemsPage");
        console.log(this.state)
        return (
            <Grid container>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" color="textSecondary" component="h2" gutterBottom>
                        Receipt {this.receiptId}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <form>
                        <Grid item xs={12} align="center">
                        {this.state.items.map(({ name, price }, index) => (
                            <Grid item xs={12} align="center">
                                <Grid container>
                                    <Grid item xs={12} align="center">
                                        <Typography key={name} gutterBottom> Dish {name} costs {price} and will be paid by {this.state.payers[index]}.</Typography> 
                                    </Grid>
                                    <Grid item xs={12} align="center">
                                        <TextField 
                                            required
                                            label="Dish Name" 
                                            variant="outlined" 
                                            defaultValue={name}
                                            onChange ={(e) => this.updateDishName(index, e.target.value)}
                                        />
                                        <TextField 
                                            required
                                            label="Dish Price" 
                                            variant="outlined" 
                                            defaultValue={price} 
                                            type="number"
                                            /* TODO: Restrict input to 2 decimal places */
                                            onChange ={(e) => this.updateDishPrice(index, e.target.value)}
                                        />
                                        <TextField 
                                            required
                                            label="Payers"
                                            variant="outlined"
                                            defaultValue={this.state.payers[index]}
                                            onChange ={(e) => this.updatePayers(index, e.target.value)}
                                        />
                                    </Grid>   
                                </Grid>
                            </Grid>
                            ))}       
                        </Grid>
                        <Grid item xs={12} align="center">
                            <Typography>
                                Tax: {this.state.tax}
                            </Typography>
                            <TextField 
                                required
                                label="Tax" 
                                variant="outlined" 
                                value={this.state.tax}
                                onChange ={(e) => this.updateTax(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} align="center">
                            <Typography>
                            Total: {this.state.total}
                            </Typography>
                            <TextField 
                                required
                                label="Total" 
                                variant="outlined" 
                                value={this.state.total}
                                onChange ={(e) => this.setState({total: e.target.value})}
                            />
                        </Grid>
                        <Button
                            type="submit"
                            color="primary"
                            onClick={this.updateReceipt}
                        >
                           Update 
                        </Button>
                    </form>
                    <Grid item xs={12}>
                        {Object.keys(this.state.payerAmounts).map((key) => {
                            return <p>{ key + ": " + this.state.payerAmounts[key].value }</p>
                        })}
                    </Grid>
                </Grid>
            </Grid>
            // <div>
            //     {/* <Typography variant="h6" color="textSecondary" component="h2" gutterBottom> */}
            //     <h3>
            //     Receipt {this.receiptId}
            //     </h3>
            //     {/* <div>
            //         {this.state.items.map(({ name, price }) => (
            //             <p key={name}>Dish {name} costs {price}.</p>
            //         ))}
            //     </div>
            //     <p>Tax: {this.state.tax}</p>
            //     <p>Total: {this.state.total}</p>
            //     {/* <form noValidate autoComplete="off">
            //             <TextField></TextField>
            //     </form> */} 
        
            // </div>
        

        )
    }

}

export default withParams(ReceiptItemsPage);