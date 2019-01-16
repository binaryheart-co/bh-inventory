import React, { Component } from 'react';
// import { connect } from 'react-redux';

import config from "../../config";

import logo from  "./binaryHeartLogo80.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "./style.scss";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
        }

        this.handleChange = this.handleChange.bind(this);
        this.login = this.login.bind(this);
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    login() {
        const data = {username: this.state.email, password: this.state.password};
        fetch(config.serverLocation + "/auth/login", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
        .then(res => console.log(JSON.stringify(res)))
        .catch(err => console.error("Error: " + err));
    }

    render() {
        return (
            <div className="card">
                <a href="https://binaryheart.org"><img src={logo} alt="binaryheart.org"/></a>
                <div className="field">
                    <p className="control has-icons-left">
                        <input value={this.state.email} name="email" onChange={this.handleChange} id="emailInput" className="input is-size-4" type="email" placeholder="Email"/>
                        <span id="emailIcon" className="icon is-size-4 is-left">
                            <FontAwesomeIcon icon="envelope"/>
                        </span>
                    </p>
                </div>
                <div className="field">
                    <p className="control has-icons-left">
                        <input value={this.state.password} name="password" onChange={this.handleChange} id="passwordInput" className="input is-size-4" type="password" placeholder="Password"/>
                        <span id="passwordIcon" className="icon is-size-4 is-left">
                            <FontAwesomeIcon icon="lock"/>
                        </span>
                    </p>
                </div>
                <div className="buttons is-centered">
                    <div id="backButton" className="button is-size-4 is-rounded">
                        <span id="backIcon" className="icon">
                            <FontAwesomeIcon icon="angle-double-left"/>
                        </span>
                        <span>Back</span>
                    </div>
                    <div onClick={this.login} id="loginButton" className="button is-size-4 is-rounded">
                        Login
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
