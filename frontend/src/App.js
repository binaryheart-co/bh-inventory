import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Login from "./components/Login/Login";
import LogDevice from "./components/LogDevice";
import Inventory from "./components/Inventory/Inventory";
import Tasks from "./components/Tasks/Tasks";
import AddTask from "./components/Tasks/AddTask";
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
                    <Route component={Error404}/>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
