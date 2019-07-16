import React, { Component } from 'react';
import './tablestyle.scss';
import './binary.svg';
import logo from './binaryheartWhite.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from "react-router-dom";
import Inventrow from "./Inventrow";
// import tempd from "./nikita.json";

const itemsAtTime = 50;

class Inventory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            devices: [],
            afterToken: {},
            sorts: "new",
            loadingState: false
        }
        this.onScroll = this.onScroll.bind(this);
    }

    async getData() {
        try {

            //Add token to device url if there is a token
            let deviceURL = `/api/devices?sort=${this.state.sorts}&items=${itemsAtTime}`;
            if(this.state.afterToken){
                if(this.state.afterToken.tokenDirection && this.state.afterToken.tokenID) {
                    deviceURL += `&tokenDirection=${this.state.afterToken.tokenDirection}`;
                    deviceURL += `&tokenID=${this.state.afterToken.tokenID}`;
                }
            }

            const response = await fetch(deviceURL, {
                method: "GET"
            });

            const resData = await response.json();
            if(response.status === 401) {
                this.props.history.push("/");
            }
            else if(response.status === 200) {
                const joined = this.state.devices.concat(resData.devices);
                return this.setState({ 
                    devices: joined, 
                    afterToken: resData.after, 
                    loadingState: false, 
                });
            }
        }
        catch(e) {
            console.error(e);
        }
    }

    componentDidMount() {
        this.getData();
        window.addEventListener("scroll", this.onScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.onScroll);
    }

    onScroll() {
        if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 1) && !this.state.loadingState && this.state.afterToken) {
            this.setState({ loadingState: true });
            this.getData(this.state.sorts);
        }
    }

    async sortDate() {
        let sort;
        if(this.state.sorts==="new"){
            this.setState({devices:[], sorts:"old"});
            sort="old";
        }else{
            this.setState({devices:[], sorts:"new"});
            sort="new"
        }

        const response = await fetch(`/api/devices?sort=${sort}&items=${itemsAtTime}`, {
            method: "GET"
        });
        const resData = await response.json();
        const joined = this.state.devices.concat(resData.devices);
        return this.setState({ 
            devices: joined, 
            afterToken: resData.after, 
            loadingState: false, 
        });
    }

    displayItems() {
        const rows = [];
        // tempd.slice(0,this.state.items).forEach((i, n) => { //Dev: nikita.json
        this.state.devices.slice(0,this.state.devices.length).forEach((i, n) => {
            
            const coding =
            i.code === -4 ? "#E0666":
            i.code === -3 ? "#F6B26B":
            i.code === -2 ? "#E0666":
            i.code === -1 ? "#F6B26B":
            i.code === 0 ? "#FFFFF0":
            i.code === 1 ? "#FFD966":
            i.code === 2 ? "#A4C2F4":
            i.code === 3 ? "#A64D79":
            i.code === 4 ? "#674EA7":
            i.code === 5 ? "#FF00FF":
            "#183A5F";
            
            rows.push(
                <Inventrow i={i} key={i.fullID} coding={coding} n={n}/>
            );
          });
        return rows;
    }

    render() {
        return (
            <div>
                <div className="button" style={{right: 0, position: "fixed"}}><Link to="/logdevice">Log new Device</Link></div>
                <div className="bar">
                    <div className="ico">
                        <Link to="/dashboard"><img alt="BinaryHeart logo" className="icon" src={logo}/></Link>
                        <br/>
                        <Link to="/tasks"><FontAwesomeIcon icon="tasks" color="white" className="iconic"/></Link>
                        <br/>
                        <FontAwesomeIcon icon="box-open" color="crimson"/>
                    </div>
                </div>
                <br/>
                <br/>
                <table className="mainTable" id="iScroll">
                  <thead>
                    <tr className="roundy">
                      <th width="6%"><label htmlFor="checkbox"><input type="checkbox" id="checkbox"/>
                        <FontAwesomeIcon onClick={() => {this.sortDate()}} icon="angle-down" id="downArrow"/></label> Date </th>
                      <th width="10%">ID</th>
                      <th width="5%">Code</th>
                      <th>Users</th>
                      <th>Status</th>
                      <th width="30%">Notes</th>
                      <th>Description</th>
                      <th width="7%">Receiver</th>
                      <th width="5%">Money</th>
                    </tr>
                  </thead>
                  <tbody style={{overflow:"auto"}}>
                    {this.displayItems()}
                  </tbody>
                </table>
                {this.state.loadingState ? <p className="loading" style={{textAlign:"center"}}>Loading {itemsAtTime} more items...</p> : ""}
            </div>
        );
    }
}

export default Inventory;