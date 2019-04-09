import React, { Component } from 'react';
import { Link } from "react-router-dom";
import logo from '../Inventory/binaryheartWhite.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class SubmitTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [{}],
            loaded: 0,
            newCode: 0,
            newNote: "",
            newDescription: "",
            newValue: 0,
        }
        this.getTasks = this.getTasks.bind(this);
        this.quitTask = this.quitTask.bind(this);
        this.submitTask = this.submitTask.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.changeDevice = this.changeDevice.bind(this);
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    changeDevice(e) {
        this.handleChange(e);
        this.setState({
            newCode: this.state.tasks[e.target.value].code,
            newNote: "",
            newDescription: this.state.tasks[e.target.value].description,
            newValue: this.state.tasks[e.target.value].estValue
        });
    }

    async getTasks() {
        try {
            const response = await fetch("/api/tasks", { method: "GET" });
            const resData = await response.json();

            //if user isn't logged in
            if(response.status === 401) {
                return this.props.history.push("/");
            }
            else if(response.status === 200) {
                return this.setState({
                    tasks: resData.tasks,
                    newCode: resData.tasks[this.state.loaded].code,
                    newNote: "",
                    newDescription: resData.tasks[this.state.loaded].description,
                    newValue: resData.tasks[this.state.loaded].estValue
                });
            }
            else {
                return alert(JSON.stringify(resData.errors));
            }
        }
        catch(e) {
            return console.error(e);
        }
    }

    async quitTask() {
        try {
            const deviceID = this.state.tasks[this.state.loaded].fullID;
            const response = await fetch(`/api/tasks/${deviceID}`, { method: "DELETE" });
            const resData = await response.json();

            //if user isn't logged in
            if(response.status === 401) {
                return this.props.history.push("/");
            }
            else if(response.status === 200) {
                return this.props.history.push("/dashboard");
            }
            else return alert(JSON.stringify(resData.errors));
        }
        catch(e) {
            return console.error(e);
        }
    }

    async submitTask() {
        try {
            let data = { updatedAt: this.state.tasks[this.state.loaded].updatedAt };
            if(String(this.state.tasks[this.state.loaded].code) !== String(this.state.newCode)) data.code = this.state.newCode;
            if("" !== String(this.state.newNote)) data.note = this.state.newNote;
            if(String(this.state.tasks[this.state.loaded].description) !== String(this.state.newDescription)) data.description = this.state.newDescription;
            if(String(this.state.tasks[this.state.loaded].estValue) !== String(this.state.newValue)) data.estValue = this.state.newValue;

            const deviceID = this.state.tasks[this.state.loaded].fullID;
            const response = await fetch(`/api/tasks/${deviceID}`, { 
                method: "PUT",
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const resData = await response.json();

            //if user isn't logged in
            if(response.status === 401) {
                return this.props.history.push("/");
            }
            else if(response.status === 200) {
                return this.props.history.push("/dashboard");
            }
            else return alert(JSON.stringify(resData.errors));
        }
        catch(e) {
            return console.error(e);
        }
    }

    componentDidMount() {
        this.getTasks();
    }

    render() {
        const tasks = this.state.tasks.map((e, i) => {
            return <option value={i} key={i}>{e.fullID}</option>
        });

        let notes = this.state.tasks[this.state.loaded].notes;
        notes = notes ? notes : [];
        let noteText = "";
        for(let n = 0; n < notes.length; n++) {
            const date = new Date(notes[n].createdAt);
            const dateText = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
            noteText += `${dateText}: ${notes[n].note}\n`;
        }

        const codeColor = String(this.state.tasks[this.state.loaded].code) === String(this.state.newCode) ? "" : "purple";
        const noteColor = "" === String(this.state.newNote) ? "" : "purple";
        const descriptionColor = String(this.state.tasks[this.state.loaded].description) === String(this.state.newDescription) ? "" : "purple";
        const valueColor = String(this.state.tasks[this.state.loaded].estValue) === String(this.state.newValue) ? "" : "purple";

        return (
		<div>
			<div className="bar">
				<div className="ico">
					<Link to="/dashboard"><img alt="BinaryHeart logo" className="icon" src={logo}/></Link>
					<br/>
					<Link to="/tasks"><FontAwesomeIcon icon="tasks" color="white" className="iconic"/></Link>
					<br/>
					<Link to="/inventory"><FontAwesomeIcon icon="box-open" color="white" className="iconic"/></Link>
				</div>
			</div>
			<center>
			<div className="mainScreen">
			  <button className="quitButton" onClick={this.quitTask}>Quit Task</button>
			  <button className="helpButton" onClick={() => window.location = "http://binaryheart.miraheze.org"}>I need help</button>
			  <table className="table">
              <thead>
                  <tr>
                    <th></th>
                    <th>Existing Entry</th>
                    <th>New Entry</th>
                    </tr>
                </thead>
			  <tbody>
				<tr>
				  <td><b>ID</b></td>
				  <td>{this.state.tasks[this.state.loaded].fullID}</td>
                  <td><select onChange={this.changeDevice} name="loaded">{tasks}</select></td>
				</tr>
				<tr>
				  <td><b>Status</b></td>
                  <td>{this.state.tasks[this.state.loaded].code}</td>
				  <td>
					<select value={this.state.newCode} onChange={this.handleChange} name="newCode" style={{borderColor: codeColor}}>
					  <option value="5">5: Ready to Donate</option>
					  <option value="4">4: OS Activated</option>
					  <option value="3">3: OS Installed</option>
					  <option value="2">2: Works</option>
					  <option value="1">1: Broken</option>
					  <option value="0">0: Unknown</option>
					  <option value="-1">-1: Needs Salvage</option>
					  <option value="-2">-2: Salvaged</option>
					  <option value="-3">-3: Needs Ebay</option>
					</select>
				  </td>
				</tr>
                <tr>
				  <td><b>Notes</b></td>
                  <td>{noteText}</td>
				  <td><input type="text" onChange={this.handleChange} name="newNote" value={this.state.newNote} style={{borderColor: noteColor}}/></td>
				</tr>
                <tr>
				  <td><b>Description</b></td>
                  <td>{this.state.tasks[this.state.loaded].description}</td>
				  <td><input type="text" onChange={this.handleChange} name="newDescription" value={this.state.newDescription} style={{borderColor: descriptionColor}}/></td>
				</tr>
                <tr>
				  <td><b>Value</b></td>
                  <td>{`$${this.state.tasks[this.state.loaded].estValue}`}</td>
				  <td><input type="text" onChange={this.handleChange} name="newValue" value={this.state.newValue} style={{borderColor: valueColor}}/></td>
				</tr>
				</tbody>
			  </table>
			</div>
			<input className="button is-dark" type="submit" value="Submit" onClick={this.submitTask}/>
			<div className="guide">Wiki can be embeded here
			</div>
			</center>
		</div>
        );
    }
}

export default SubmitTask;