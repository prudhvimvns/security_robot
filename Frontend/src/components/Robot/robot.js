import React, {Component,useState} from 'react';
import '../../App.css';
import axios from 'axios';
import {Redirect} from 'react-router';
import { withStyles, makeStyles } from '@material-ui/core/styles';
// import Table from '@material-ui/core/Table';
import Table from 'react-bootstrap/Table';

import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import UserNavbar from '../Navbar/UserNavbar';
import simulationCloudConfig from "../../simulationCloudConfig";
import {Button} from "@material-ui/core";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import LandingPage from "../LandingPage/LandingPage";
// // import Button from 'react-bootstrap/Button';
// import { Form, Container, Row, Col, Button } from 'react-bootstrap';

// import Collapse from 'react-bootstrap/Collapse';
import {withRouter} from 'react-router-dom'

const useStyles = makeStyles({
    table: {
        width: '100%',
    },
    fieldset: {
        margin: '4%',
        border: '1px solid #ccc'
    },
    formControl: {
        width: '80%',
    },
});

function makeid(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result.push(characters.charAt(Math.floor(Math.random() *
            charactersLength)));
    }
    return result.join('');
}

let simulationName = '';

// const robotArray=[[1,"a","b","c","d","e"],[1,"a","b","c","d","e"],[1,"a","b","c","d","e"]];

