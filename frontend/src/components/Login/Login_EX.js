import React, { Component } from 'react';
// import { connect } from 'react-redux';

// import logo from  "./binary.svg";

class Login extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            text: "",
            hidden: false,
        }
    }

    helloWorld(n)
    {
        return "this is a function" + n;
    }

    f()
    {
        this.setState({
            hidden: true
        })
        // console.log("the button has been pressed");
    }

    textChanged(e)
    {
        this.setState({
            text: e.target.value,
            hidden: !this.state.hidden
        });
    }

    render() {
        return (
            <div style={{fontWeight: "bold", fontStyle: "italics", display: this.state.hidden ? "none" : ""}}>
                <button type="button" id="1" onClick={this.f.bind(this)}>ACTION!</button>
                Hello World
                <br/>
                <em>Hi!</em>
                <br/>
                {this.state.text}<br/>
                <input value={this.state.text} id="2" type="text" onChange={this.textChanged.bind(this)}/>
            </div>
        );
    }
}

export default Login;
