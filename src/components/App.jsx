import React from 'react';
import Auth from './Auth';
import Dash from './Dash';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            token: ''
        };
        this.modifyState = this.modifyState.bind(this);
    }

    modifyState(state) {
        this.setState(state);
    }

    render() {
        return (
            (this.state.isLoggedIn) ?
                <Dash token={this.state.token} />
                :
                <Auth modifyState={this.modifyState} />

        );
    }
}