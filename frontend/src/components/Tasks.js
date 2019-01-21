import React, { Component } from 'react';

class Tasks extends Component {
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
                const newData = resData.email + " has accessed the tasks page.";
                return this.setState({ data: newData });
            }
        }
        catch(e) {
            return this.setState({ data: e });
        }
    }

    componentDidMount() {
        this.getData();
    }

    render() {
        return (
            <div>
                {this.state.data}
            </div>
        );
    }
}

export default Tasks;