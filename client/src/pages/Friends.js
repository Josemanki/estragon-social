import { useState, useEffect } from 'react';
import { CardGroup, Card, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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
    <main>
      <section>
        <Card className="mt-4">
          <Card.Header as="h2">Friend Requests</Card.Header>
          <CardGroup className={`${wannabes.length ? `p-3 d-block ` : `d-flex justify-content-center`}`}>
            <Row xs={1} sm={2} md={3} lg={4}>
              {wannabes.length ? (
                wannabes.map((user) => {
                  return (
                    <Col key={`wannabes-${user.user_id}`}>
                      <Card className="p-3 align-items-center">
                        <Card.Img
                          className="profile-picture-big"
                          variant="top"
                          src={user.profile_picture_url || DEFAULT_PICTURE}
                        />
                        <Card.Title>{`${user.first_name} ${user.last_name}`}</Card.Title>
                        <Card.Text>{user.bio || 'This user has no bio yet!'}</Card.Text>
                        <Button onClick={() => onAcceptClick(user)}>Accept</Button>
                      </Card>
                    </Col>
                  );
                })
              ) : (
                <Col lg={true} className="w-100 m-4">
                  <Card.Text>There are no recent requests for you!</Card.Text>
                </Col>
              )}
            </Row>
          </CardGroup>
        </Card>
      </section>
      <section>
        <Card className="my-4">
          <Card.Header as="h2">Friends</Card.Header>
          <CardGroup className={`${friends.length ? `p-3 d-block` : `d-flex justify-content-center`}`}>
            <Row xs={1} sm={2} md={3} lg={4}>
              {friends.length ? (
                friends.map((user) => {
                  return (
                    <Col key={`friends-${user.user_id}`}>
                      <Card className="p-3 align-items-center">
                        <Card.Img variant="top" src={user.profile_picture_url || DEFAULT_PICTURE} />
                        <Card.Title>{`${user.first_name} ${user.last_name}`}</Card.Title>
                        <Card.Text>{user.bio || 'This user has no bio yet!'}</Card.Text>
                        <Button onClick={() => onUnfriendClick(user)}>Unfriend</Button>
                      </Card>
                    </Col>
                  );
                })
              ) : (
                <Col lg={true} className="w-100 m-4">
                  <Card.Text>
                    You don't have any friends yet! You might want to <Link to="/find-people">find people</Link>!
                  </Card.Text>
                </Col>
              )}
            </Row>
          </CardGroup>
        </Card>
      </section>
    </main>
  );
};

export default Friends;
