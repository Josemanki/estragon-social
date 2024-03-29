import { useState, useEffect } from 'react';
import PictureModal from '../components/PictureModal';
import Header from '../components/Header';
import Profile from './Profile';
import Friends from './Friends';
import OtherProfile from './OtherProfile';
import FindPeople from './FindPeople';
import Chat from '../components/Chat';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container } from 'react-bootstrap';

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
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
  }, []);

  return (
    <div className="app">
      <header>
        <Header avatar={user.profile_picture_url} setModalVisible={setModalVisible}></Header>
      </header>
      <Container>
        {modalVisible && (
          <PictureModal modalVisible={modalVisible} setUser={setUser} setModalVisible={setModalVisible} />
        )}
        <BrowserRouter>
          <Switch>
            <Route path="/profile">
              <Profile userData={user} setUser={setUser} />
            </Route>
            <Route path="/find-people">
              <FindPeople />
            </Route>
            <Route path="/user/:user_id">
              <OtherProfile />
            </Route>
            <Route path="/friends">
              <Friends />
            </Route>
            <Route path="/chat">
              <Chat user_id={user.id} />
            </Route>
            <Route exact path="/">
              <Profile userData={user} setUser={setUser} />
            </Route>
          </Switch>
        </BrowserRouter>
      </Container>
    </div>
  );
};

export default App;
