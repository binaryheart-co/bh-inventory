import React, { Component } from 'react';
import { Link } from "react-router-dom";
import logo from '../Inventory/binaryheartWhite.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class SubmitTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deviceid: "",
            task: "",
            difficulty: 1,
        }
        this.getData = this.getData.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    async getData() {
        try {
            const data = { 
                deviceid: this.state.deviceid,
                task: this.state.task,
                difficulty: this.state.difficulty,
            };
            const response = await fetch("/api/tasks", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const resData = await response.json();
            if(response.status === 401) {
                this.props.history.push("/");
            }
            else if(response.status === 400) {
                return alert(JSON.stringify(resData.errors));
            }
            else if(response.status === 200) {
                return alert(resData.fullID);
            }
        }
        catch(e) {
            console.error(e);
        }
    }

    render() {
        return (
		<div>
			<div className="bar">
			<div className="ico">
			<img alt="BinaryHeart logo" className="icon" src={logo}/>
			<br/>
			<FontAwesomeIcon icon="tasks" color="white" className="iconic"/>
			<br/>
			<FontAwesomeIcon icon="box-open" color="white" className="iconic"/>
			</div>
			</div>
			<center>
			<div className="mainScreen">
			  <button className="quitButton">Quit Task</button>
			  <button className="helpButton">I need help</button>
			  <table className="table">
			  <tbody>
				<tr>
				  <td>Task</td>
				  <td>Salvage</td>
				</tr>
				<tr>
				  <td>ID</td>
				  <td>20200419</td>
				</tr>
				<tr>
				  <td>Updated<br/>Status</td>
				  <td>
					<select>
					  <option value="5">Ready to Donate</option>
					  <option value="4">OS Activated</option>
					  <option value="3">OS Installed</option>
					  <option value="2">Works</option>
					  <option value="1">Broken</option>
					  <option value="0">Unknown</option>
					  <option value="-1">Needs Salvage</option>
					  <option value="-2">Salvaged</option>
					  <option value="-3">Needs Ebay</option>
					</select>
				  </td>
				</tr>
				<tr>
				  <td>Notes</td>
				  <td><input type="text"/></td>
				</tr>
				</tbody>
			  </table>
			</div>
			<input className="button is-dark" type="submit" value="Submit" onClick={this.getData}/>
			<div className="guide">Wiki can be embeded here
			</div>
			</center>
		</div>
        );
    }
}

export default SubmitTask;