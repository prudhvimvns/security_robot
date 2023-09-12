import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import {Redirect} from 'react-router';
import { Button, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import UserNavbar from '../Navbar/UserNavbar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Link from '@material-ui/core/Link';
import simulationCloudConfig from "../../simulationCloudConfig";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = (theme) => ({

    title:{
        color: "grey",
        fontSize: 45,
        textAlign: "center",
        marginTop: "30px",
        marginBottom: "0px"
    },

    hr:{
        width: '45%',
        borderStyle: 'inset',
        borderWidth: '2px',
    },

    paper:{
        margin: '30px 30px 30px 30px',
        padding: '30px 30px 30px 30px'
    },

    panelTitle:{
        marginBottom: '20px',
    },

    chartContainer:{
        marginTop: '30px'
    },

    button:{
        fontSize: '15px'
    },

    instancesContainer: {
        marginTop: '20px'
    },

    tablecell: {
        fontSize: '15px'
    },

    table: {
        width: '100%',
    },

});

class Logs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            simulationLogList: [],
            open_details : false,
            simulation_delivery: [],
            robot_application: []
        }

        this.handleCloseDetails = this.handleCloseDetails.bind(this);
    }

    viewLogs = (event) => {
        this.setState({ open_details : true });
        event.preventDefault();//stop refresh
        let arn = event.target.parentNode.parentNode.childNodes[0].innerText;
        let split_result = arn.split('/');

        axios.post(`${simulationCloudConfig}/aws_cloudwatch/get_logs_events`, {
            streamName: split_result[0],
            simulationName: split_result[1]
        })
            .then((response) => {
                this.setState({ simulation_delivery : response.data.message.simulation_delivery.events });
                this.setState({ robot_application : response.data.message.robot_application.events });
            })
            .catch(err => {
                console.log(err.response);
            });
    }

    handleCloseDetails = () => {this.setState({ open_details : false })};

    componentDidMount() {
        let url = document.location.href;
        let urlArray = url.split('/');
        let sim = urlArray[4];

        axios.get(`${simulationCloudConfig}/aws_cloudwatch/get_simulation_logs/${sim}`)
            .then((response) => {
                this.setState({ simulationLogList : response.data.message.logStreams });
            })
            .catch(err => {
                console.log(err.response);
            });
    }

    render() {
        const { classes } = this.props;
        let redirectVar = null;
        if(!localStorage.getItem('email')){
            redirectVar = <Redirect to= "/"/>
        }

        return(
                <div>
                    {redirectVar}
                    <UserNavbar/>
                    <div>
                        <br />
                        <br />
                        <br />
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Logstream Name</TableCell>
                                        <TableCell align="left">Creation Time</TableCell>
                                        <TableCell align="left">ARN</TableCell>
                                        <TableCell align="left">Stored Bytes</TableCell>
                                        <TableCell align="left">Details</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.simulationLogList.map((row) => (
                                        <TableRow key={row.name}>
                                            <TableCell component="th" scope="row">
                                            {row.logStreamName}
                                            </TableCell>
                                            <TableCell align="left">{row.creationTime}</TableCell>
                                            <TableCell align="left">{row.arn.replace('-deliverychallenge', '-delivery')}</TableCell>
                                            <TableCell align="left">{row.storedBytes}</TableCell>
                                            <TableCell align="left"><Link href="#" onClick={(event)=>{
                                                this.viewLogs(event);
                                            }}> Details </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    <Dialog contentStyle={{
                        width: '80%',
                        maxWidth: 'none',
                    }} fullWidth maxWidth="xs" open={this.state.open_details} onClose={this.handleCloseDetails} aria-labelledby="form-dialog-title">
                        <DialogTitle>Logs</DialogTitle>
                        <DialogContent>
                            <TableContainer component={Paper}>
                                <Table className={classes.table} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left">Log Line</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.simulation_delivery.map((row) => (
                                            <TableRow key={row.name}>
                                                <TableCell component="th" scope="row">
                                                    {row.message}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {this.state.robot_application.map((row) => (
                                            <TableRow key={row.name}>
                                                <TableCell component="th" scope="row">
                                                    {row.message}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <div className="error" id="errorMsg" />
                        </DialogContent>
                        <DialogActions>
                            <br />
                            <Button onClick={this.handleCloseDetails} color="primary">Cancel</Button>
                        </DialogActions>
                    </Dialog>
                </div>
        );
    }
}

export default withStyles(useStyles)(Logs);