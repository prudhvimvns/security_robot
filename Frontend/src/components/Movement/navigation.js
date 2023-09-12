import React, {Component} from 'react';
import '../../App.css';
import {Redirect} from 'react-router';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import UserNavbar from '../Navbar/UserNavbar';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import './navigation.css';

var NavigationControlInstance;
const awsIot = require('aws-iot-device-sdk');
let AWS = require('aws-sdk');

let OdometryControlInstance;
let SyncJobFunction;
let SaveMapFunction;
let GoToTargetFunction;
let MoveAction = "";
let MoveActionPrev = "";
let SyncLastTime = 0;

const region = 'us-east-2';
const iotendpoint = 'a3ka5w8uqglf2j-ats.iot.us-east-2.amazonaws.com';
const iotclientId = 'deliverychallengeroot-RoboMakerDeliveryChallengeThing-11K4DZ447HPJ2'
const subscribe_topic = "deliverychallengeroot-RoboMakerDeliveryChallengeThing-11K4DZ447HPJ2/pub";
const publish_topic = "deliverychallengeroot-RoboMakerDeliveryChallengeThing-11K4DZ447HPJ2/sub";
const PoolId = 'us-east-2:fb863eeb-ae6e-48cb-b73b-61468e3152c0';

const useStyles = (theme) => ({
    title:{
        color: "black",
        fontSize: 45,
        textAlign: "center",
        marginTop: "30px",
        marginBottom: "0px",
        paddingLeft: "10px"
    },
    hr:{
        width: '22%',
        borderStyle: 'inset',
        borderWidth: '2px',
        margin: '0px',
        paddingLeft: "10px"
    },
});

async function main() {

    async function getCognitoCredentials() {
        AWS.config.region = region;
        let cognitoidentity = new AWS.CognitoIdentity();
        let params = {
            IdentityPoolId: PoolId
        };
        const identityId = await cognitoidentity.getId(params).promise();
        const data = await cognitoidentity.getCredentialsForIdentity(identityId).promise();
        let credentials = {
            accessKey: data.Credentials.AccessKeyId,
            secretKey: data.Credentials.SecretKey,
            sessionToken: data.Credentials.SessionToken
        };
        return credentials;
    }

    const credentials = await getCognitoCredentials();


    const deviceIot = awsIot.device({
        region: region,
        clientId: iotclientId,
        accessKeyId: credentials.accessKey,
        secretKey: credentials.secretKey,
        sessionToken : credentials.sessionToken,
        protocol: 'wss',
        port: 443,
        host: iotendpoint
    });

    deviceIot.subscribe(subscribe_topic, undefined, function (err, granted){
        if( err ){
            console.log('subscribe error: ' + err);
        } else {
            console.log('subscribe success');
        }
    });

    deviceIot.on('message', function(_topic, payload) {
        var json = JSON.parse(payload.toString());
        let command = json["command"];
        if (command === "location") {

            let odom = json["odom"];
            if (odom) {
                if (OdometryControlInstance) {
                    OdometryControlInstance.setState({
                        x:odom["x"].toFixed(4),
                        y:odom["y"].toFixed(4),
                        z:odom["z"].toFixed(4),
                        h:(odom["yaw"] * ( 180 / Math.PI )).toFixed(4)
                    });
                }
            }
        }
        else if (command === "result") {
            alert(json["message"])
        }
    });

    SyncJobFunction = function(action) {
        if (action) {
            MoveAction = action;
        }
        let payload = {};
        let shouldPublish = false;
        if (MoveAction !== "") {
            if (MoveAction !== MoveActionPrev) {
                MoveActionPrev = MoveAction;
                shouldPublish = true;
            }
            let t = (new Date()).getTime();
            if (t > SyncLastTime + 1500) {
                SyncLastTime = t;
                shouldPublish = true;
            }
        }
        if (shouldPublish) {
            console.log("Sync:" + MoveAction);
            payload["command"] = "move";
            payload["action"] = MoveAction;
            shouldPublish = true;
            deviceIot.publish(publish_topic, JSON.stringify(payload));
        }
    }

    GoToTargetFunction = function(x,y, heading) {
        console.log("go to target!!");
        let payload = {};
        let request_id =  (new Date()).getTime();
        payload["command"] = "navigation";
        payload["action"] = "setGoal";
        payload["request_id"] = request_id
        payload["x"] = Number(x);
        payload["y"] = Number(y);
        payload["yaw"] = heading * ( Math.PI / 180 ) ;
        console.log(payload);
        deviceIot.publish(publish_topic, JSON.stringify(payload));
        MoveAction = "";
    };

    SaveMapFunction = function() {
        let payload = {};
        console.log("save map!!");
        let request_id =  (new Date()).getTime();
        payload["command"] = "map";
        payload["action"] = "save";
        payload["request_id"] = request_id;
        console.log(payload);
        deviceIot.publish(publish_topic, JSON.stringify(payload));
    }


    setInterval(SyncJobFunction, 1000);
}

