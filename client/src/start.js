import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom';
import { Container } from 'react-bootstrap';
import Welcome from './pages/Welcome';
import App from './pages/App';

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
