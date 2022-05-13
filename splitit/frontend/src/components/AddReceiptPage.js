import React, { Component } from "react";
import { render } from "react-dom";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl  from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

export default class AddReceiptPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null
        };
        this.onFileChange = this.onFileChange.bind(this);
        this.onFileUpload = this.onFileUpload.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
    };

    // On file select (from the pop up)
    onFileChange = event => {
        this.setState({ selectedFile: event.target.files[0] });
    };

    // handleFileUpload = () => {
    //     const requestOptions = {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json'},
    //         body: JSON.stringify({
    //             tax: 1.00,
    //             total: 2.00
    //         }),
    //     };
    //     fetch('/api/create/', requestOptions).then((response) => response.json()).then((data) => console.log(data));
    // };

    onFileUpload = () => {
        const formData = new FormData();
        formData.append(
          "myFile",
          this.state.selectedFile,
          this.state.selectedFile.name
        );
         console.log(this.state.selectedFile);
        
         // Request made to the backend api
         // Send formData object
        //  axios.post("api/uploadfile", formData);
        console.log(formData);
        axios
          .post("/api/create/", formData)
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
        // axios
        //   .get("/api/receipts/")
        //   .then((res) => console.log(res))
        //   .catch((err) => console.log(err));
      };

        fileData = () => {
        
          if (this.state.selectedFile) {
             
            return (
                <Grid>
                <Grid item xs={12} align="center">
                    <Typography component="h8" variant='h8'>
                        File Details:
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography component="h8" variant='h8'>
                        File Name: {this.state.selectedFile.name}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography component="h8" variant='h8'>
                        File Type: {this.state.selectedFile.type}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography component="h8" variant='h8'>
                       Last Modified: {" "}
                        {this.state.selectedFile.lastModifiedDate.toDateString()}
                    </Typography>
                </Grid>
              </Grid>
              );
          } else {
            return (
                <Grid item xs={12} align="center">
                    <Typography component="h8" variant='h4'>
                    Choose before Pressing the Upload button
                    </Typography>
                </Grid>
            );
          }
        };
        
        render() {
            console.log("Reached AddReceiptPage");
            return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant='h4'>
                        Splitit
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography component="h8" variant='h8'>
                        Add a Receipt Image
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" component="label">
                        <input type="file" onChange={this.onFileChange} />
                    </Button>
                    <Button onClick={this.onFileUpload}>
                    Upload!
                    </Button>
                </Grid>
                {this.fileData()}
            </Grid>
            );
        }

}