import React, { Component } from 'react';

//props: isHidden, type, message, hideFunc

class Notification extends Component {
    render() {
        return (
            <div className={"notification " + this.props.type} style={{display: this.props.isHidden ? "none" : "block"}}>
                <button className="delete" onClick={this.props.hideFunc}></button>
                <strong>{this.props.message}</strong>
            </div>
        );
    }
}

export default Notification;
