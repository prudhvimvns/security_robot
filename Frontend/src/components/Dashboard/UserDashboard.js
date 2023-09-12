import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import {Redirect} from 'react-router';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Button, Paper } from '@material-ui/core';
import { Form, Container, Row, Col } from 'react-bootstrap';
// import {Container} from 'react-bootstrap/Container';
// import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

import Toolbar from '@material-ui/core/Toolbar';
import { Accordion, AccordionDetails, AccordionSummary, Divider, List } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import NumberFormat from 'react-number-format';
import UserNavbar from '../Navbar/UserNavbar';
import backendConfig from "../../backendConfig";
import {Bar, defaults} from "react-chartjs-2";
// import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = (theme) => ({
    
    title:{
        color: "black",
        fontSize: 45,
        textAlign: "center",
        marginTop: "30px",
        fontweight: "400",
        marginBottom: "0px"
    },

    hr:{
        width: '22%',
        borderStyle: 'inset',
        borderWidth: '2px',
        margin:'5px',
    },
    
    paper:{
        borderRadius: '30px',
        margin: '30px 30px 30px 30px',
        padding: '30px 30px 30px 30px'
    },
    paper2:{
        borderRadius: '30px',
        margin: '30px 30px 30px 30px',
        padding: '30px 20px 30px 20px',
        backgroundColor: 'black',
        color:'white',

        // "&:hover": {
        //     color: '#0f5ff6',
        //     backgroundColor: '#3ae53e',
        //   },
    },
    digits:{
        fontSize: '80px',
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

    tablehead: {
        backgroundColor: 'black',
        color: 'white'
    }

});

function createData(id, runtime) {
    return { id, runtime};
  }
  
  const rows = [
    createData('WHR23546', 8),
    createData('WHR42384', 24),
    createData('WHR12973', 12),
  ];

class UserDashboard extends Component {
    constructor(props){
        super(props);
        this.state = {  
            usageList : [],
            totalBilling : "",
            simulationList: []
        }
        
    }  
    componentDidMount(){ 
        axios.get(`${backendConfig}/userdashboard/usage/${localStorage.getItem("email")}`)
            .then((response) => {
                this.setState({usageList : response.data})
                let usageList = response.data;
                let sum = 0;
                usageList.map((listing) => {
                    sum += listing.duration_hours;
                })
                console.log(usageList, sum);
                sum = sum * 60 * 1;
                this.setState({totalBilling : sum })
            })
            .catch(err => {
                console.log(err.response);
            });

        axios.get(`${backendConfig}/users/getSimulations/${localStorage.getItem("email")}`)
            .then((response) => {
                this.setState({ simulationList : response.data });
            })
            .catch(err => {
                console.log(err.response);
            });
    }

