import React from 'react';
import Auth from './Auth';
import Dash from './Dash';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.state
        };
    }
    
    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.state);  
    }

    render() {
        const state = this.props.state;
        return (state.isLoggedIn) ? <Dash state={state}/> : <Auth state={state}/>
    }
}