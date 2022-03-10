import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom';
import { Container } from 'react-bootstrap';
import Welcome from './Welcome';

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
    // if I am not logged in
    if (!user) {
      ReactDOM.render(<HelloWorld />, document.querySelector('main'));
      return;
    }
    ReactDOM.render(
      <span>
        Logged in as {user.first_name} {user.last_name}
      </span>,
      document.querySelector('main')
    );
  });
