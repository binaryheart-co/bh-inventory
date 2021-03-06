import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Login from "./components/Login/Login";
import LogDevice from "./components/LogDevice";
import Inventory from "./components/Inventory/Inventory";
import Tasks from "./components/Tasks/Tasks";
import AddTask from "./components/Tasks/AddTask";
import SubmitTask from "./components/Tasks/SubmitTask";
import Dashboard from "./components/Login/Dashboard";
import Register from "./components/Login/Register";
import Error404 from "./components/Error404";

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/" component={Login} exact/>
                    <Route path="/tasks" component={Tasks}/>
                    <Route path="/inventory" component={Inventory}/>
                    <Route path="/logdevice" component={LogDevice}/>
					<Route path="/addtask" component={AddTask}/>
					<Route path="/submit" component={SubmitTask}/>
					<Route path="/dashboard" component={Dashboard}/>
					<Route path="/register" component={Register}/>
                    <Route component={Error404}/>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
