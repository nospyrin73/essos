import React from 'react';
// import { reqEmitter } from '../request';
import { request } from '../client';

export default class Auth extends React.Component {
    render() {
        return (
            <div className='auth-container'>
                <div className='auth-box'>
                    <div className='auth-box__ribbon'></div>

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
                        name='password' 
                        id='password'
                        onChange={this.handleChange}
                        value={this.state.value}
                    />
                </div>

                <div className='auth-box__input'>
                    <button className='auth-box__field'>Submit</button>
                </div>
            </form>
        );
    }
}