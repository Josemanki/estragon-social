import { useState, useEffect } from 'react';
import io from 'socket.io-client';

let socket;

export const Chat = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // connect to the socket here
    if (!socket) {
      socket = io.connect();
    }

    // listen to the recent messages on connect
    socket.on('recentMessages', (messages) => setMessages(messages));

    // cleanup function
    return () => {
      socket.off('recentMessages');
      socket.disconnect();
      socket = null;
    };
  }, []);

  useEffect(() => {
    // listen to an new incoming message
    socket.on('newMessage', (newMessage) => {
      setMessages([...messages, newMessage]);
    });

    // cleanup function
    return () => {
      socket.off('newMessage');
    };
  }, [messages]);

  function onSubmit(e) {
    e.preventDefault();
    console.log(e.target.text.value);
    socket.emit('sendMessage', {
      text: e.target.text.value,
    });
  }

  return (
    <section className="chat">
      <h2>Chat</h2>
      {messages.length ? (
        <ul className="chat-messages">
          {messages.map((message) => (
            <li key={message.id}>{message.text}</li>
          ))}
        </ul>
      ) : (
        <div className="chat-placeholder">It is very silent here.</div>
      )}
      <form className="form" onSubmit={onSubmit} autoComplete="off">
        <input name="text" required placeholder="Type something..." />
        <button>Send</button>
      </form>
    </section>
  );
};

export default Chat;
