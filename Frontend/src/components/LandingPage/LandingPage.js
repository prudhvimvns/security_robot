import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import {Redirect} from 'react-router';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Form, Button } from 'react-bootstrap';
import { Accordion, AccordionDetails, AccordionSummary, Divider, List } from "@material-ui/core";
import Toolbar from '@material-ui/core/Toolbar';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import icon from '../../image/icon1.png';
import image from '../../image/robo.jpeg';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { userLogin, adminLogin } from '../../redux/actions/loginAction';
import { userSignup } from '../../redux/actions/signupAction';
import {withRouter} from 'react-router-dom'

const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
        margin: theme.spacing(2),
    },
    margin: {
        margin: theme.spacing(1),
    },
    button: {
        marginRight: theme.spacing(1),
    },
    title: {
        flexGrow: 1,
        fontSize: 30,
        fontWeight: 'bold',
    },
    dialogtext: {
        flexGrow: 1,
        fontSize: 13,
        fontWeight: 'bold',
    },
    text: {
        flexGrow: 1,
        fontSize: 13,
        fontWeight: 'bold',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
    },
    message: {
        flexGrow: 1,
        fontSize: 20,
    },
    navbar_root: { //navbar
        flexGrow: 1,
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(2),
        backgroundColor: 'black',
        color: 'white'
    },
    navbar_button: {
        backgroundColor: 'white',
        color: 'black',
        margin: theme.spacing(1),
        "&:hover": {
            // backgroundColor: "yellow",
            backgroundColor: 'white',
            color: 'black'
          },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(20),
    },
    navbar_title: {
        flexGrow: 1,
        fontSize: 25,
    },
    image: {
        textAlign: 'center',
    },
    img: {
        width: '75%'
    }
});

