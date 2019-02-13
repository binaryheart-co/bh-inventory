import React, { Component } from 'react';
import './tablestyle.css';
import './binary.svg';
import logo from './binaryheartWhite.png';
import tasksIcon from './tasks-solid.svg';
import inventoryIcon from './box-open-solid.svg';
import bhInventory from './nikita.json';


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
  		bhInventory.forEach((tt) => {
  			const coding = tt.code === 1
  				? <td bgcolor="#57BB8A">1</td>
  				: ( tt.code === 2
  					? <td bgcolor="#F7B96A">2</td>
  					: ( tt.code === 3
  						? <td bgcolor="#EF9B6E">3</td>
  						: ( tt.code === 4
  							? <td bgcolor="#E67C73">4</td>
  							: <td>{tt.code}</td>
  						)
  					)
  				)
  			rows.push(
  				<tr>
            <td>{tt.date}</td>
            <td>{tt.id}</td>
  					{coding}
  					<td>{tt.user}</td>
            <td>{tt.status}</td>
            <td>{tt.notes}</td>
            <td>{tt.description}</td>
            <td>{tt.donor}</td>
            <td>{tt.receiver}</td>
            <td>{tt.money}</td>
  				</tr>
  			);
  		});

        return (
            <div>
                {this.state.data}

                <div className="bar">
                  <img src={logo}></img>
                  <img src={inventoryIcon}></img>
                  <img src={tasksIcon}></img>
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
					  <th width="5%">Donor</th>
					  <th width="7%">Reciever</th>
					  <th>Money</th>
					</tr>
				  </thead>
				  <tbody>
					{rows}
				  </tbody>
				</table>

                <div className="down">
                  <i className="fas fa-angle-down" id="downArrow" onClick="organizationPopup that Nikita was working on"></i>
                </div>
                <div className="dim" id="dim">
                </div>
            </div>
        );
    }
}

export default Inventory;
