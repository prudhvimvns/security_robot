import React, {Component} from 'react';
import { Switch, Route }  from 'react-router-dom';
import LandingPage from './LandingPage/LandingPage';
import UserDashboard from './Dashboard/UserDashboard';
import AdminDashboard from './Dashboard/AdminDashboard';
import Profile from './Profile/Profile';
import Help from './Message/Help';
import Simulations from './Simulation/simulations';
import Logs from './Log/logs';
import Gameboard from './Movement/navigation'
import Robot from './Robot/robot'

//Create a Main Component
const Main = () => {
    
    return(
        <div>
            <Switch>
                {/*Render Different Component based on Route*/}
                <Route path="/simulations">
                    <Simulations/>
                </Route>
                <Route path="/robot">
                    <Robot/>
                </Route>
                <Route path="/logs">
                    <Logs/>
                </Route>
                <Route path="/navigation">
                    <Gameboard/>
                </Route>
                <Route path="/user-dashboard">
                    <UserDashboard/>
                </Route>
                <Route path="/admin-dashboard">
                    <AdminDashboard/>
                </Route>
                <Route path="/profile">
                    <Profile/>
                </Route>
                <Route path="/help">
                    <Help/>
                </Route>
                {/*Root path should be put at last*/}
                <Route path="/">
                    <LandingPage/>
                </Route>
            </Switch>
        </div>
    )
    
}
//Export The Main Component
export default Main;