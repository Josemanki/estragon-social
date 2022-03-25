import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ProfilePicture from './ProfilePicture';
import { Card, ListGroup, Form, Button, InputGroup } from 'react-bootstrap';

let socket;

export const Chat = ({ user_id }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} @ ${date.toLocaleTimeString()}`;
  };

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
      console.log('newMessage', newMessage);
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
      <Card className="my-4">
        <Card.Header as="h2">Chat</Card.Header>
        {messages.length ? (
          <ListGroup className="text-break" as="ul">
            {messages.map((message) => (
              <ListGroup.Item key={`chat-message-${message.id}`} className="d-flex gap-2">
                <ProfilePicture avatar={message.profile_picture_url} size={'small'} />
                <div className="ms-2 me-auto">
                  <div>
                    <span
                      className={`fw-bold ${user_id === message.sender_id ? 'text-success' : 'text-primary'}`}
                    >{`${message.first_name} ${message.last_name}`}</span>
                    <span className="mx-2 text-muted font-12">{formatDate(message.created_at)}</span>
                  </div>
                  {message.text}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <div className="chat-placeholder">It is very silent here.</div>
        )}
        <Form onSubmit={onSubmit}>
          <Form.Group className="m-3" controlId="findPeople.search">
            <InputGroup>
              <Form.Control type="text" name="text" placeholder="Type something!" />
              <Button variant="primary" type="submit">
                Send
              </Button>
            </InputGroup>
          </Form.Group>
        </Form>
      </Card>
    </section>
  );
};

export default Chat;
