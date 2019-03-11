import React, { Component } from 'react';
import { Link } from "react-router-dom";

class AddTask extends Component {
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
                <div className="button"><Link to="/tasks">{"<"} Tasks</Link></div>
				<h1 className="title is-1" style={{fontFamily:'Garamond'}}> >> Add new Task</h1>
				<div className="control">
					<input name="deviceid" style={{width:'auto', textAlign:'center', margin:'auto', display:'block'}} onChange={this.handleChange} className="input is-primary" type="text" placeholder="Device ID" />
					<input name="task" onChange={this.handleChange} className="input is-info" type="text" placeholder="Task" />
                    <div className="control">
                        <div className="select">
                            <select name="difficulty" defaultValue={1} onChange={this.handleChange}>
                                <option value={0}>0</option><option value={1}>1</option>
                                <option value={2}>2</option><option value={3}>3</option><option value={4}>4</option>
                            </select>
                        </div>
                    </div>
				</div>
				<input className="button is-dark is-fullwidth" type="submit" value="Add" onClick={this.getData}/>
			</div>
        );
    }
}

export default AddTask;