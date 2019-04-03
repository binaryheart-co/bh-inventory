import React, { Component } from 'react';
import { Link } from "react-router-dom";
import logo from './binaryheart.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: "Loading...",
			subject: "James",
            deviceid: "",
            task: "",
            difficulty: 1
        }
        this.getData = this.getData.bind(this);
        this.whoAmI = this.whoAmI.bind(this);
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
	
    async whoAmI() {
        try {
            const response = await fetch("/api/user/protected", {
                method: "GET",
            });
            const resData = await response.json();
            if(response.status === 401) {
                this.props.history.push("/");
            }
            else if(response.status === 200) {
                const newData = resData.email + " has accessed the tasks page. ";
                return this.setState({ data: newData, subject: resData.firstName });
            }
        }
        catch(e) {
            return this.setState({ data: String(e) });
        }
    }

    componentDidMount() {
		this.whoAmI();
        this.getData();
    }

    render() {
        return (
		<div>
			<div className="bar">
				<div className="ico">
					<Link to="/dashboard"><img alt="BinaryHeart logo" className="icon" src={logo} /></Link>
					{/*style={{filter: "brightness(50%) sepia(100) saturate(100) hue-rotate(20deg)"}}*/}
					<br/>
					<Link to="/tasks"><FontAwesomeIcon icon="tasks" color="white" className="iconic"/></Link>
					<br/>
					<Link to="/inventory"><FontAwesomeIcon icon="box-open" color="white" className="iconic"/></Link>
				</div>
			</div>
            <div className="button" style={{float: "right"}}><Link to="/addtask">Add Task</Link></div>
			<center>
				<br/>
				<br/>
				<h1 style={{fontSize:80}}>Welcome {this.state.subject}! <FontAwesomeIcon icon="glasses"/></h1>
				<code style={{fontSize:40}}>You have <strong>3</strong> VoW pts</code>
				<table className="table" width="60%">
				  <thead>
					<tr>
					  <th>Task</th>
					  <th>Device ID</th>
					  <th>Done by</th>
					  <th>Completed?</th>
					</tr>
				  </thead>
				  <tbody>
					<tr>
					  <td width="20%">Salvage</td>
					  <td width="20%">20200419</td>
					  <td width="40%">Nikita Feoktistov</td>
					  <td width="20%">No</td>
					</tr>
				  </tbody>
				</table>
			</center>
			<nav className="level">
				<div className="level-item has-text-centered">
					<Link to="/submit"><input className="button is-info" value="Submit Task"/></Link>
				</div>
				<div className="level-item has-text-centered">
					<input className="button is-dark" type="submit" value="Log Out" onClick={() => alert("Say bye to Marzuk")}/>
				</div>
			</nav>
		</div>
        );
    }
}

export default Dashboard;