class LandingPage extends Component {
    constructor(props){
        super(props);
        this.state = {  
            //for toggle modal
            open_login : false,
            open_signup : false,
            email : "",
            username : "",
            password : "",
            role : ""
        }
        this.handleClickOpenL = this.handleClickOpenL.bind(this);
        this.handleCloseL = this.handleCloseL.bind(this);
        this.handleClickOpenS = this.handleClickOpenS.bind(this);
        this.handleCloseL = this.handleCloseL.bind(this);
        this.handleHomeButtonEvent = this.handleHomeButtonEvent.bind(this);
        this.validateInput = this.validateInput.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.roleChangeHandler = this.roleChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
        this.submitSignup = this.submitSignup.bind(this);
    }  
    //handlers
    handleHomeButtonEvent = (event) => {
        event.preventDefault();//stop refresh
        this.props.history.push('/');
    }
    handleClickOpenL = () => {
        this.setState({open_login : true});
    };
    handleCloseL = () => {
        this.setState({open_login : false});
    };
    handleClickOpenS = () => {
        this.setState({open_signup : true});
    };
    handleCloseS = () => {
        this.setState({open_signup : false});
    };
    usernameChangeHandler = (e) => {
        this.setState({username : e.target.value})
    };
    emailChangeHandler = (e) => {
        this.setState({email : e.target.value})
    };
    passwordChangeHandler = (e) => {
        this.setState({password : e.target.value})
    }
    roleChangeHandler = (e) => {
        this.setState({role : e.target.value})
    }
    //validate input
    validateInput = () => {
        const inputs = document.querySelectorAll('input');
        var emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        const error = document.getElementById('errorMsg');
        let isValid = true;
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].value == ""){
                error.textContent = "Please enter your " + (inputs[i].name || "Role");
                isValid = false;
                break;
            } 
            else if (!inputs[0].value.match(emailFormat)){
                error.textContent = "Your email format is invalid, please use user@google format";
                isValid = false;
            }
        }
        return isValid;
    }
    submitLogin = (e) => {
        e.preventDefault();
        if (this.validateInput()){
            const data = {
                email : this.state.email,
                password : this.state.password
            }
            //redux login action
            if (this.state.role === "user"){
                this.props.userLogin(data);
            } else if (this.state.role === "admin"){
                this.props.adminLogin(data);
            }
        }
    }
    submitSignup = (e) => {
        e.preventDefault();
        if (this.validateInput()){
            const data = {
                username : this.state.username,
                email : this.state.email,
                password : this.state.password
            }
            //redux login active
            this.props.userSignup(data);
        }
    }

    render(){
        const { classes } = this.props;
        console.log(this.state);
        //redirect based on successful login
        let redirectVar = null;
        if(this.props.signup === "Success_Signup"){ 
            localStorage.setItem("email", this.state.email);
            redirectVar = <Redirect to="/user-dashboard" />
        }
        if(this.props.user === "Success_Login"){ 
            localStorage.setItem("email", this.state.email);
            redirectVar = <Redirect to="/user-dashboard" />
        }
        if(this.props.admin === "Success_Login"){ 
            localStorage.setItem("email", this.state.email);
            redirectVar = <Redirect to="/admin-dashboard" />
        }
        return(
            <div>
                {redirectVar}
                <div className={classes.navbar_root}>
                    <Toolbar>
                        <IconButton edge="start"
                            className={classes.menuButton}
                            color="inherit" 
                            aria-label="menu"
                            onClick={this.handleHomeButtonEvent}
                        >
                        <Avatar style={{height: '66px'}} alt="Splitwise" src={icon}/>
                        </IconButton>
                        <Typography variant="h6" className={classes.navbar_title}>
                            Robot Secure
                        </Typography>
                        <Button variant="outlined" size="large" color="primary" className={classes.navbar_button} onClick={this.handleClickOpenL}> Log in</Button>
                        <Button variant="contained" size="large" color="primary" className={classes.navbar_button} onClick={this.handleClickOpenS}>Sign up</Button>
                    </Toolbar>
                </div>
                {/* <br/> */}
                <div className={classes.image}>
                    <img className={classes.img} src={image} alt="image"/>
                    <br/><br/>
                    <p>&copy;  CMPE281 Group 18 Robot Secure</p>
                </div>
                <Dialog fullWidth maxWidth="xs" open={this.state.open_login} onClose={this.handleCloseL} aria-labelledby="form-dialog-title">
                    <DialogTitle>Log In</DialogTitle>
                    <DialogContent>
                        <DialogContentText className={classes.dialogtext}>
                            Please enter the email and password
                        </DialogContentText>
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
                            <Form.Group controlId="formPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    name="Password"
                                    value={this.state.password}
                                    onChange={this.passwordChangeHandler}
                                    placeholder="Enter the Password" />
                            </Form.Group>
                            <Form.Group controlId="formRole">
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        onChange={this.roleChangeHandler}
                                    >
                                        <MenuItem value={'user'}>user</MenuItem>
                                        <MenuItem value={'admin'}>admin</MenuItem>
                                    </Select>
                                </FormControl>
                            </Form.Group>
                        </Form>
                        <div className="error" id="errorMsg" /> 
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseL} color="primary">Cancel</Button>
                        <Button onClick={this.submitLogin} color="primary">Log In</Button>
                    </DialogActions>
                </Dialog>

                <Dialog fullWidth maxWidth="xs" open={this.state.open_signup} onClose={this.handleCloseS} aria-labelledby="form-dialog-title">
                    <DialogTitle>Sign Up</DialogTitle>
                    <DialogContent>
                        <DialogContentText className={classes.dialogtext}>
                            Please enter the username, email and password to sign up
                        </DialogContentText>
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
                        <Button onClick={this.handleCloseS} color="primary">Cancel</Button>
                        <Button onClick={this.submitSignup} color="primary">Sign Up</Button>
                    </DialogActions>
                </Dialog>
            </div >
        )
    }
}
            
LandingPage.propTypes = {
    userLogin: PropTypes.func.isRequired,
    adminLogin: PropTypes.func.isRequired,
    userSignup: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    admin: PropTypes.object.isRequired,
    signup: PropTypes.object.isRequired
}

const mapStateToProps = state => { 
    return ({
        user: state.login.user,
        admin: state.login.admin,
        signup: state.signup.signup
    })
};

//export Login Component
export default withRouter(connect(mapStateToProps, { userLogin, adminLogin, userSignup })(withStyles(useStyles)(LandingPage)));