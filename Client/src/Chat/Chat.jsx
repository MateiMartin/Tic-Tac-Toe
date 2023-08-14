import React, { useState, useEffect } from "react";
import './Chat.css';


const Chat = ({ socket, room }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const handleChatMessage = (receivedMessage) => {
            console.log("Received:", receivedMessage);
            setMessages((prevMessages) => [...prevMessages, <li key={prevMessages.length}>{receivedMessage}</li>]);
        };

        socket.on('chat-message', handleChatMessage);

        return () => {
            socket.off('chat-message', handleChatMessage);
        };
    }, [socket]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            console.log("Sending:", message);
            e.preventDefault();
            if (message.trim() !== '') {
                messages.push(<li key={messages.length}>{message.trim()}</li>);
                socket.emit('chat-message', message, room.id);
                setMessage('');
            }
        }
    };

    const onInputChange = (e) => {
        setMessage(e.target.value);
    };

    return (
        <div className="chat-container">
            <ul>
                {messages}
            </ul>
            <input type="text" id="message-input" onKeyDown={handleKeyDown} onChange={onInputChange} value={message} />
        </div>
    );
};

export default Chat;
