import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Login from "./components/Login/Login";
import Inventory from "./components/Inventory";
import Tasks from "./components/Tasks";
import Error404 from "./components/Error404";

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/" component={Login} exact/>
                    <Route path="/inventory" component={Inventory}/>
                    <Route path="/tasks" component={Tasks}/>
                    <Route component={Error404}/>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
