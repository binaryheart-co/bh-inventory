import React, { Component } from 'react';
// import { connect } from 'react-redux';

import logo from  "./binary.svg";

class Login extends Component {
    render() {
        return (
            <section className="section">
                <div className="container">
                    <h1 className="title">
                        <img src={logo} width="50" alt="BinaryHeart Logo"/> BinaryHeart
                    </h1>
                    <p className="custom-css">
                        This is a <u><strong>lame</strong></u> login page :(
                    </p>
                    <form>
                        <div className="field">
                            <input className="input" type="text" placeholder="Email" />
                        </div>
                        <div className="field">
                            <input className="input" type="password" placeholder="Password" />
                        </div>
                        <div className="field">
                            <button className="button is-link">Login</button>
                            <button className="button is-text">Create Account</button>
                        </div>
                    </form>
                </div>
            </section>
        );
    }
}

export default Login;
