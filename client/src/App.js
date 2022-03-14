import { useState } from 'react';
import PictureModal from './components/PictureModal';
import Header from './components/Header';
import Profile from './Profile';
import { Container } from 'react-bootstrap';

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    profile_picture_url: '',
    email: '',
    bio: '',
  });

  fetch('/api/users/me')
    .then((response) => response.json())
    .then((user) => {
      if (!user) {
        history.replaceState({}, '', '/login');
        return;
      }
      console.log(user);
      setUser(user);
    });

  return (
    <div className="app">
      <header>
        <Header avatar={user.profile_picture_url} setModalVisible={setModalVisible}></Header>
      </header>
      <Container>
        {modalVisible && (
          <PictureModal modalVisible={modalVisible} setUser={setUser} setModalVisible={setModalVisible} />
        )}
        <Profile userData={user} setUser={setUser} />
      </Container>
    </div>
  );
};

export default App;
