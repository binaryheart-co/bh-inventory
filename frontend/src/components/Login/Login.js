import React, { Component } from 'react';
// import { connect } from 'react-redux';

import logo from  "./binaryHeartLogo80.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "./style.scss";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            message: "",
            hideNotify: true,
        }

        this.handleChange = this.handleChange.bind(this);
        this.login = this.login.bind(this);
        this.hideNotification = this.hideNotification.bind(this);
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    hideNotification() {
        this.setState({ hideNotify: true });
    }

    async login() {
        try {
            const data = {email: this.state.email, password: this.state.password};
            const response = await fetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const resData = await response.json();
            console.log(resData);
            if(resData.errors) {
                this.setState({ hideNotify: false, message: resData.errors[0].msg });
            }
            else if(response.status === 200) {
                this.props.history.push("/inventory");
            }
        }
        catch(e) {
            this.setState({ hideNotify: false, message: e });
        }
    }

    render() {
        return (
            <div className="card" id="loginCard">
                <div className="notification is-danger" style={{display: this.state.hideNotify ? "none" : "block"}}>
                    <button className="delete" onClick={this.hideNotification}></button>
                    <strong>{this.state.message}</strong>
                </div>
                <a href="https://binaryheart.org"><img id="bhLogo" src={logo} alt="binaryheart.org"/></a>
                <div className="field loginField">
                    <p className="control has-icons-left">
                        <input value={this.state.email} name="email" onChange={this.handleChange} id="emailInput" className="input is-size-4 loginInput" type="email" placeholder="Email"/>
                        <span id="emailIcon" className="icon is-size-4 is-left">
                            <FontAwesomeIcon icon="envelope"/>
                        </span>
                    </p>
                </div>
                <div className="field loginField">
                    <p className="control has-icons-left">
                        <input value={this.state.password} name="password" onChange={this.handleChange} id="passwordInput" className="input is-size-4 loginInput" type="password" placeholder="Password"/>
                        <span id="passwordIcon" className="icon is-size-4 is-left">
                            <FontAwesomeIcon icon="lock"/>
                        </span>
                    </p>
                </div>
                <div className="buttons is-centered loginButtons">
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