    render(){
        const { classes } = this.props;
        //if not logged in go to login page
        let redirectVar = null;
        if(!localStorage.getItem('email')){
            redirectVar = <Redirect to= "/"/>
        }
        console.log(this.state);
        let numMonths = 3;
        let feePerHour = 1;
        let graphLabel = [];
        let graphData = [];


        for(let i = 0; i < numMonths; i++){
            let d = new Date();
            d.setMonth(d.getMonth() - i);
            
            var monthRecord = this.state.usageList.filter((record) => {
                return record.month == d.getMonth() + 1 && record.year == d.getFullYear();
            })

            graphLabel.unshift(d.toLocaleString('default', {month:'long'}));

            if(monthRecord.length != 0){
                graphData.unshift(monthRecord[0].duration_hours * feePerHour);
            }else{
                graphData.unshift(0);
            }

        }

        const students=[[1,"a","b","c","d","e"],[1,"a","b","c","d","e"],[1,"a","b","c","d","e"]];
        // const robotArray=[1,"a","b","c","d","e"];


        // const students = [
        //     ["Name", "Subject", "Marks"],
        //     ["ABC", "Arts", 80],
        //     ["XYZ", "Science", "70"],
        //   ];

        

        return(
            <div>
                {redirectVar}
                <UserNavbar/>
                <div>
                    <Typography variant="h1" className={classes.title}> Dashboard </Typography>
                </div>
                <div>
                    <Grid container spacing={0}>
                        <Grid item lg={7}>
                            <Paper className={classes.paper} elevation={3}>
                                {/* <Typography variant="h3" className={classes.panelTitle}>
                                        Usage in Months
                                </Typography> */}
                                {/* {this.state.usageList.map((listing, index) => {
                                    return (
                                        <List>
                                            <Typography variant="h6" className={classes.detail}>Month: {listing.month}-{listing.year}</Typography>
                                            <Typography variant="h6" className={classes.detail}>Usage: {listing.duration_hours} hours</Typography>
                                        </List>
                                        
                                    )}
                                )} */}

                                <div>
                                    <Typography variant="h5">Usage for {graphLabel[graphLabel.length-1]} month ${graphData[graphData.length-1]}</Typography>
                                </div>
                                
                                <div className={classes.chartContainer}>
                                    <Bar
                                        data = {{
                                            labels: graphLabel,
                                            datasets: [
                                                {
                                                // label: '# of Votes',
                                                data: graphData,
                                                backgroundColor: [
                                                    'rgba(255, 255, 132, 0.2)',
                                                    'rgba(54, 162, 235, 0.2)',
                                                    'rgba(0.8, 0.8, 0.8, 0.8)',
                                                ],
                                                borderColor: [
                                                    'rgba(255, 99, 132, 1)',
                                                    'rgba(54, 162, 235, 1)',
                                                    'rgba(0.8, 0.8, 0.8, 0.8)',
                                                ],
                                                borderWidth: 2,
                                                },
                                            ],
                                            }}
                                            height={300}
                                            width={500}
                                            options={{
                                            maintainAspectRatio: false,
                                            scales: {
                                                yAxes: [
                                                {
                                                    ticks: {
                                                    beginAtZero: true,
                                                    },
                                                },
                                                ],
                                            },
                                            legend: {
                                                display: false
                                            },
                                        }}
                                    />
                                </div>
                            </Paper>
                        </Grid>

                        <Grid lg={5}>
                            <Paper className={classes.paper2} elevation={3}>
                                <div>
                                    <Container>
                                        <div style={{color: "white", fontSize: "40px"}}>Billing</div>
                                        <div style={{color: "white", fontSize: "30px"}}>{numMonths}</div>
                                        <div style={{color: "white", margin: "0px", padding:"0px", fontSize: "20px"}} md={4}>No of Months Displayed</div>
                                        <hr style={{color: "white", width:"5px"}}></hr>
                                        <div style={{color: "white", fontSize: "30px"}}>${feePerHour}</div>
                                        <div style={{color: "white", margin: "0px", padding:"0px", fontSize: "20px"}} md={4}>Charge per Min</div>
                                        <hr style={{color: "white", width:"5px"}}></hr>
                                        <div style={{color: "white", fontSize: "30px"}}>${graphData[graphData.length-1]}</div>
                                        <div style={{color: "white", margin: "0px", padding:"0px", fontSize: "20px"}} md={4}>Total Bill</div>
                                    </Container>
                                </div>
                            </Paper>
                        </Grid>


                        {/* <Grid lg={2}>
                            <Paper className={classes.paper2} elevation={3}>
                                <div>
                                    <Container>                                        
                                            <div style={{color: "white", fontSize: "40px"}}>${graphData[graphData.length-1]}</div>
                                            <div style={{color: "white", margin: "0px", padding:"0px", fontSize: "20px"}} md={4}>Total Bill</div><br></br>
                                            <hr style={{color: "white", width:"5px"}}></hr>
                                            <div style={{color: "#3ae53e", fontSize: "40px"}}>{feePerHour}</div>
                                            <div style={{color: "white", margin: "0px", padding:"0px", fontSize: "20px"}} md={4}>Charge per Hour</div>
                                    </Container>
                                </div>
                            </Paper>
                        </Grid> */}

                        <div style={{width: "100%", margin: "30px"}}>
                        <Grid item sm={12} md={12}>
                            <TableContainer component={Paper}>
                                <Table striped bordered hover>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className={classes.tablehead}>Simulation Name</TableCell>
                                            <TableCell className={classes.tablehead} align="left">Start Time</TableCell>
                                            <TableCell className={classes.tablehead} align="left">End Time</TableCell>
                                            <TableCell className={classes.tablehead} align="left">Robot Name</TableCell>
                                            <TableCell className={classes.tablehead} align="left">Email</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.simulationList.map((row) => (
                                            <TableRow key={row.simulationName}>
                                                <TableCell component="th" scope="row">
                                                    {row.simulationName}
                                                </TableCell>
                                                <TableCell align="left">{row.starttime}</TableCell>
                                                <TableCell align="left">{row.endtime}</TableCell>
                                                <TableCell align="left">{row.robotName}</TableCell>
                                                <TableCell align="left">{row.user_email}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        </div>

                    </Grid>
                </div>

            </div> 
        )
    }
}

export default withStyles(useStyles)(UserDashboard);