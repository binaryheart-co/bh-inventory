import React, { Component } from 'react';

class Inventrow extends Component {
    constructor(props) {
        super(props);
        this.state = {
			coder: false,
			noter: false,
			describer: false,
			receiver: false,
			valuer: false
        }
    }

	render() {
        const i = this.props.i;
        
        const coding = this.state.coder === true ? <textarea rows="1" maxLength="2" className="input" defaultValue={i.code}/> : i.code;

        //Note code
        let noteText = "";
        for(let n = 0; n < i.notes.length; n++) {
            const date = new Date(i.notes[n].createdAt);
            const dateText = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
            noteText += `${dateText}: ${i.notes[n].note}\n`;
        }
        const noting = this.state.noter === true ? <textarea readOnly className="input" defaultValue={noteText}/> : noteText;

		const describing = this.state.describer === true ? <textarea className="input" defaultValue={i.description}/> : i.description;
		const receiving = this.state.receiver === true ? <textarea disabled className="input" defaultValue={i.receiver}/> : i.receiver;
		const valuing = this.state.valuer === true ? <td><textarea rows="1" className="input" defaultValue={i.estValue}/></td> : <td onClick={() => this.setState({valuer:true}) }>{`$${+i.estValue ? (+i.estValue).toLocaleString() : 0}`}</td>;
        
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

        const user = i.names ? i.names.join(", ") : "";

		return (
			<tr bgcolor={this.props.coding}>
				<td>{dateText}</td>
				<td>{i.fullID}</td>
				<td onClick={() => this.setState({coder:true}) }>{coding}</td>
				<td>{user}</td>
				<td>{status}</td>
				<td onClick={() => this.setState({noter:true}) }>{noting}</td>
				<td onClick={() => this.setState({describer:true}) }>{describing}</td>
				<td onClick={() => this.setState({receiver:true}) }>{receiving}</td>
				{valuing}
			</tr>
        );
        //make sure .toLocalString isn't called on null or NaN
	}
}

export default Inventrow;