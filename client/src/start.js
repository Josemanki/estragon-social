import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom';
import { Container } from 'react-bootstrap';
import Welcome from './pages/Welcome';
import App from './pages/App';

import io from 'socket.io-client';

const socket = io.connect();

socket.on('connection', () => {
  console.log('connection');
});

socket.on('recentMessages', (messages) => {
  console.log('messages', messages);
});

function HelloWorld() {
  return (
    <Container>
      <Welcome />
    </Container>
  );
}

fetch('/api/users/me')
  .then((response) => response.json())
  .then((user) => {
    if (!user) {
      ReactDOM.render(<HelloWorld />, document.querySelector('main'));
      return;
    }
    ReactDOM.render(<App />, document.querySelector('main'));
  });
