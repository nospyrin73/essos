import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

let state = {
    self: {
        username: '',
        password: ''
    },
    channels: [],
    isLoggedIn: false,
    view: {
        name: 'home',
        info: {}
    },
};

export function updateState(username, password, channels, isLoggedIn = false, view = {name: 'home', info: {}}) {
    state.self = {
        username: username || state.self.username,
        password: password || state.self.password
    };
    state.channels = channels || state.channels;
    state.isLoggedIn = isLoggedIn;
    state.view = view;

    ReactDOM.render(
        <App state={state}/>,
        document.getElementById('root')
    );
}