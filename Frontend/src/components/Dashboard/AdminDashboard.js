import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import {Redirect} from 'react-router';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Button, Paper } from '@material-ui/core';
import { Form } from 'react-bootstrap';
import Toolbar from '@material-ui/core/Toolbar';
import {Container, Row, Col } from 'react-bootstrap';
import { Accordion, AccordionDetails, AccordionSummary, Divider, List } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import NumberFormat from 'react-number-format';
import AdminNavbar from '../Navbar/AdminNavbar';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { userSignup } from '../../redux/actions/signupAction';
import {Pie} from "react-chartjs-2";
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Table from 'react-bootstrap/Table';


import backendConfig from "../../backendConfig";
import {
    withRouter
} from 'react-router-dom'

const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
        margin: theme.spacing(1),
        marginLeft: theme.spacing(25)
    },
    button: {
        margin: theme.spacing(1),
        marginRight: theme.spacing(20),
    },
    title: {
        flexGrow: 1,
        fontSize: 30,
        fontWeight: 'bold',
    },
    table: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    text: {
        flexGrow: 1,
        fontSize: 13,
    },
    message: {
        flexGrow: 1,
        fontSize: 10,
        fontWeight: 'bold',
    },
    paper2:{
        borderRadius: '30px',
        // margin: '30px 30px 30px 30px',
        // padding: '30px 20px 30px 20px',
        backgroundColor: 'black',
        color:'white',
    },
    dialogtext: {
        flexGrow: 1,
        fontSize: 13,
        fontWeight: 'bold',
    },
});

