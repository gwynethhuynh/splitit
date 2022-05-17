import React, { Component } from "react";
import { render } from "react-dom";
import { useParams } from 'react-router-dom';
import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";
import {Grid, TextField, Typography, Button } from "@material-ui/core";


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

        }
        this.receiptId = this.props.params.receiptId;
        this.getReceiptDetails();
    }

    getReceiptDetails() {
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
        this.setState({items: newItems});
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
                                        <Typography key={name} gutterBottom> Dish {name} costs {price}.</Typography> 
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
                                onChange ={(e) => this.setState({tax: e.target.value})}
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