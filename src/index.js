const React = require('react');
const ReactDOM = require('react-dom');
const {App} = require('./components/App');

const { init } = require('./client');

init(() => {
    ReactDOM.render(
        <App state={{}}/>,
        document.getElementById('root')
    );
});
