import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CardGroup, Card, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';

const FindPeople = () => {
  const DEFAULT_PICTURE = 'https://dummyimage.com/400x400/fff/aaa';
  const [recentUsers, setRecentUsers] = useState([]);
  const [foundUsers, setFoundUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users/recent')
      .then((response) => {
        return response.json();
      })
      .then((recentUsers) => {
        setRecentUsers(recentUsers);
      });
  }, []);

  function onSubmit(e) {
    e.preventDefault();
    fetch(`/api/users/search?q=${e.target.q.value}`)
      .then((response) => {
        return response.json();
      })
      .then((searchResults) => {
        setFoundUsers(searchResults);
      });
  }

  return (
    <div className="find-people">
      <section>
        <Card className="mt-4">
          <Card.Header as="h2">Recent users</Card.Header>
          <CardGroup className="p-3 d-block">
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {recentUsers.map((user) => {
                return (
                  <Col key={`recent-user-${user.id}`}>
                    <Link className="text-black text-decoration-none" to={`/user/${user.id}`}>
                      <Card className="p-3 align-items-center hoverable-card">
                        <Card.Img variant="top" src={user.profile_picture_url || DEFAULT_PICTURE} />
                        <Card.Title>{`${user.first_name} ${user.last_name}`}</Card.Title>
                        <Card.Text>{user.bio || 'This user has no bio yet!'}</Card.Text>
                      </Card>
                    </Link>
                  </Col>
                );
              })}
            </Row>
          </CardGroup>
        </Card>
      </section>
      <section>
        <Card className="my-4">
          <Card.Header as="h2">Search user</Card.Header>
          <Form onSubmit={onSubmit}>
            <Form.Group className="m-3" controlId="findPeople.search">
              <InputGroup>
                <Form.Control
                  type="search"
                  name="q"
                  placeholder="Enter an user's name"
                  aria-label="Recipient's username"
                />
                <Button variant="primary">Search</Button>
              </InputGroup>
            </Form.Group>
          </Form>
          <CardGroup className="d-block">
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {foundUsers.map((user) => {
                return (
                  <Col key={`found-user-${user.id}`}>
                    <Link className="text-black text-decoration-none" to={`/user/${user.id}`}>
                      <Card className="p-3 align-items-center hoverable-card ">
                        <Card.Img variant="top" src={user.profile_picture_url || DEFAULT_PICTURE} />
                        <Card.Title>{`${user.first_name} ${user.last_name}`}</Card.Title>
                        <Card.Text>{user.bio || 'This user has no bio yet!'}</Card.Text>
                      </Card>
                    </Link>
                  </Col>
                );
              })}
            </Row>
          </CardGroup>
        </Card>
      </section>
    </div>
  );
};

export default FindPeople;
