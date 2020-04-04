const React = require('react');
const Auth = require('./Auth');
const Dash = require('./Dash');

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.state
        }
    }
    
    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.state);  
    }

    render() {
        const state = this.props.state;
        return (state.isLoggedIn) ? <Dash state={state}/> : <Auth state={state}/>
    }
}

function foo() {
    console.log('hello from App!');
}

global.App = App;

module.exports = {
    App, foo
};