import { Nav, Navbar, Container } from 'react-bootstrap';
import ProfilePicture from './ProfilePicture';

const Header = ({ avatar, setModalVisible }) => {
  return (
    <Navbar bg="light" expand="lg" className="justify-content-between">
      <Container>
        <Navbar.Brand href="/">
          <h1 className="mx-2">SocialMedia</h1>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/find-people">Find People</Nav.Link>
            <Nav.Link href="/friends">Friends</Nav.Link>
            <Nav.Link href="/chat">Chat</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link>Log out</Nav.Link>
            <ProfilePicture isEditable size={'small'} avatar={avatar} setModalVisible={setModalVisible} />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
