import React, { Component } from 'react';
import './tablestyle.scss';
import './binary.svg';
import logo from './binaryheartWhite.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import bhInventory from './nikita.json';
import { Link } from "react-router-dom";


class Inventrow extends Component {
    constructor(props) {
        super(props);
        this.state = {
			clicked: false
        }
    }
	render() {
		const i = this.props.i;
		const coding = i.code === 1
			? <td bgcolor="#57BB8A">1</td>
			: ( i.code === 2
				? <td bgcolor="#F7B96A">2</td>
				: ( i.code === 3
					? <td bgcolor="#EF9B6E">3</td>
					: ( i.code === 4
						? <td bgcolor="#E67C73">4</td>
						: <td>{i.code}</td>
					)
				)
			)
		const note = this.state.clicked === true ? <input class="input" type="text" value={i.notes}/> : i.notes;
		
		return (
			<tr bgcolor="#96bde8">
				<td>{i.date}</td>
				<td>{i.id}</td>
				{coding}
				<td>{i.user}</td>
				<td>{i.status}</td>
				<td onClick={() => this.setState({clicked:true}) }>{note}</td>
				<td>{i.description}</td>
				<td>{i.receiver}</td>
				<td>{i.money}</td>
			</tr>
		);
	}
}




class Inventory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: "Loading...",
        }
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
                const newData = resData.email + " has accessed the inventory page.";
                return this.setState({ data: newData });
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
  		bhInventory.forEach((i) => {
			rows.push(
				<Inventrow i={i} key={i.id} />
			);
  		});

        return (
            <div>
                {this.state.data} <Link to="/logdevice">Log new Device</Link>

                <div className="bar">
					<div className="ico">
					<img className="icon" src={logo}/>
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
                  <FontAwesomeIcon icon="angle-down" id="downArrow" onClick="organizationPopup that Nikita was working on"/>
                </div>
                <div className="dim" id="dim">
                </div>
            </div>
        );
    }
}

export default Inventory;