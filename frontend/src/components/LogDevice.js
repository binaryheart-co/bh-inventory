import React, { Component } from 'react';
import { Link } from "react-router-dom";

class LogDevice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: "",
            subtype: "",
            code: 0,
            note: "",
            description: "",
            estValue: 0,
        }
        this.getData = this.getData.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    async getData() {
        try {
            const data = { 
                type: this.state.type,
                subtype: this.state.subtype,
                code: this.state.code,
                note: this.state.note,
                description: this.state.description,
                estValue: this.state.estValue, 
            };
            const response = await fetch("/api/devices", {
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

    render() {
        return (
            <div>
                <div className="button"><Link to="/inventory">{"<"} Inventory</Link></div>
				<h1 className="title is-1" style={{fontFamily:'Garamond'}}> >> log() new Device</h1>
				<div className="control" style={{display:'inline-flex'}}>
					<input name="type" onChange={this.handleChange} className="input is-primary" type="text" placeholder="type" />
					<input name="subtype" onChange={this.handleChange} className="input is-info" type="text" placeholder="subtype" />
                    <div className="control">
                        <div className="select">
                            <select name="code" defaultValue={0} onChange={this.handleChange}>
                                <option value={-4}>-4</option><option value={-3}>-3</option><option value={-2}>-2</option>
                                <option value={-1}>-1</option><option value={0}>0</option><option value={1}>1</option>
                                <option value={2}>2</option><option value={3}>3</option><option value={4}>4</option>
                                <option value={5}>5</option>
                            </select>
                        </div>
                    </div>
                    <input name="note" onChange={this.handleChange} className="input is-info" type="text" placeholder="note" />
                    <input name="description" onChange={this.handleChange} className="input is-info" type="text" placeholder="description" />
					<input name="estValue" onChange={this.handleChange} className="input is-success" type="text" placeholder="estimated value" />
				</div>
				<input className="button is-dark is-fullwidth" type="submit" value="Add" onClick={this.getData}/>
			</div>
        );
    }
}

export default LogDevice;