import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../Inventory/binaryheartWhite.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import t from './Tasks.json';

class Taskrow extends Component {
    constructor(props) {
        super(props);
        this.state = {
			clicked: false
        }
    }
	render() {
		const task = this.props.task
		const difficult = task.Difficulty === 1
			? <td bgcolor="#57BB8A">1</td>
			: ( task.Difficulty === 2
				? <td bgcolor="#F7B96A">2</td>
				: ( task.Difficulty === 3
					? <td bgcolor="#EF9B6E">3</td>
					: ( task.Difficulty === 4
						? <td bgcolor="#E67C73">4</td>
						: <td>{task.Difficulty}</td>
					)
				)
			)
		const work = this.state.clicked === true ? (task.Worker==="" ? this.props.name : task.Worker+" & "+this.props.name) : task.Worker;
		return (
			<tr>
				<th>{task.Number}</th><td></td>
				<td><Link to="/inventory" title="It's on you, Nikita!">{task.ID}</Link></td><td></td>
				<td>{task.Task}</td>
				{difficult}
				<td onClick={() => this.setState({clicked: true})}>{work}</td>
			</tr>
		);
	}
}


class Tasktable extends Component {
	render() {
		const rows = [];
		this.props.tasks.forEach((task) => {
			rows.push(
				<Taskrow name={this.props.name} task={task} key={task.Number} />
			);
		});
	return (
		<tbody>
			<tr>
				<th>A</th><td></td>
				<td>test</td><td></td>
				<td>row</td>
				<td>9000</td>
				<td>{this.props.name}</td>
			</tr>
			{rows}
		</tbody>
	);
	}
}


class Tasks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: "Loading...",
			subject: "Husnain",
			hideNotify: false
        }
        this.hideNotification = this.hideNotification.bind(this);
    }

    hideNotification() {
        this.setState({ hideNotify: true });
    }
	
    async getData() {
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
        this.getData();
    }

    render() {
        return (
			<div>
			
				<div className="notification is-link" style={{display: this.state.hideNotify ? "none" : "block", textAlign: "center"}}>
					<button className="delete" onClick={this.hideNotification}></button>
					<strong>Returning Member</strong>: Complete attendance form at <strong>
					<a href="http://binaryheart.org/here" onClick={this.hideNotification}>binaryheart.org/here</a></strong>
				</div>
				<div className="bar">
					<div className="ico">
						<Link to="/dashboard"><img alt="BinaryHeart logo" className="icon" src={logo}/></Link>
						<br/>
						<FontAwesomeIcon icon="tasks" color="crimson"/>
						<br/>
						<Link to="/inventory"><FontAwesomeIcon icon="box-open" color="white" className="iconic"/></Link>
					</div>
				</div>
				<center>
				<div>
					{this.state.data}
					<Link to="/addtask"><FontAwesomeIcon icon="tasks"/></Link>
				</div>
				<div>
				    <table className="table">
						<thead><tr>
							<th>#</th><th></th>
							<th>Device ID</th><th></th>
							<th>Task</th>
							<th>Difficulty</th>
							<th>Worker</th>
						</tr></thead>
							<Tasktable name={this.state.subject} tasks={t} />
					</table>
				</div>
				</center>
			</div>
        );
    }
}

export default Tasks;