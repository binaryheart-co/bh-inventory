import React, { Component } from 'react';
import { Link } from "react-router-dom";
import logo from './binaryheart.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
			subject: "James",
            tasks: [],
        }
        this.getTasks = this.getTasks.bind(this);
        this.claimTask = this.claimTask.bind(this);
        this.whoAmI = this.whoAmI.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
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
                return this.setState({tasks: resData.tasks});
            }
            else {
                return alert(JSON.stringify(resData.errors));
            }
        }
        catch(e) {
            return console.error(e);
        }
    }

    async claimTask() {
        try {
            const response = await fetch("/api/tasks", { method: "POST" });
            const resData = await response.json();

            //if user isn't logged in
            if(response.status === 401) {
                return this.props.history.push("/");
            }
            else if(response.status === 200) {
                return this.getTasks();
            }
            else {
                return alert(JSON.stringify(resData.errors));
            }
        }
        catch(e) {
            return console.error(e);
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
                return this.setState({ subject: resData.firstName });
            }
        }
        catch(e) {
            console.error(e);
        }
    }

    // async logout() {
    //     try {
    //         const response = await fetch("/api/user/protected", {
    //             method: "GET",
    //         });
    //         const resData = await response.json();
    //         if(response.status === 401) {
    //             this.props.history.push("/");
    //         }
    //         else if(response.status === 200) {
    //             return this.setState({ subject: resData.firstName });
    //         }
    //     }
    //     catch(e) {
    //         console.error(e);
    //     }
    // }

    componentDidMount() {
        this.whoAmI();
        this.getTasks();
    }

    render() {
        const taskRows = this.state.tasks.map((element) => {
            let noteText = "";
            for(let n = 0; n < element.notes.length; n++) {
                const date = new Date(element.notes[n].createdAt);
                const dateText = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
                noteText += `${dateText}: ${element.notes[n].note}\n`;
            }
            return (
                <tr key={element.fullID}>
                    <td>{element.names.join(", ")}</td>
                    <td>{element.fullID}</td>
                    <td>{element.code}</td>
                    <td>{noteText}</td>
                    <td>{element.description}</td>
                </tr>
            );
        })

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
            {/* <div className="button" style={{float: "right"}}><Link to="/addtask">Add Task</Link></div> */}
			<center>
				<br/>
				<br/>
				<h1 style={{fontSize:80}}>Welcome {this.state.subject}! <FontAwesomeIcon icon="glasses"/></h1>
				<code style={{fontSize:40}}>ZNS <strong>v1.0</strong> !</code>
                <div style={{width: "60%"}}>
                    <table className="table" width="100%">
                        <thead>
                            <tr>
                            <th>Volunteers</th>
                            <th>Device ID</th>
                            <th>Code</th>
                            <th>Notes</th>
                            <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {taskRows}
                        </tbody>
                    </table>
                    <nav className="level">
                        <div className="level-left">
                            <div className="level-item has-text-centered">
                                <Link to="/submit"><input className="button is-success" defaultValue="Submit Task"/></Link>
                            </div>
                            
                            <div className="level-item has-text-centered">
                                <button className="button is-info" onClick={this.claimTask}>Claim Task</button>
                            </div>
                        </div>
                        <div className="level-right">
                            <div className="level-item has-text-centered">
                                <input className="button is-dark" type="submit" value="Log Out" onClick={() => alert("Say bye to Marzuk")}/>
                            </div>
                        </div>
                    </nav>
                </div>
			</center>
		</div>
        );
    }
}

export default Dashboard;