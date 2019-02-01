import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import t from './Tasks.json';

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
                const newData = resData.email + " has accessed the tasks page.";
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
		const rows = [];
		t.forEach((tt) => {
			const difficult = tt.Difficulty === 1
				? <td bgcolor="#57BB8A">1</td>
				: ( tt.Difficulty === 2
					? <td bgcolor="#F7B96A">2</td>
					: ( tt.Difficulty === 3
						? <td bgcolor="#EF9B6E">3</td>
						: ( tt.Difficulty === 4
							? <td bgcolor="#E67C73">4</td>
							: <td>{tt.Difficulty}</td>
						)
					)
				)
			rows.push(
				<tr>
					<th>{tt.Number}</th><td></td>
					<td><Link to="/inventory" title="It's on you, Nikita!">{tt.ID}</Link></td><td></td>
					<td>{tt.Task}</td>
					{difficult}
					<td>{tt.Worker}</td>
				</tr>
			);
		});
		
        return (
			<div>
				<div className="notification is-link" style={{display: this.state.hideNotify ? "none" : "block", textAlign: "center"}}>
					<button className="delete" onClick={this.hideNotification}></button>
					<strong>Returning Member</strong>: Complete attendance form at <strong>
					<a href="http://binaryheart.org/here" onClick={this.hideNotification}>binaryheart.org/here</a></strong>
				</div>
				<div>
					{this.state.data}
				</div>
				<div>
				    <table class="table">
						<thead>
							<th>#</th><th></th>
							<th>Device ID</th><th></th>
							<th>Task</th>
							<th>Difficulty</th>
							<th>Worker</th>
						</thead>
						<tbody>
							<tr>
								<th>A</th><td></td>
								<td>test</td><td></td>
								<td>row</td>
								<td>9000</td>
								<td>{this.state.subject}</td>
							</tr>
							{rows}
					  </tbody>
					</table>
				</div>
			</div>
        );
    }
}

export default Tasks;