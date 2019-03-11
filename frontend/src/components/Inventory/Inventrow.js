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
			<tr bgcolor="#96bde8">
				<td>{dateText}</td>
				<td>{i.fullID}</td>
				{coding}
				<td>{i.user}</td>
				<td>{status}</td>
				<td onClick={() => this.setState({clicked:true}) }>{note}</td>
				<td>{i.description}</td>
				<td>{i.receiver}</td>
				<td>{`$${i.estValue.toLocaleString()}`}</td>
			</tr>
		);
	}
}

export default Inventrow;