main();

class Controller extends Component {

    constructor(props) {
        super(props);
        MoveAction = "";
        MoveActionPrev = "";
    }

    //control
    move_forward_down = () => {
        this.setState({MoveAction : "forward"}); console.log("move_forward pressed"); SyncJobFunction("forward");
    }
    move_forward_up = () => {
        this.setState({MoveAction : ""}); console.log("move_forward released");
    }
    move_left_down = () => {
        this.setState({MoveAction : "left"}); console.log("move_left pressed"); SyncJobFunction("left");
    }
    move_left_up = () => {
        this.setState({MoveAction : ""}); console.log("move_left released");
    }
    move_right_down = () => {
        this.setState({MoveAction : "right"}); console.log("move_right pressed"); SyncJobFunction("right");
    }
    move_right_up = () => {
        this.setState({MoveAction : ""}); console.log("move_right released");
    }
    move_backward_down = () => {
        this.setState({MoveAction : "backward"}); console.log("move_backward pressed"); SyncJobFunction("backward");
    }
    move_backward_up = () => {
        this.setState({MoveAction : ""}); console.log("move_backward released");
    }
    move_stop_down = () => {
        this.setState({MoveAction : "stop"}); console.log("move_stop pressed"); SyncJobFunction("stop");
    }
    move_stop_up = () => {
        this.setState({MoveAction : ""}); console.log("move_stop released");
    }

    render() {
        return (
            <div className="controller">
                <div className="forward">
                    <button className="button move_button" onMouseDown={this.move_forward_down} onMouseUp={this.move_forward_up} >↑</button>
                </div>
                <div className="left">
                    <button className="button move_button"  onMouseDown={this.move_left_down} onMouseUp={this.move_left_up}>←</button>
                </div>
                <div className="stop">
                    <button className="button move_button"  onMouseDown={this.move_stop_down} onMouseUp={this.move_stop_up}>・</button>
                </div>
                <div className="right">
                    <button className="button move_button"  onMouseDown={this.move_right_down} onMouseUp={this.move_right_up}>→</button>
                </div>
                <div className="backward">
                    <button className="button move_button"  onMouseDown={this.move_backward_down} onMouseUp={this.move_backward_up}>↓</button>
                </div>
            </div>
        );
    }
}

class Odometry extends Component {
    constructor(props) {
        super(props);
        OdometryControlInstance = this;
        this.state = { x: 0, y:0, z:0, h:0 };
    }
    render() {
        return (
            <div className="location">
                <div className="title">Location</div>
                <div className="name">Odometry</div>
                <div className="odom_x">x</div>
                <div className="odom_y">y</div>
                <div className="odom_z">z</div>
                <div className="odom_heading">heading</div>
                <div className="odom_value_x">{this.state.x}</div>
                <div className="odom_value_y">{this.state.y}</div>
                <div className="odom_value_z">{this.state.z}</div>
                <div className="odom_value_heading">{this.state.h}</div>
            </div>
        );
    }
}

