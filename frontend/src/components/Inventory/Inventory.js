import React, { Component } from 'react';
import './tablestyle.scss';
import './binary.svg';
import logo from './binaryheartWhite.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from "react-router-dom";
import Inventrow from "./Inventrow";

class Inventory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            devices: [],
        }
    }

    async getData() {
        try {
            const data = { items: 50 }
            const response = await fetch("/api/inventory/list", {
                method: "GET",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const resData = await response.json();
            console.log("getting data");
            console.log(resData);
            if(response.status === 401) {
                this.props.history.push("/");
            }
            else if(response.status === 200) {
                return this.setState({ devices: resData.devices });
            }
        }
        catch(e) {
            console.error(e);
            return this.setState({ data: String(e) });
        }
    }

    componentDidMount() {
        this.getData().then();
    }

    render() {
        console.log(this.state.devices);
        const rows = [];
  		this.state.devices.forEach((i) => {
			rows.push(
				<Inventrow i={i} key={i.id} />
			);
  		});

        return (
            <div>
                {this.state.data} <Link to="/logdevice">Log new Device</Link>

                <div className="bar">
					<div className="ico">
					<img alt="BinaryHeart logo" className="icon" src={logo}/>
					<FontAwesomeIcon icon="tasks" color="white" className="iconic"/>
					<br/>
					<FontAwesomeIcon icon="box-open" color="white" className="iconic"/>
					</div>
                </div>
				<table className="mainTable">
				  <thead>
					<tr>
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