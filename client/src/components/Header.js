import { Nav, Navbar, Container } from 'react-bootstrap';
import ProfilePicture from './ProfilePicture';

const Header = ({ avatar, setModalVisible }) => {
  const logOut = () => {
    fetch('/api/logout', {
      method: 'POST',
    }).then(location.reload());
  };

  return (
    <Navbar bg="light" expand="lg" className="justify-content-between">
      <Container>
        <Navbar.Brand href="/">
          <h1 className="mx-2 text-primary fw-bold">Facebook(Not)</h1>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/find-people">Find People</Nav.Link>
            <Nav.Link href="/friends">Friends</Nav.Link>
            <Nav.Link href="/chat">Chat</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link onClick={logOut}>Log out</Nav.Link>
            <ProfilePicture isEditable size={'small'} avatar={avatar} setModalVisible={setModalVisible} />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
