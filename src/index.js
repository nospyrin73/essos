import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

const { init } = require('./client');

init().then(() => {
    ReactDOM.render(
        <App />,
        document.getElementById('root')
    );
});