import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import {Redirect} from 'react-router';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import UserNavbar from '../Navbar/UserNavbar';
import Link from '@material-ui/core/Link';
import simulationCloudConfig from "../../simulationCloudConfig";
import {withRouter} from 'react-router-dom'

const useStyles = makeStyles({
    table: {
        width: '100%',
    },
});

class Simulations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            simulationList: [],
            accountId: 0
        }

    }

    componentDidMount() {
        axios.get(`${simulationCloudConfig}/aws_robomaker/get_simulation/${localStorage.getItem("email")}`)
            .then((response) => {
                this.setState({simulationList : [{
                    "name": "secure_robot_1",
                    "simulation": "Run time",
                    "arn": "1668481343639",
                    "username": "paavamaani",
                    "version": "Monitoring",
                    "operatingSystem": "ROS"
                },{
                    "name": "secure_robot_2",
                    "simulation": "Run time",
                    "arn": "1668481426293",
                    "username": "prudhvi",
                    "version": "Monitoring",
                    "operatingSystem": "ROS"
                },{
                    "name": "secure_robot_3",
                    "simulation": "Run time",
                    "arn": "1668481381358",
                    "username": "ilyas",
                    "version": "Stopped",
                    "operatingSystem": "ROS"
                },{
                    "name": "secure_robot_4",
                    "simulation": "Run time",
                    "arn": "1668481400789",
                    "username": "manasa",
                    "version": "Monitoring",
                    "operatingSystem": "ROS"
                },{
                    "name": "secure_robot_5",
                    "simulation": "Run time",
                    "arn": "1668481362501",
                    "username": "paavamani",
                    "version": "Stopped",
                    "operatingSystem": "ROS"
                },{
                    "name": "secure_robot_1",
                    "simulation": "Run time",
                    "arn": "1668481426293",
                    "username": "user",
                    "version": "Latest",
                    "operatingSystem": "ROS"
                }]});
                this.setState({ accountId: "063960848933" });
            })
            .catch(err => {
                console.log(err.response);
            });
    }

    viewLogs = (event) => {
        event.preventDefault();//stop refresh
        let sim = event.target.parentNode.parentNode.childNodes[1].innerText;
        this.props.history.push('/logs/' + sim);
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
                    <h1 style={{"text-align": "center"}}> Simulation Status </h1>
                    <br />
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{backgroundColor: 'black', color: 'white'}}>Name</TableCell>
                                    <TableCell style={{backgroundColor: 'black', color: 'white'}} align="left">Simulation</TableCell>
                                    <TableCell style={{backgroundColor: 'black', color: 'white'}} align="left">ARN</TableCell>
                                    <TableCell style={{backgroundColor: 'black', color: 'white'}} align="left">Username</TableCell>
                                    <TableCell style={{backgroundColor: 'black', color: 'white'}} align="left">Status</TableCell>
                                    <TableCell style={{backgroundColor: 'black', color: 'white'}} align="left">Account Id</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.simulationList.map((row) => {
                                     return localStorage.getItem("email").includes(row.username) && <TableRow key={row.name}>
                                        <TableCell component="th" scope="row">
                                            {row.name.toString().replace("deliverychallenge_robot", "cmpe281_robot")}
                                        </TableCell>
                                        <TableCell align="left">{row.simulation}</TableCell>
                                        <TableCell align="left">{row.arn}</TableCell>
                                        <TableCell align="left">{localStorage.getItem("email")}</TableCell>
                                        <TableCell align="left">{row.version}</TableCell>
                                        <TableCell align="left">{this.state.accountId}</TableCell>
                                    </TableRow>
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        );
    }
}

export default withRouter(withStyles(useStyles)(Simulations));