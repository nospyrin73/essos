import React from 'react';
import { reqEmitter } from '../request';
import { updateState } from '../render';

export default class Dash extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.state
        };

        this.showView = this.showView.bind(this);
    }

    showView(event, name, info) {
        this.setState((state) => {
            state.view = {
                name, info
            };

            updateState(this.state.self.username, this.state.self.password, null, true, this.state.view);
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.state);
    }

    render() {
        return (
            <div className='dash-container'>
                <Sidebar showView={this.showView} state={this.state} />
                <MainView state={this.state} />
            </div>
        );
    }
}

class Sidebar extends React.Component {
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
        return (
            <div className='sidebar'>
                <div className='user-widget sidebar__user-widget'>
                    <span className='user-widget__avatar'></span>
                    <span className='user-widget__username'>{this.state.self.username}</span>
                </div>

                <div className='channels'>
                    {(this.state.channels.length === 0) ? (
                        <div className='channels__no-channels'>
                            <button className='add-someone' onClick={(e) => { this.props.showView(e, 'join-channel'); }}>
                                Add Someone
                            </button>
                        </div>
                    ) : (
                        <ul className='channels__list'>
                            {
                                this.state.channels.map(channel => {
                                    return (
                                        <Channel
                                            state={this.state}
                                            key={channel.id}
                                            id={channel.id}
                                            onClick={(e) => { this.props.showView(e, 'chat', { channel }); }}
                                        />
                                    );
                                })
                            }
                        </ul>
                    )}
                </div>
            </div>
        );
    }
}


class Channel extends React.Component {
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
        return (
            <li className='channels__channel' onClick={this.props.onClick}>
                {this.props.id}
            </li>
        );
    }
}

class MainView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.state,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.state);
    }

    render() {
        // console.dir(this.props.view);
        let view;
        switch (this.state.view.name) {
        case 'join-channel':
            view = <JoinChatView state={this.state} />;
            break;
        case 'chat':
            view = <ChatView state={this.state} />;
            break;
        case 'home':
        default:
            view = <div className='home-view'>Home</div>;
        }

        return (
            <div className='main-view'>
                {view}
            </div>
        );
    }
}

class JoinChatView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            ...this.props.state
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.state);
    }

    handleChange(event) {
        this.setState({ searchValue: event.target.value });
    }

    handleSubmit(event) {
        reqEmitter.emit('join-channel', this.state.self.username, this.state.searchValue);
        event.preventDefault();
    }

    render() {
        return (
            <form className='join-chat-view' onSubmit={this.handleSubmit}>
                <input
                    className='search-user'
                    value={this.state.searchValue}
                    onChange={this.handleChange}
                    autoFocus
                />
            </form>
        );
    }
}

class ChatView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.state
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.state);
    }

    handleChange(event) {
        this.setState({ messageText: event.target.value });
    }

    handleSubmit(event) {
        if (event.key === 'Enter') {
            reqEmitter.emit('send-message', {
                sender: this.state.self.username,
                receiver: this.state.view.info.channel.id,
                message: this.state.messageText,
                time: new Date()
            });

            event.target.value = '';
        }
    }

    render() {
        return (
            <div className='chat'>
                <input type='text' className='chat__input'
                    placeholder='Add someone...'
                    onChange={(event) => this.setState({ toAdd: event.target.value })}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            reqEmitter.emit('join-channel', this.state.self.username, this.state.toAdd, this.state.view.info.channel.id);

                            event.target.value = '';
                        }

                    }}
                />
                <ul className='chat__history'>
                    {this.state.view.info.channel.messages.map(message => {
                        return (
                            <li className='message' key={message.id}>
                                <span className='message__sender'>{message.sender}</span>
                                <span className='message__text'>{message.message}</span>
                            </li>
                        );
                    })}
                </ul>
                <input type='text' placeholder='Say something...' className='chat__input' onChange={this.handleChange} onKeyDown={this.handleSubmit} />
            </div>
        );
    }
}


/*

 */

/*
    state: {
        self: {
            username: "",
            password: ""
        },
        channels: [
            {
                id: n,
                name: "",
                participants: [],
                access: "private" || "party",
                messages: []
            }
        ],
        isLoggedIn: true || false;
        view: "home" || "join-chat" || "chat",
    }
 */