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

    updateReceiptDetails = (id, data) => {
        axios
            .put('/api/get-receipt' + '?receipt=' + this.id, {
                tax: data.tax,
                total: data.total
            })
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(err);
            });
    }

    updateItemDetails = (data) => {

    }

    onSubmit = (data) => {

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
                            {this.state.items.map(({ name, price }) => (
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
                                                // onChange ={() => setTitle(e.target.value)}
                                                />
                                                <TextField 
                                                    required
                                                    label="Dish Price" 
                                                    variant="outlined" 
                                                    defaultValue={price} 
                                                    type="number"
                                                    /* TODO: Restrict input to 2 decimal places */
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
                        </Grid>
                        <Grid item xs={12} align="center">
                            <Typography>
                            Total: {this.state.total}
                            </Typography>
                        </Grid>
                        <Button
                            type="submit"
                            color="primary"
                            // onClick={() => {
                            //     this.setState({})
                            // }}
                        >
                           Submit 
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