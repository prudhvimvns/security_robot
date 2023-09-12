import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import Grid from '@material-ui/core/Grid';
import { Container, Typography, Button } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import icon from '../../image/icon1.png';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { userLogout } from '../../redux/actions/logoutAction';
import {withRouter} from 'react-router-dom'

const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    button: {
        color: 'white',
        backgroundColor: 'transparent',
        margin: theme.spacing(1),
        borderShadow: '0px',
        padding: '10px',

        "&:hover": {
            backgroundColor: "white",
            color: 'black',
          },
    },

    menuButton: {
        backgroundcolor: 'yellow',
        fontWeight: '700',
    },
    title: {
        color: 'white',
        flexGrow: 1,
        fontSize: 25,
    },
});

//create the Navbar Component
class UserNavbar extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            simulation: false
        }

        this.handleHomeButtonEvent = this.handleHomeButtonEvent.bind(this);
        this.handleHelp = this.handleHelp.bind(this);
        this.handleProfile = this.handleProfile.bind(this);
        this.handleSimulations = this.handleSimulations.bind(this);
        this.handleLogs = this.handleLogs.bind(this);
        this.handleNavigation = this.handleNavigation.bind(this);
        this.handleRobot = this.handleRobot.bind(this);
        this.handleLogOut = this.handleLogOut.bind(this);
    }

    handleHomeButtonEvent = (event) => {
        this.props.history.push('/user-dashboard');
    };
    handleHelp = (event) => {
        this.props.history.push('/help');
    };
    handleProfile = (event) => {
        this.props.history.push('/profile');
    };
    handleSimulations = (event) => {
        this.props.history.push('/simulations');
    };

    handleLogs = (event) => {
        event.preventDefault();//stop refresh
        this.props.history.push('/logs');
    };
    handleNavigation = (event) => {
        event.preventDefault();//stop refresh
        this.props.history.push('/navigation');
    };
    handleRobot = (event) => {
        event.preventDefault();//stop refresh
        this.props.history.push('/robot');
    };
    //handle logout to destroy the cookie
    handleLogOut = (event) => {
        event.preventDefault();//stop refresh
        window.localStorage.clear();
        this.props.userLogout();
        window.location.reload(false);
    };

    render() {
        const { classes } = this.props;

        return(
            <div>
                <div className={classes.root}>
                    <AppBar position="static" style={{ background: '#000' }}>
                        <Toolbar>
                            <IconButton edge="start"
                                className={classes.menuButton}
                                color="inherit" 
                                aria-label="menu"
                                onClick={this.handleHomeButtonEvent}
                            >
                            <Avatar style={{height: '66px'}} alt="Splitwise" src={icon}/>
                            </IconButton>
                            <Typography variant="h6" className={classes.title}>
                                Robot Secure
                            </Typography>
                            
                            <p variant="" size="large" color="white" className={classes.button} onClick={this.handleHomeButtonEvent}>Home</p>
                            <p variant="" size="large" color="white" className={classes.button} onClick={this.handleRobot}>Robot</p>
                            <p variant="" size="large" color="white" className={classes.button} onClick={this.handleSimulations}>Simulations</p>
                            <p variant="" size="large" color="white" className={classes.button} onClick={this.handleNavigation}>Tracking</p>
                            <p variant="" size="large" color="white" className={classes.button} onClick={this.handleProfile}>Profile</p>
                            <p variant="" size="large" color="white" className={classes.button} onClick={this.handleLogOut}>Log out</p>
                        </Toolbar>
                    </AppBar>
                </div>
            </div>
        )
    }
}
            
UserNavbar.propTypes = {
    userLogout: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    user: state.logout.user,
});

export default withRouter(connect(mapStateToProps, { userLogout })(withStyles(useStyles)(UserNavbar)));