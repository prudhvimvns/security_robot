import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import { Container, Col, Row, Form, Button, ButtonGroup, Card } from 'react-bootstrap';
import { Grid, Typography } from "@material-ui/core";
import {Redirect} from 'react-router';
import UserNavbar from '../Navbar/UserNavbar';
import backend from "../../backendConfig";

const useStyles = (theme) => ({
    root: {
        marginLeft: theme.spacing(25),
        marginRight: theme.spacing(25),
        marginTop: theme.spacing(5),
    },
    title: {
        flexGrow: 1,
        fontSize: 25,
    },

});

class Help extends Component{
    constructor(props){
        super(props);
        this.state = {
            message: ""
        }
        //Bind the handlers to this class
        this.messageChangeHandler = this.messageChangeHandler.bind(this);
        this.submitMessage = this.submitMessage.bind(this);
    }
    //handlers
    messageChangeHandler = (e) => {
        this.setState({
            message : e.target.value
        })
    }
    submitMessage = (e) => {
        e.preventDefault();
        const data = {
            email : localStorage.getItem("email"),
            message : this.state.message
        }
        const error = document.getElementById('errorMsg');
        axios.post(`${backend}/message`, data)
            .then(response => {
                console.log("Status Code : ", response.status);
                if(response.status === 200){
                    error.textContent = "successfully send the message!";
                }
            })
            .catch(err => {
                console.log(err.response);
            });
    }

    render(){
        const { classes } = this.props; 
        let redirectVar = null;
        if(!localStorage.getItem('email')){
            redirectVar = <Redirect to= "/"/>
        }
        return(
            <div>
                {redirectVar}
                <UserNavbar/>
                <div className={classes.root}>
                    <Typography variant="h6" className={classes.title}>
                        Technical Help
                    </Typography>
                    <Form>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Form.Group controlId="formHelp">
                                    <Form.Control 
                                        type="text" 
                                        name="help"
                                        value={this.state.message}
                                        onChange={this.messageChangeHandler}
                                        placeholder="Enter your techinical issue" />
                                </Form.Group>
                                <Button variant="primary" type="submit" onClick = {this.submitMessage}>
                                    Send
                                </Button>
                            </Grid>
                        </Grid>
                    </Form>
                    <div className="error" id="errorMsg" />                 
                </div>
            </div>
        )
    }
}

export default withStyles(useStyles)(Help);