import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

const { init } = require('./client');

init(() => {
    ReactDOM.render(
        <App state={{}}/>,
        document.getElementById('root')
    );
});