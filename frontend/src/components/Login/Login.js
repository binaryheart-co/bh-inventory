import React, { Component } from 'react';
// import { connect } from 'react-redux';

import logo from  "./binaryHeartLogo80.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "./style.scss";

class Login extends Component {
    render() {
        return (
            <div class="card">
                <a href="https://binaryheart.org"><img src={logo} alt="binaryheart.org"/></a>
                <div class="field">
                    <p class="control has-icons-left">
                        <input id="emailInput" class="input is-size-4" type="email" placeholder="Email"/>
                        <span id="emailIcon" class="icon is-size-4 is-left">
                            <FontAwesomeIcon icon="envelope"/>
                        </span>
                    </p>
                </div>
                <div class="field">
                    <p class="control has-icons-left">
                        <input id="passwordInput" class="input is-size-4" type="password" placeholder="Password"/>
                        <span id="passwordIcon" class="icon is-size-4 is-left">
                            <FontAwesomeIcon icon="lock"/>
                        </span>
                    </p>
                </div>
                <p class="buttons is-centered">
                    <div id="backButton" class="button is-size-4 is-rounded">
                        <span id="backIcon" class="icon">
                            <FontAwesomeIcon icon="angle-double-left"/>
                        </span>
                        <span>Back</span>
                    </div>
                    <div id="loginButton" class="button is-size-4 is-rounded">
                        Login
                    </div>
                </p>
            </div>
        );
    }
}

export default Login;
