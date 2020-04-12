import React from 'react';
// import { reqEmitter } from '../request';
import { request } from '../client';

export default class Auth extends React.Component {
    render() {
        return (
            <div className='auth'>
                <div className='auth-container'>
                    <Form modifyState={this.props.modifyState}/>
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
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        request('login', {
            username: this.state.username,
            password: this.state.password
        }).then((res) => {
            if (res.status === 'success') {
                this.props.modifyState({
                    isLoggedIn: true,
                    token: res.data.token
                });
            } else if (res.status === 'fail') {
                console.log(res.err);
            }
        });

        event.preventDefault();
    }

    render() {
        return (
            <form className='auth-form' onSubmit={this.handleSubmit}>
                <div className='auth-input'>
                    <label className='auth-label' htmlFor='username'>Username</label>
                    <input 
                        className='auth-field'
                        type='text' 
                        name='username' 
                        id='username'
                        placeholder='Username'
                        onChange={this.handleChange}
                        value={this.state.value}
                    />
                </div>

                <div className='auth-input'>
                    <label className='auth-label' htmlFor='password'>Password</label>
                    <input 
                        className='auth-field'
                        type='text' 
                        name='password' 
                        id='password'
                        placeholder='Password'
                        onChange={this.handleChange}
                        value={this.state.value}
                    />
                </div>

                <div className='auth-input'>
                    <button className='auth-field'>Submit</button>
                </div>
            </form>
        );
    }
}