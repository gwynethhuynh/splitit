import React, { Component } from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";
import Grid from "@material-ui/core/Grid";



export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
        <Grid container>
            <Grid item xs={12}>
                <HomePage/>
            </Grid>
            
        </Grid>
            
        );
    }

}

const appDiv = document.getElementById("app");
render(<App/>, appDiv);