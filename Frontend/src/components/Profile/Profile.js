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
    box:{
        width: '90vw',
        heigth: '60vh',
        margin: 'auto',
        marginTop: '20vh',
        backgroundColor:'black',
        color: 'white',
        borderRadius: '6px',
    }

});

class Profile extends Component{
    constructor(props){
        super(props);
        this.state = {
            username : "",
            email : "",
            phone : "",
            image : "default",
            file : ""
        }
        //Bind the handlers to this class
        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.phoneChangeHandler = this.phoneChangeHandler.bind(this);
        this.imageChangeHandler = this.imageChangeHandler.bind(this);
        this.submitImage = this.submitImage.bind(this);
        this.submitProfile = this.submitProfile.bind(this);
    }
    componentDidMount(){
        axios.get(`${backend}/profile/${localStorage.getItem("email")}`)
            .then((response) => {
            //update the state with the response data
            console.log(response.data);
            this.setState({
                username : response.data.username,
                email : response.data.email,
                phone : response.data.phone,
                image : response.data.image,
            });
        });
    }
    //handlers
    usernameChangeHandler = (e) => {
        this.setState({
            username : e.target.value
        })
    }
    emailChangeHandler = (e) => {
        this.setState({
            email : e.target.value
        })
    }
    phoneChangeHandler = (e) => {
        this.setState({
            phone : e.target.value
        })
    }
    imageChangeHandler = (e) => {
        this.setState({
            file: e.target.files[0]
        });
    }
    submitImage = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", this.state.file);
        console.log(this.state.file);
        const uploadConfig = {
            headers: {
                "content-type": "multipart/form-data"
            }
        };
        axios.post(`${backend}/images/${this.state.email}`, formData, uploadConfig)
        .then(response => {
            alert("Image uploaded successfully!");
            this.setState({
                image: response.data
            });
        })
        .catch(err => {
            console.log(err);
            console.log("Fail to upload image");
        });
    }
    //validate user email input
    validateEmail = () => {
        const inputs = this.state.email;
        const error = document.getElementById('errorMsg');
        var emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        let isValid = true;
        if (!inputs){
            error.textContent = "Your email can not be empty";
            isValid = false;
        } else if (!inputs.match(emailFormat)){
            error.textContent = "Your email format is invalid, please use user@google format";
            isValid = false;
        }
        return isValid;
    }
    submitProfile = (e) => {
        e.preventDefault();
        if (this.validateEmail()){
            let originEmail = localStorage.getItem("email");
            const data = {
                origin_email: originEmail,
                username : this.state.username,
                email : this.state.email,
                phone : this.state.phone
            }
            console.log(data);
            const error = document.getElementById('errorMsg');
            axios.post(`${backend}/profile`, data)
                .then(response => {
                    console.log("Status Code : ", response.status);
                    if(response.status === 200){
                        console.log("successfully updated!");
                        alert("successfully updated!");
                        localStorage.setItem("email", this.state.email);
                        error.textContent = "successfully updated!";
                    }
                    else if(response.status === 404){
                        error.textContent = "email exists! cannot change to this email";
                    }
                })
                .catch(err => {
                    console.log(err.response);
                    error.textContent = "email exists! cannot change to this email";
                });
        }
    }

    render(){
        const { classes } = this.props; 
        //if not logged in go to login page
        let redirectVar = null;
        var imageSrc = `${backend}/images/${this.state.image}`;
        if(!localStorage.getItem('email')){
            redirectVar = <Redirect to= "/"/>
        }
        return(
            <div>
                {redirectVar}
                <UserNavbar/>
                <div className={classes.box}>
                <div className={classes.root}>
                    <Typography variant="h6" className={classes.title}>
                        My Profile
                    </Typography>
                    <Form>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <Card style={{ width: '20rem', marginBottom: '10px' }}>
                                    <Card.Img variant="top" src={imageSrc} />
                                </Card>
                                <div class="custom-file" style={{width: "90%"}}>
                                    <input type="file" class="custom-file-input" name="image" accept="image/*" onChange={this.imageChangeHandler}/>
                                </div><br/>
                                <Button style={{backgroundColor: 'white', color: 'black'}} type="submit" variant="primary" onClick={this.submitImage}>Upload</Button>
                                <br/><br/>
                            </Grid>
                            <Grid item xs={6}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Form.Group controlId="formUsername">
                                        <Form.Label>Your name: {this.state.username}</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="username"
                                            value={this.state.username}
                                            onChange={this.usernameChangeHandler}
                                            placeholder="Enter new username" />
                                    </Form.Group>
                                </Grid>
                                <Grid item xs={12}>
                                    <Form.Group controlId="formEmail">
                                        <Form.Label>Your email address: {this.state.email}</Form.Label>
                                        <Form.Control 
                                            type="email" 
                                            name="email"
                                            value={this.state.email}
                                            onChange={this.emailChangeHandler}
                                            placeholder="Enter new email address" />
                                    </Form.Group>
                                </Grid>
                                <Grid item xs={12}>
                                    <Form.Group controlId="formPhone">
                                        <Form.Label>Your phone number: {this.state.phone}</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="phone"
                                            value={this.state.phone}
                                            onChange={this.phoneChangeHandler}
                                            placeholder="Enter new phone number" />
                                    </Form.Group>
                                </Grid>
                            </Grid>
                            <Button style={{backgroundColor: 'white', color: 'black'}} variant="primary" type="submit" onClick = {this.submitProfile}>
                                Save
                            </Button>
                            </Grid>
                        </Grid>
                    </Form>
                    <div className="error" id="errorMsg" />                 
                </div>
                </div>
            </div>
        )
    }
}

export default withStyles(useStyles)(Profile);