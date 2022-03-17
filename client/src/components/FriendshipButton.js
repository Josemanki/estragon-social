import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

const FriendshipButton = ({ id }) => {
  const [buttonText, setButtonText] = useState('');
  const [existing, setExisting] = useState(false);
  const [incoming, setIncoming] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const handleButtonClick = () => {
    if (!existing) {
      fetch(`/api/friendships/${id}`, {
        method: 'POST',
      })
        .then((response) => response.json())
        .then(() => {
          setExisting(true);
        });
      return;
    }
    if (incoming && !accepted) {
      fetch(`/api/friendships/${id}`, {
        method: 'PUT',
      })
        .then((response) => response.json())
        .then(() => {
          setAccepted(true);
        });
      return;
    }
    fetch(`/api/friendships/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then(() => {
        setExisting(false);
        setIncoming(false);
        setAccepted(false);
      });
  };

  useEffect(() => {
    fetch(`/api/friendships/${id}`)
      .then((response) => response.json())
      .then((friendship) => {
        if (friendship.error) {
          setExisting(false);
          setIncoming(false);
          setAccepted(false);
          return;
        }
        setExisting(true);
        if (friendship.accepted) {
          setAccepted(true);
          return;
        }
        if (friendship.sender_id == id) {
          setIncoming(true);
        }
      });
  }, [id]);

  useEffect(() => {
    if (!existing) {
      setButtonText('Add to Friends');
      return;
    }
    if (accepted) {
      setButtonText('Unfriend');
      return;
    }
    if (incoming) {
      setButtonText('Accept Friendship');
      return;
    }
    setButtonText('Cancel Request');
  }, [existing, incoming, accepted]);
  return <Button onClick={handleButtonClick}>{buttonText}</Button>;
};

export default FriendshipButton;