class Navigation extends Component {
    constructor(props) {
        super(props);
        NavigationControlInstance = this;
        this.state = { x: 0, y:0, heading:0 };
    }
    render() {
        return (
            <div className="goal">
                <div className="title_goal">Goal</div>
                <div className="goal_x">x</div>
                <div className="goal_y">y</div>
                <div className="goal_heading">heading</div>
                <div className="goal_value_x"><input className="input_field" type="text" onChange={this.onChangeGoalX} value={this.state.x} /></div>
                <div className="goal_value_y"><input className="input_field" type="text" onChange={this.onChangeGoalY} value={this.state.y} /></div>
                <div className="goal_value_heading"><input className="input_field" type="text" onChange={this.onChangeGoalHeading} value={this.state.heading} /></div>
                <div className="goal_button"><button className="button action_button" onClick={this.go_to_target}>Go To</button></div>
            </div>
        );
    }

    go_to_target() {
        GoToTargetFunction(NavigationControlInstance.state.x, NavigationControlInstance.state.y, NavigationControlInstance.state.heading)
    }

    onChangeGoalX(e) {
        NavigationControlInstance.setState({x: e.target.value});
    }
    onChangeGoalY(e) {
        NavigationControlInstance.setState({y: e.target.value});
    }
    onChangeGoalHeading(e) {
        NavigationControlInstance.setState({heading: e.target.value});
    }
}

class SaveMap extends Component {

    render() {
        return (
            <div className="save">
                <div className="save_button">
                    <button className="button action_button" onClick={this.map_save}>Save Map</button>
                </div>
            </div>
        );
    }

    map_save() {
        SaveMapFunction();
    }
}


class GameBoard extends Component {
    constructor(props) {
        super(props);
        document.onkeydown = this.checkKeyDown;
        document.onkeyup = this.checkKeyUp;
    }

    //key down
    checkKeyDown = (e) => {
        e = e || window.event;
        if (e.keyCode === '38') {// up arrow
            this.move_forward_down();
        }
        else if (e.keyCode === '40') {// down arrow
            this.move_backward_down();
        }
        else if (e.keyCode === '37') {// left arrow
            this.move_left_down();
        }
        else if (e.keyCode === '39') {// right arrow
            this.move_right_down();
        }
        else if (e.keyCode === '71'){//g or G
            this.go_to_target();
        }
    }
    //key up
    checkKeyUp = (e) => {
        e = e || window.event;
        if (e.keyCode === '38') {// up arrow
            this.move_stop_down();
        }
        else if (e.keyCode === '40') {// down arrow
            this.move_stop_down();
        }
        else if (e.keyCode === '37') {// left arrow
            this.move_stop_down();
        }
        else if (e.keyCode === '39') {// right arrow
            this.move_stop_down();
        }
    }

    render() {
        const { classes } = this.props;
        let redirectVar = null;
        if(!localStorage.getItem('email')){
            redirectVar = <Redirect to= "/"/>
        }

        return (
            <div>
                {redirectVar}
                <UserNavbar/>
                <div>
                    <h1 style={{"text-align": "center"}}> Robot Status </h1>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableBody>
                                <TableRow>
                                    <TableCell>Active Robots</TableCell>
                                    <TableCell align="left">5</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Inactive Robots</TableCell>
                                    <TableCell align="left">0</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Connected Robots</TableCell>
                                    <TableCell align="left">1</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Stopped Robots</TableCell>
                                    <TableCell align="left">1</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <div>
                    <Typography variant="h1" className={classes.title}>Tracking</Typography>
                </div>
                <div className="background">
                    <div className="whiteboard">
                        <div className="top">
                            {/* <Controller/> */}
                            <Odometry/>
                        </div>
                        {/* <div className="bottom">
                            <Navigation/>
                            <SaveMap/>
                        </div> */}
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(useStyles)(GameBoard);
