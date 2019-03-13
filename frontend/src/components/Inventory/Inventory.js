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
			
			const coding =
            i.code === -4 ? "#E0666":
            i.code === -3 ? "#F6B26B":
            i.code === -2 ? "#E0666":
            i.code === -1 ? "#F6B26B":
            i.code === 0 ? "#FFFFF":
            i.code === 1 ? "#FFD966":
            i.code === 2 ? "#A4C2F4":
            i.code === 3 ? "#A64D79":
            i.code === 4 ? "#674EA7":
            i.code === 5 ? "#FF00FF":
            "#183A5F";
			
			rows.push(
				<Inventrow i={i} key={i.fullID} coding={coding}/>
			);
  		});

        return (
            <div>
                <div className="button" style={{float: "right"}}><Link to="/logdevice">Log new Device</Link></div>
                <div className="bar">
					<div className="ico">
						<Link to="/dashboard"><img alt="BinaryHeart logo" className="icon" src={logo}/></Link>
						<br/>
						<Link to="/tasks"><FontAwesomeIcon icon="tasks" color="white" className="iconic"/></Link>
						<br/>
						<Link to="/inventory"><FontAwesomeIcon icon="box-open" color="white" className="iconic"/></Link>
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