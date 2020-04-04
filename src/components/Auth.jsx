const React = require('react');
const { requestEmitter } = require('./../request');

class Auth extends React.Component {
    render() {
        return (
            <div className='auth-container'>
                <div className='auth-box'>
                    <div className='auth-box__ribbon'></div>

                    <Form />
                </div>
            </div>
        );
    }
}

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        requestEmitter.emit('login', this.state.username);
        event.preventDefault();
    }

    render() {
        return (
            <form className='auth-box__form' onSubmit={this.handleSubmit}>
                <div className='auth-box__input'>
                    <label className='auth-box__label' htmlFor='username'>Username</label>
                    <input 
                        className='auth-box__field'
                        type='text' 
                        name='username' 
                        id='username'
                        onChange={this.handleChange}
                        value={this.state.value}
                    />
                </div>

                <div className='auth-box__input'>
                    <label className='auth-box__label' htmlFor='password'>Password</label>
                    <input 
                        className='auth-box__field'
                        type='text' 
                        name='username' 
                        id='username'
                        onChange={this.handleChange}
                        value={this.state.value}
                        disabled
                    />
                </div>

                <div className='auth-box__input'>
                    <button className='auth-box__field'>Submit</button>
                </div>
            </form>
        );
    }
}

module.exports = Auth;