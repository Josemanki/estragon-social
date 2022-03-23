import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

export const Friends = () => {
  const DEFAULT_PICTURE = 'https://dummyimage.com/400x400/fff/aaa';
  const [wannabes, setWannabes] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    fetch('/api/friendships')
      .then((response) => response.json())
      .then((friendships) => {
        const currentFriends = friendships.filter(({ accepted }) => accepted);
        const incomingRequests = friendships.filter(({ accepted }) => !accepted);
        setWannabes(incomingRequests);
        setFriends(currentFriends);
      });
  }, []);

  function onAcceptClick(user) {
    fetch(`/api/friendships/${user.user_id}`, {
      method: 'PUT',
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
      });
    setWannabes(wannabes.filter((acceptedUser) => acceptedUser.user_id != user.user_id));
    setFriends([...friends, user]);
  }
  function onUnfriendClick(user) {
    fetch(`/api/friendships/${user.user_id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
      });
    setFriends(friends.filter((unfriendedUser) => unfriendedUser.user_id != user.user_id));
  }

  return (
    <section className="">
      <h2>Friends</h2>
      <section>
        <h3>Wannabes</h3>
        <ul>
          {wannabes.map((user) => {
            return (
              <li className="d-flex" key={`wannabes-${user.user_id}`}>
                <img
                  src={user.profile_picture_url || DEFAULT_PICTURE}
                  alt="Profile Picture"
                  className="profile-picture-medium"
                />
                <div className="d-flex flex-column justify-content-center align-items-center">
                  {`${user.first_name} ${user.last_name}`}
                  <Button onClick={() => onAcceptClick(user)}>Accept</Button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
      <section>
        <h3>Friends</h3>
        <ul>
          {friends.map((user) => {
            return (
              <li className="d-flex" key={`friends-${user.user_id}`}>
                <img
                  src={user.profile_picture_url || DEFAULT_PICTURE}
                  alt="Profile Picture"
                  className="profile-picture-medium"
                />
                <div className="d-flex flex-column justify-content-center align-items-center">
                  {`${user.first_name} ${user.last_name}`}
                  <Button onClick={() => onUnfriendClick(user)}>Unfriend</Button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </section>
  );
};

export default Friends;
