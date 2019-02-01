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

                <div class="bar">
                  <img src={logo}></img>
                  <img src={inventoryIcon}></img>
                  <img src={tasksIcon}></img>
                </div>
                <table class="scrollable">
                  <tbody>
                    <tr>
                      <td width="10%">Example</td>
                      <td width="16%">Example</td>
                      <td width="5%">Example</td>
                      <td width="15%">Example</td>
                      <td width="22%">Example</td>
                      <td width="14%">Example</td>
                      <td width="10%">Example</td>
                      <td width="8%">Example</td>
                    </tr>
                    {rows}
                  </tbody>
                </table>
                <table class="head" id="head">
                  <thead>
                    <tr>
                      <th width="10%">Date</th>
                      <th width="16%">ID</th>
                      <th width="5%">Status Code</th>
                      <th width="15%">Notes</th>
                      <th width="22%">Description</th>
                      <th width="14%">Donor</th>
                      <th width="10%">Reciever</th>
                      <th width="8%">Money</th>
                    </tr>
                  </thead>
                </table>
                <div class="down">
                  <i class="fas fa-angle-down" id="downArrow" onclick="organizationPopup"></i>
                </div>
                <div class="dim" id="dim">
                </div>
            </div>
        );
    }
}

export default Inventory;
