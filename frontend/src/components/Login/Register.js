import React, { Component } from 'react';
// import { connect } from 'react-redux';
import logo from  "./binaryHeartLogo80.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "./style.scss";

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            passwordConfirm: "",
			firstName: "",
			lastName: "",
            message: "",
			skill: 0,
            hideNotify: true,
        }

        this.handleChange = this.handleChange.bind(this);
        this.register = this.register.bind(this);
        this.hideNotification = this.hideNotification.bind(this);
        this.backToLogin = this.backToLogin.bind(this);
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    hideNotification() {
        this.setState({ hideNotify: true });
    }

    async register() {
        if(this.state.password !== this.state.passwordConfirm) {
            this.setState({ hideNotify: false, message: "The passwords do not match! Please try again." });
            return;
        }
        try {
            const data = {email: this.state.email, password: this.state.password, firstName: this.state.firstName, lastName: this.state.lastName, skill: this.state.skill};
            const response = await fetch("/api/auth/register", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const resData = await response.json();
            if(resData.errors) {
                this.setState({ hideNotify: false, message: resData.errors[0].msg });
            }
            else if(response.status === 200) {
                this.props.history.push("/");
            }
        }
        catch(e) {
            this.setState({ hideNotify: false, message: String(e) });
        }
    }

    backToLogin() {
        this.props.history.push("/");
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
                    <p className="control">
                        <input value={this.state.firstName} name="firstName" onChange={this.handleChange} id="firstInput" className="input is-size-4 loginInput" type="text" placeholder="First Name"/>
                        <input value={this.state.lastName} name="lastName" onChange={this.handleChange} id="lastInput" className="input is-size-4 loginInput" type="text" placeholder="Last Name"/>
                    </p>
                </div>
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
                <div className="field loginField">
                    <p className="control has-icons-left">
                        <input value={this.state.passwordConfirm} name="passwordConfirm" onChange={this.handleChange} id="passwordInput" className="input is-size-4 loginInput" type="password" placeholder="Confirm Password"/>
                        <span id="passwordIcon" className="icon is-size-4 is-left">
                            <FontAwesomeIcon icon="lock"/>
                        </span>
                    </p>
                </div>
                <div className="control">
                        <div className="select">
                            <select name="skill" value={this.state.skill} onChange={this.handleChange}>
                                <option value={0}>0 - Noob</option>
                                <option value={1}>1 - Learning the Ropes</option>
                                <option value={2}>2 - Tech Guru</option>
                                <option value={3}>3 - Partner</option>
                            </select>
                        </div>
                    </div>
                <div className="buttons is-centered loginButtons">
                    <div id="backButton" className="button is-size-4 is-rounded" onClick={this.backToLogin}>
                        <span id="backIcon" className="icon">
                            <FontAwesomeIcon icon="angle-double-left"/>
                        </span>
                        <span>Back</span>
                    </div>
                    <div onClick={this.register} id="loginButton" className="button is-size-4 is-rounded">
                        Register
                    </div>
                </div>
            </div>
        );
    }
}

export default Register;