class Robot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            robotList: [],
            accountId: 0,
            disableStartButton: false,
            disableStopButton: false,
            selectedRobot: '',
            currentSimulation: '',
            currentSimulationARN: '',
            simulationList: []
        }

    }

    componentDidMount() {
        axios.get(`${simulationCloudConfig}/aws_robomaker/list_robots`)
            .then((response) => {
                this.setState({robotList : [{
                    "name": "secure_robot_1",
                    "arn": "1668481193531",
                    "version": "Latest",
                    "operatingSystem": "ROS"
                },{
                    "name": "secure_robot_2",
                    "arn": "1668481236185",
                    "version": "Latest",
                    "operatingSystem": "ROS"
                },{
                    "name": "secure_robot_3",
                    "arn": "1668481259810",
                    "version": "Latest",
                    "operatingSystem": "ROS"
                },{
                    "name": "secure_robot_4",
                    "arn": "1668481283145",
                    "version": "Latest",
                    "operatingSystem": "ROS"
                },{
                    "name": "secure_robot_5",
                    "arn": "1668481312933",
                    "version": "Latest",
                    "operatingSystem": "ROS"
                }]});
                this.setState({ accountId: "063960848933" });
            })
            .catch(err => {
                console.log(err.response);
            });



        axios.get(`${simulationCloudConfig}/users/getSimulations/${localStorage.getItem("email")}`)
            .then((response) => {
                this.setState({ simulationList : response.data });
            })
            .catch(err => {
                console.log(err.response);
            });
    }

    render() {
        // const [open, setOpen] = useState(false);


        const handleStartSimulation1 = (event) => {
            event.preventDefault();//stop refresh
            // axios.post(`${simulationCloudConfig}/aws_robomaker/start_simulation/type/1`)
            //     .then((response) => {
            //         let simulation_Id = response.data.message.arn;
            //         let splitId = simulation_Id.split('/')[1];
            //         this.setState({ currentSimulation : splitId });
            //         this.setState({ currentSimulationARN : simulation_Id });

            //         axios.post(`${simulationCloudConfig}/users/startSimulation`, {
            //             simulationName: splitId,
            //             simulationType: 1,
            //             email: localStorage.getItem("email"),
            //             robotName: this.state.selectedRobot
            //         })
            //             .then((response) => {
            //                 alert("Simulation started successfully.");
            //                 this.props.history.push('/robot');
            //             })
            //             .catch(err => {
            //                 console.log(err.response);
            //             });
            //     })
            //     .catch(err => {
            //         console.log(err.response);
            //     });
            window.open('https://us-west-2.console.aws.amazon.com/robomaker/viewer?region=us-west-2#sim-b2qc0pkwh75r/8443/simulation-gzclient/us-west-2/063960848933/simulation-gzclient', '_blank');
        }

        const handleStartSimulation2 = (event) => {
            event.preventDefault();//stop refresh
            axios.post(`${simulationCloudConfig}/aws_robomaker/start_simulation/type/2`)
                .then((response) => {
                    let simulation_Id = response.data.message.arn;
                    let splitId = simulation_Id.split('/')[1];
                    this.setState({ currentSimulation : splitId });
                    this.setState({ currentSimulationARN : simulation_Id });

                    axios.post(`${simulationCloudConfig}/users/startSimulation`, {
                        simulationName: splitId,
                        simulationType: 2,
                        email: localStorage.getItem("email"),
                        robotName: this.state.selectedRobot
                    })
                        .then((response) => {
                            alert("Simulation started successfully.");
                            this.props.history.push('/robot');
                        })
                        .catch(err => {
                            console.log(err.response);
                        });
                })
                .catch(err => {
                    console.log(err.response);
                });
        }

        const handleChange = (event) => {
            this.setState({ selectedRobot: event.target.value });
        }

        const handleStopSimulation = (event) => {
            event.preventDefault();//stop refresh
            // let sim = event.target.parentNode.parentNode.parentNode.childNodes[0].innerHTML;

            // axios.post(`${simulationCloudConfig}/aws_robomaker/stop_simulation/${sim}`)
            //     .then((response) => {

            //         axios.post(`${simulationCloudConfig}/users/stopSimulation`, {
            //             simulationName: sim,
            //         })
            //             .then((response) => {
            //                 alert("Simulation stopped successfully.");
            //                 this.props.history.push('/robot');
            //             })
            //             .catch(err => {
            //                 console.log(err.response);
            //             });
            //     })
            //     .catch(err => {
            //         console.log(err.response);
            //     });
        };

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
                    <div className={classes.fieldset}>
                        <div style={{width: '90%',margin: 'auto'}}>
                        <fieldset>
                            <legend>Robots</legend>
                            <TableContainer component={Paper}>
                                <Table striped hover className={classes.table} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{backgroundColor: 'black', color: 'white'}}>Name</TableCell>
                                            <TableCell style={{backgroundColor: 'black', color: 'white'}} align="left">ARN</TableCell>
                                            <TableCell style={{backgroundColor: 'black', color: 'white'}} align="left">Version</TableCell>
                                            <TableCell style={{backgroundColor: 'black', color: 'white'}} align="left">Operating System</TableCell>
                                            <TableCell style={{backgroundColor: 'black', color: 'white'}} align="left">Account Id</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.robotList.map((row) => (
                                            <TableRow key={row.name}>
                                                <TableCell component="th" scope="row">
                                                    {row.name}
                                                </TableCell>
                                                <TableCell align="left">{row.arn}</TableCell>
                                                <TableCell align="left">{row.version}</TableCell>
                                                <TableCell align="left">{row.operatingSystem}</TableCell>
                                                <TableCell align="left">{this.state.accountId}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </fieldset>
                        </div>
                    </div>
                </div>
                <div style={{width: '90%',margin: 'auto'}}>
                    <fieldset>
                        <legend>Start Simulations</legend>
                        <TableContainer component={Paper}>
                            <Table striped hover className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{backgroundColor: 'black', color: 'white'}} align="left">Robots</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            <FormControl variant="outlined" className={classes.formControl}>
                                                <InputLabel id="demo-simple-select-outlined-label">Robots</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-outlined-label"
                                                    id="ddlRobots"
                                                    label="Robots"
                                                    onChange={handleChange}
                                                >
                                                    {this.state.robotList.map((row) => (
                                                        <MenuItem value={row.name.replace('deliverychallenge', 'cmpe281')}>{row.name.replace('deliverychallenge', 'cmpe281')}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Button variant="contained" size="large" color="black" className={classes.button} onClick={handleStartSimulation1}>Start Simulation</Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </fieldset>
                </div>
                <div style={{width: '90%',margin: 'auto'}}>
                    <fieldset>
                        <legend>Simulation List</legend>
                        <TableContainer component={Paper}>
                            <Table striped hover className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{backgroundColor: 'black', color: 'white'}} >Simulation Name</TableCell>
                                        <TableCell style={{backgroundColor: 'black', color: 'white'}} align="left">Start Time</TableCell>
                                        <TableCell style={{backgroundColor: 'black', color: 'white'}} align="left">End Time</TableCell>
                                        <TableCell style={{backgroundColor: 'black', color: 'white'}} align="left">Robot Name</TableCell>
                                        <TableCell style={{backgroundColor: 'black', color: 'white'}} align="left">Type</TableCell>
                                        <TableCell style={{backgroundColor: 'black', color: 'white'}} align="left">Email</TableCell>
                                        <TableCell style={{backgroundColor: 'black', color: 'white'}} align="left">Stop</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.simulationList.map((row) => (
                                        <TableRow key={row.name}>
                                            <TableCell component="th" scope="row">
                                                {row.simulationName}
                                            </TableCell>
                                            <TableCell align="left">{row.starttime}</TableCell>
                                            <TableCell align="left">{row.endtime}</TableCell>
                                            <TableCell align="left">{row.robotName}</TableCell>
                                            <TableCell align="left">{row.simulationType}</TableCell>
                                            <TableCell align="left">{row.user_email}</TableCell>
                                            <TableCell>
                                                {(() => {
                                                    if (row.endtime !== null) {
                                                        return (
                                                            <Button disabled={true} variant="contained" size="large" color="primary" className={classes.button} onClick={handleStopSimulation}>Stop Simulation</Button>
                                                        )
                                                    } else {
                                                        return (
                                                            <Button disabled={false} variant="contained" size="large" color="primary" className={classes.button} onClick={handleStopSimulation}>Stop Simulation</Button>
                                                        )
                                                    }
                                                })()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </fieldset>
                </div>
            </div>
        );
    }
}

export default withRouter(withStyles(useStyles)(Robot));