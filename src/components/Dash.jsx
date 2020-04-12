/* eslint-disable react/prop-types */
import fs from 'fs';
import path from 'path';
import React from 'react';
import { request, requestKeepAlive } from '../client';
import { UserContext } from './UserContext';

export default class Dash extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            view: {
                title: 'home',
                data: {}
            }
        };
        this.showView = this.showView.bind(this);
    }

    showView(event, title, data) {
        this.setState({
            view: {
                title,
                data
            }
        });
    }

    render() {
        return (
            <UserContext.Provider value={{
                token: this.props.token,
                view: this.state.view
            }}>
                <div className='dash-container'>
                    <Sidebar showView={this.showView} />
                    <MainView showView={this.showView} view={this.state.view} />
                </div>
            </UserContext.Provider>
        );
    }
}

class Sidebar extends React.Component {
    static contextType = UserContext;

    constructor() {
        super();
        this.state = {
            username: ''
        };
    }

    componentDidMount() {
        requestKeepAlive('load', {
            resources: ['username'],
            token: this.context.token,
            keep_alive: true
        }, (res) => {
            if (res.status === 'success') {
                this.setState({ username: res.data.username });
            } else if (res.status === 'fail') {
                console.log(res.err);
            }
        });
    }

    render() {
        return (
            <div className='sidebar'>
                <div className='user-widget sidebar__user-widget'>
                    <span className='user-widget__avatar'></span>
                    <span className='user-widget__username'>{this.state.username}</span>
                </div>

                <ChannelList showView={this.props.showView} />
            </div>
        );
    }
}

class ChannelList extends React.Component {
    static contextType = UserContext;

    constructor() {
        super();
        this.state = {
            loading: true,
            channels: []
        };
    }

    componentDidMount() {
        requestKeepAlive('load', {
            resources: ['channels'],
            token: this.context.token,
            keep_alive: true
        }, (res) => {
            if (res.status === 'success') {
                this.setState({ loading: false, channels: res.data.channels }); // to-do: load channels individually - better ux
            } else if (res.status === 'fail') {
                // to-do: do something about the error
                console.log(res.err);
            }
        });
    }

    render() {
        let channels = this.state.channels;

        if (!channels.length) {
            return (
                <div className='channels__no-channels'>
                    <button className='add-someone' onClick={(e) => { this.props.showView(e, 'user-search'); }}>
                        Add Someone
                    </button>
                </div>
            );
        }


        return (
            <ul className='channels__list'>
                {
                    channels.map(channel => {
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
        );
    }
}

class Channel extends React.Component {
    render() {
        return (
            <li className='channels__channel' onClick={this.props.onClick}>
                {this.props.id}
            </li>
        );
    }
}

class MainView extends React.Component {
    static contextType = UserContext;

    render() {
        let context = this.context;
        let active;

        switch (context.view.title) {
            case 'home':
                active = (<span>Home</span>);
                break;
            case 'user-search':
                active = (<UserSearchView showView={this.props.showView} data={context.view.data} />);
                break;
            case 'chat':
                active = (<ChatView channel={context.view.data.channel} />);
        }

        return (
            <div className='main-view'>
                {active}
            </div>
        );
    }
}

class UserSearchView extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            query: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // componentWillReceiveProps(nextProps) {
    //     this.setState(nextProps.state);
    // }

    handleChange(event) {
        this.setState({ query: event.target.value });
    }

    handleSubmit(event) {
        request('open-direct-message', {
            token: this.context.token,
            other: this.state.query
        }).then((res) => {
            if (res.status === 'success') {
                this.props.showView(event, 'chat', { channel: res.data.channel });
            } else if (res.status === 'fail') {
                console.log(res.err);
            }
        });
        event.preventDefault();
    }

    render() {
        return (
            <form className='join-chat-view' onSubmit={this.handleSubmit}>
                <input
                    className='search-user'
                    value={this.state.query}
                    onChange={this.handleChange}
                    autoFocus
                />
            </form>
        );
    }
}

class ChatView extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            channel: {
                messages: []
            },
            outgoing: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);

    }

    componentDidMount() {
        requestKeepAlive('load-chat', {
            channel_id: this.context.view.data.channel.id,
            token: this.context.token,
            keep_alive: true
        }, (res) => {
            if (res.status === 'success') {
                this.setState({ channel: res.data.channel });
            } else if (res.status === 'fail') {
                console.log(res.err);
            }
        });
    }

    componentWillUnmount() {
        console.log(`unmounted ${this.channel.id || 'initial update'}`);
    }

    handleChange(event) {
        this.setState({ outgoing: event.target.value });
    }

    handleSubmit(event) {
        if (event.key === 'Enter') {
            // to-do: do some message parsing (e.g. check if empty)
            request('send-message', {
                token: this.context.token,
                outgoing: this.state.outgoing,
                receiver: this.state.channel.id
            }).then((res) => {
                if (res.status === 'success') {
                    this.setState({ channel: res.data.channel });
                } else if (res.status === 'fail') {
                    console.log(res.err);
                }
            });

            event.target.value = '';
        }
    }

    handleFileUpload(event) {
        let absolutePath = event.target.files[0].path;
        let fileName = path.basename(absolutePath);

        let readStream = fs.createReadStream(absolutePath);
        let data;
        readStream.on('data', (chunk) => {
            data += chunk;
        });


        request('upload-file', {
            fileName,
            content
        }).then((res) => {
            if (res.status === 'success') {
                request('send-message', {
                    token: this.context.token,
                    outgoing: '',
                    receiver: this.state.channel.id,
                    attachments: [
                        res.data.path
                    ]
                }).then((res) => {
                    if (res.status === 'success') {
                        this.setState({ channel: res.data.channel });
                    } else if (res.status === 'fail') {
                        console.log(res.err);
                    }
                });
            } else if (res.status === 'fail') {
                console.log(res.err);
            }
        });
    }

    downloadFile(event) {
        let filePath; // get this

        request('download-file', {
            filePath
        }).then((res) => {
            let writable = fs.createWriteStream('../../db/' + res.data.fileName);
            writable.write(res.data.content);
        });
    }

    render() {
        return (
            <div className='chat'>
                <ul className='chat__history'>
                    {this.state.channel.messages.map(message => {
                        let fileName;
                        if(message.attachments) {
                            fileName = message.attachments.fileName;
                        }
                        return (
                            <li className='message' key={message.id}>
                                <span className='message__sender'>{message.sender}</span>
                                <span className='message__text'>{message.content}</span>
                                <span className=''>{fileName}</span>
                            </li>
                        );
                    })}
                </ul>
                <input
                    type='text'
                    placeholder='Say something...'
                    className='chat__input'
                    onChange={this.handleChange}
                    onKeyDown={this.handleSubmit}
                />
                <input type='file' onChange={this.handleFileUpload} />
            </div>
        );
    }
}





// <input type='text' className='chat__input'
//     placeholder='Add someone...'
//     onChange={(event) => this.setState({ toAdd: event.target.value })}
//     onKeyDown={(event) => {
//         if (event.key === 'Enter') {
//             reqEmitter.emit('join-channel', this.state.self.username, this.state.toAdd, this.state.view.info.channel.id);

//             event.target.value = '';
//         }

//     }}
// />