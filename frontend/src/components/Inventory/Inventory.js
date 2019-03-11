import React, { Component } from 'react';
import './tablestyle.scss';
import './binary.svg';
import logo from './binaryheartWhite.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from "react-router-dom";
import Inventrow from "./Inventrow";
import tempd from "./nikita.json";

class Inventory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            devices: [],
        }
    }

    async getData() {
        try {
            const response = await fetch("/api/devices", {
                method: "GET"
            });
            const resData = await response.json();
            if(response.status === 401) {
                this.props.history.push("/");
            }
            else if(response.status === 200) {
                return this.setState({ devices: resData.devices });
            }
        }
        catch(e) {
            console.error(e);
        }
    }

    componentDidMount() {
        this.getData().then();
    }

    render() {
        const rows = [];
  		tempd.forEach((i) => {
			rows.push(
				<Inventrow i={i} key={i.fullID} />
			);
  		});

        return (
            <div>
                <div className="button" style={{float: "right"}}><Link to="/logdevice">Log new Device</Link></div>
                <div className="bar">
					<div className="ico">
					<img alt="BinaryHeart logo" className="icon" src={logo}/>
					<FontAwesomeIcon icon="tasks" color="white" className="iconic"/>
					<FontAwesomeIcon icon="box-open" color="white" className="iconic"/>
					</div>
                </div>
				<br/>
				<br/>
				<div className="wrapper">
				<table className="mainTable">
				  <thead>
					<tr className="roundy">
					  <th width="6%">Date</th>
					  <th width="10%">ID</th>
					  <th width="5%">Code</th>
					  <th>User</th>
					  <th>Status</th>
					  <th width="30%">Notes</th>
					  <th>Description</th>
					  <th width="7%">Receiver</th>
					  <th>Money</th>
					</tr>
				  </thead>
				  <tbody>
					{rows}
				  </tbody>
				</table>
				</div>
                <div className="down">
                  <FontAwesomeIcon icon="angle-down" id="downArrow"/>
                </div>
                <div className="dim" id="dim">
                </div>
            </div>
        );
    }
}

export default Inventory;