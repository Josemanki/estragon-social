import { Nav, Navbar, Container } from 'react-bootstrap';
import ProfilePicture from './ProfilePicture';

const Header = ({ avatar, setModalVisible }) => {
  return (
    <Navbar bg="light" expand="lg" className="justify-content-between">
      <Container>
        <Navbar.Brand href="/">
          <h1 className="mx-2">SocialMedia</h1>
        </Navbar.Brand>
        <ProfilePicture size={'small'} avatar={avatar} setModalVisible={setModalVisible} />
      </Container>
    </Navbar>
  );
};

export default Header;
