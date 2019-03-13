import React, { Component } from 'react';

class Inventrow extends Component {
    constructor(props) {
        super(props);
        this.state = {
			clicked: false
        }
    }

	render() {
		const i = this.props.i;
		
		const coding =

            <td>{i.code}</td>;	

		const note = this.state.clicked === true ? <textarea class="input" type="text">{i.notes}</textarea> : i.notes;
        
        const date = new Date(i.createdAt);
        const dateText = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

        const status = 
            i.code === -4 ? "Sold on eBay" :
            i.code === -3 ? "Needs eBay Listing" :
            i.code === -2 ? "Salvaged" :
            i.code === -1 ? "Needs Salvage" :
            i.code === 0 ? "Unknown" :
            i.code === 1 ? "Needs Repair" :
            i.code === 2 ? "Works" :
            i.code === 3 ? "OS Installed" :
            i.code === 4 ? "OS Activated" :
            i.code === 5 ? "100% Ready for Donation" :
            "Unknown";

		return (
			<tr bgcolor={this.props.coding}>
				<td>{dateText}</td>
				<td>{i.fullID}</td>
				{coding}
				<td>{i.user}</td>
				<td>{status}</td>
				<td onClick={() => this.setState({clicked:true}) }>{note}</td>
				<td>{i.description}</td>
				<td>{i.receiver}</td>
				<td>{`$${+i.estValue ? (+i.estValue).toLocaleString() : 0}`}</td>
			</tr>
        );
        //make sure .toLocalString isn't called on null or NaN
	}
}

export default Inventrow;