class AdminDashboard extends Component {
    constructor(props){
        super(props);
        this.state = {  
            open_create : false,
            open_billing : false,
            open_delete : false,
            userlist: [],
            simulationlist: [],
            numOfRunningSim: "",
            messagelist: [],
            email : "",
            username : "",
            password : "",
        }
        this.handleClickOpenCreate = this.handleClickOpenCreate.bind(this);
        this.handleCloseCreate = this.handleCloseCreate.bind(this);
        this.handleClickOpenBilling = this.handleClickOpenBilling.bind(this);
        this.handleCloseBilling = this.handleCloseBilling.bind(this);
        this.handleClickOpenDelete = this.handleClickOpenDelete.bind(this);
        this.handleCloseDelete = this.handleCloseDelete.bind(this);
        this.validateInput = this.validateInput.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleBilling = this.handleBilling.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
    }  
    componentDidMount(){ 
        axios.get(`${backendConfig}/admindashboard/users`)
            .then((response) => {
                this.setState({userlist : response.data})
            })
            .catch(err => {
                console.log(err.response);
            });
        axios.get(`${backendConfig}/admindashboard/simulations`)
            .then((response) => {
                let sum = 0;
                let simulationlist = response.data;
                simulationlist.map((listing) => {
                    if (!listing.endtime) sum += 1;
                })
                this.setState({
                    simulationlist : response.data,
                    numOfRunningSim : sum
                })
            })
            .catch(err => {
                console.log(err.response);
            });
        axios.get(`${backendConfig}/message`)
            .then((response) => {
                let messagelist = response.data;
                let messagearray = [];
                messagelist.map((listing) => {
                    if (listing.message){messagearray.push(listing);}
                })
                this.setState({messagelist : messagearray})
            })
            .catch(err => {
                console.log(err.response);
            });
    }
    handleClickOpenCreate = () => {this.setState({open_create : true})};
    handleCloseCreate = () => {this.setState({open_create : false})};
    handleClickOpenBilling = () => {this.setState({open_billing : true})};
    handleCloseBilling = () => {this.setState({open_billing : false})};
    handleClickOpenDelete = () => {this.setState({open_delete : true})};
    handleCloseDelete = () => {this.setState({open_delete : false})};
    usernameChangeHandler = (e) => {
        this.setState({username : e.target.value})
    };
    emailChangeHandler = (e) => {
        this.setState({email : e.target.value})
    };
    passwordChangeHandler = (e) => {
        this.setState({password : e.target.value})
    }
    validateInput = () => {
        const inputs = document.querySelectorAll('input');
        var emailFormat = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)$/;
        const error = document.getElementById('errorMsg');
        let isValid = true;
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].value == ""){
                error.textContent = "Please enter the " + (inputs[i].name || "Role");
                isValid = false;
                break;
            } 
            else if (!inputs[0].value.match(emailFormat)){
                error.textContent = "The email format is invalid, please use user@google format";
                isValid = false;
            }
        }
        return isValid;
    }
    handleCreate = (event) => {
        event.preventDefault();//stop refresh
        if (this.validateInput()){
            const data = {
                username : this.state.username,
                email : this.state.email,
                password : this.state.password
            }
            this.props.userSignup(data);
        }
    }
    handleDelete = (event) => {
        event.preventDefault();//stop refresh
        const data = {
            email : localStorage.getItem("UserEmail")
        }
        axios.post(`${backendConfig}/admindashboard/delete`, data)
            .then((response) => {
                if (response.status === 200){
                    this.props.history.push('/admin-dashboard')
                }
            })
            .catch(err => {
                console.log(err.response);
            });
    }
    handleBilling = (event) => {
        event.preventDefault();//stop refresh
        const data = {
            email : localStorage.getItem("UserEmail"),
            billing : localStorage.getItem("UserBilling")
        }
        axios.post(`${backendConfig}/admindashboard/sendbilling`, data)
            .then((response) => {
                if (response.status === 200){
                    alert("Successfully send billing to the user");
                    this.props.history.push('/admin-dashboard')
                }
            })
            .catch(err => {
                console.log(err.response);
            });
    }
    handleMessage= (event) => {
        event.preventDefault();//stop refresh
        const data = {
            email : localStorage.getItem("UserMessage")
        }
        axios.post(`${backendConfig}/message/delete`, data)
            .then((response) => {
                if (response.status === 200){
                    this.props.history.push('/admin-dashboard')
                }
            })
            .catch(err => {
                console.log(err.response);
            });
    }
    render(){
        const { classes } = this.props;
        console.log(this.state);
        //if not logged in go to login page
        let redirectVar = null;
        if(this.props.signup === "Success_Signup"){
            this.props.history.push('/admin-dashboard')
        }
        if(!localStorage.getItem('email')){
            redirectVar = <Redirect to= "/"/>
        }
        return(
            <div>
                {redirectVar}
                <AdminNavbar/>
                <div class="container">
                    <h2>Administration Dashboard</h2>
                </div>
                <div className={classes.root}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} spacing={1}>
                            <Grid container spacing={5}>
                                <Grid item xs={4} style={{paddingLeft:'0px'}}>
                                    <div style={{height:'60vh'}}>
                                    <Pie
                                        data = {{
                                            labels: ["Running simulations", "Stopped simulations"],
                                            datasets: [
                                                {
                                                label: "Tracking simulations",
                                                data: [this.state.numOfRunningSim, this.state.simulationlist.length - this.state.numOfRunningSim],
                                                backgroundColor: [
                                                    '#b3d3c8',
                                                    '#f5bebd',
                                                ],
                                                borderColor: [
                                                    '#b3d3c8',
                                                    '#f5bebd',
                                                ],
                                                borderWidth: 1,
                                                },
                                            ],
                                            }}
                                            options={{
                                                maintainAspectRatio: false,
                                                legend: {
                                                    display: false
                                                },
                                            }}
                                    />
                                    </div>
                                    <br></br>
                                    <Paper className={classes.paper2} elevation={3}>
                                    <div style={{padding:'10px'}}>
                                    <Container>                                        
                                            <div style={{color: "white", margin: "0px", padding:"0px", fontSize: "30px"}} md={4}>User Tracking</div>
                                            <div style={{color: "white", fontSize: "40px",paddingLeft:'10px'}}>{this.state.userlist.length}</div>
                                            <div style={{color: "white", margin: "0px", padding:"10px", fontSize: "20px"}} md={4}>Reg Users</div>
                                            <br></br>
                                            <div style={{color: "white", margin: "0px", padding:"0px", fontSize: "30px"}} md={4}>Robot Tracking</div>
                                            {/* <div style={{color: "white", fontSize: "40px",paddingLeft:'10px'}}>{this.state.simulationlist.length}</div>
                                            <div style={{color: "white", margin: "0px", padding:"10px", fontSize: "20px"}} md={4}>Registered Robots</div>
                                            <div style={{color: "white", fontSize: "40px",paddingLeft:'10px'}}>{this.state.numOfRunningSim}</div>
                                            <div style={{color: "white", margin: "0px", padding:"10px", fontSize: "20px"}} md={4}>Running Robots</div> */}
                                            <div style={{color: "white", fontSize: "40px",paddingLeft:'10px'}}>{this.state.simulationlist.length}</div>
                                            <div style={{color: "white", margin: "0px", padding:"10px", fontSize: "20px"}} md={4}>Simulations</div>
                                            <div style={{color: "white", fontSize: "40px",paddingLeft:'10px'}}>{this.state.numOfRunningSim}</div>
                                            <div style={{color: "white", margin: "0px", padding:"10px", fontSize: "20px"}} md={4}>Running Simulations</div>
                                    </Container>
                                </div>
                            </Paper>
                                    {/* <Typography variant="h6" className={classes.title}>
                                        User Tracking
                                    </Typography>
                                    <Typography className={classes.message}>There are {this.state.userlist.length} registered users</Typography><br/><br/>
                                    <Typography variant="h6" className={classes.title}>
                                        Robot Tracking
                                    </Typography>
                                    <Typography className={classes.message}>There are {this.state.simulationlist.length} registered robots</Typography><br/>
                                    <Typography className={classes.message}>There are {this.state.numOfRunningSim} running robots</Typography><br/>
                                    <Typography className={classes.message}>There are {this.state.simulationlist.length} simulations</Typography><br/>
                                    <Typography className={classes.message}>There are {this.state.numOfRunningSim} running simulations</Typography> */}
                                    {/* <Pie
                                        data = {{
                                            labels: ["Running simulations", "Stopped simulations"],
                                            datasets: [
                                                {
                                                label: "Tracking simulations",
                                                data: [this.state.numOfRunningSim, this.state.simulationlist.length - this.state.numOfRunningSim],
                                                backgroundColor: [
                                                    'rgba(255, 99, 132, 0.2)',
                                                    'rgba(54, 162, 235, 0.2)',
                                                ],
                                                borderColor: [
                                                    'rgba(255, 99, 132, 1)',
                                                    'rgba(54, 162, 235, 1)',
                                                ],
                                                borderWidth: 1,
                                                },
                                            ],
                                            }}
                                            options={{
                                                maintainAspectRatio: false,
                                                legend: {
                                                    display: false
                                                },
                                            }}
                                    /> */}
                                </Grid>
                                <Grid item xs={7} style={{backgroundColor: 'black', color: 'white', borderRadius: '10px'}}>
                                    <Toolbar>
                                        <Typography variant="h6" className={classes.title}>
                                            Registered Users
                                        </Typography>
                                    </Toolbar>
                                    <List className={classes.list}>
                                        {!this.state.userlist.length && <Typography className={classes.message}>There is no user yet...</Typography>}
                                        {this.state.userlist.map((listing, index) => {
                                            return (
                                                <Accordion>
                                                    <AccordionDetails>
                                                    <Grid container spacing={3}>
                                                        <Grid item xs={4}>
                                                            <Typography variant="h6" className={classes.detail}>User Name: {listing.username}</Typography>
                                                        </Grid>
                                                        <Grid item xs={4}>
                                                            <Typography variant="h6" className={classes.detail}>User Email: {listing.email}</Typography>
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            <Button variant="contained" size="large" color="black" onClick={(event)=>{
                                                                    localStorage.setItem("UserEmail", listing.email);
                                                                    this.handleClickOpenDelete(event);
                                                                }}>Delete User</Button>
                                                        </Grid>
                                                        <Grid item xs={2}> 
                                                            <Button variant="contained" size="large" color="black" onClick={(event)=>{
                                                                    localStorage.setItem("UserBilling", listing.billing);
                                                                    localStorage.setItem("UserEmail", listing.email);
                                                                    this.handleClickOpenBilling(event);
                                                                }}>Send Bill</Button>
                                                        </Grid>
                                                    </Grid>
                                                    </AccordionDetails><br/>
                                                </Accordion>
                                            )}
                                        )}                                              
                                    </List>
                                    {/* <Toolbar>
                                        <Typography variant="h6" className={classes.title}>
                                            Messages from users
                                        </Typography>
                                    </Toolbar>
                                    <List className={classes.list}>
                                        {!this.state.messagelist.length && <Typography className={classes.message}>There is message from users yet...</Typography>}
                                        {this.state.messagelist.map((listing, index) => {
                                            return (
                                                <Accordion>
                                                    <AccordionDetails>
                                                    <Grid container spacing={3}>
                                                        <Grid item xs={3}>
                                                            <Typography variant="h6" className={classes.detail}>User Name: {listing.username}</Typography>
                                                        </Grid>
                                                        <Grid item xs={3}>
                                                            <Typography variant="h6" className={classes.detail}>User Email: {listing.email}</Typography>
                                                        </Grid>
                                                        <Grid item xs={4}>
                                                            <Typography variant="h6" className={classes.detail}>Message: {listing.message}</Typography>
                                                        </Grid>
                                                        <Grid item xs={2}> 
                                                            <Button variant="contained" size="large" color="primary" onClick={(event)=>{
                                                                    localStorage.setItem("UserMessage", listing.email);
                                                                    this.handleMessage(event);
                                                                }}>Done</Button>
                                                        </Grid>
                                                    </Grid>
                                                    </AccordionDetails><br/>
                                                </Accordion>
                                            )}
                                        )}                                            
                                    </List> */}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div> 
                <Dialog fullWidth maxWidth="xs" open={this.state.open_create} onClose={this.handleCloseCreate} aria-labelledby="form-dialog-title">
                    <DialogTitle>Create a new user</DialogTitle>
                    <DialogContent>
                        <Form>
                            <Form.Group controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    name="email"
                                    value={this.state.email}
                                    onChange={this.emailChangeHandler}
                                    placeholder="Enter the Email" />
                            </Form.Group>
                            <Form.Group controlId="formUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="username"
                                    value={this.state.username}
                                    onChange={this.usernameChangeHandler}
                                    placeholder="Enter the Username" />
                            </Form.Group>
                            <Form.Group controlId="formPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    name="Password"
                                    value={this.state.password}
                                    onChange={this.passwordChangeHandler}
                                    placeholder="Enter the Password" />
                            </Form.Group>
                        </Form>
                        <div className="error" id="errorMsg" /> 
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseCreate} color="primary">Cancel</Button>
                        <Button onClick={this.handleCreate} color="primary">Create</Button>
                    </DialogActions>
                </Dialog>
                <Dialog fullWidth maxWidth="xs" open={this.state.open_delete} onClose={this.handleCloseDelete} aria-labelledby="form-dialog-title">
                    <DialogTitle>Confirmation</DialogTitle>
                    <DialogContent>
                        <DialogContentText className={classes.dialogtext}>
                            Are you sure to delete this user?
                        </DialogContentText> 
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseDelete} color="primary">Cancel</Button>
                        <Button onClick={this.handleDelete} color="primary">Yes</Button>
                    </DialogActions>
                </Dialog>
                <Dialog fullWidth maxWidth="xs" open={this.state.open_billing} onClose={this.handleCloseBilling} aria-labelledby="form-dialog-title">
                    <DialogTitle>Send Billing to the user</DialogTitle>
                    <DialogContent>
                        <Form>
                            <Form.Group controlId="formAmount">
                                {/* <Form.Label>Amount</Form.Label> */}
                                <DialogContentText className={classes.dialogtext}>
                                    Are you sure to send bill?
                                </DialogContentText> 
                            </Form.Group>
                        </Form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseBilling} color="primary">Cancel</Button>
                        <Button onClick={this.handleBilling} color="primary">Send</Button>
                    </DialogActions>
                </Dialog>
            </div> 
        )
    }
}

AdminDashboard.propTypes = {
    userSignup: PropTypes.func.isRequired,
    signup: PropTypes.object.isRequired
}

const mapStateToProps = state => { 
    return ({
        signup: state.signup.signup
    })
};

//export Login Component
export default withRouter(connect(mapStateToProps, { userSignup })(withStyles(useStyles)(AdminDashboard)));