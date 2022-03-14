import { Button } from 'react-bootstrap';
import { useState } from 'react';

const BioEditor = ({ bio, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditButton = (e) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    fetch('/api/users/me/bio', {
      method: 'POST',
      body: JSON.stringify({ bio: e.target.bio.value }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.error) {
          console.log(response.error);
          return;
        }
        console.log(response);
        setUser((prevState) => ({ ...prevState, bio: response.bio }));
        setIsEditing(false);
      });
  };

  return (
    <div>
      {!bio && !isEditing && (
        <>
          <Button onClick={handleEditButton} className="px-0" variant="link">
            You don't have a bio yet. Add one here!
          </Button>
        </>
      )}
      {isEditing && (
        <>
          <form onSubmit={handleFormSubmit}>
            <textarea defaultValue={bio} name="bio" id="bio" cols="40" rows="5"></textarea>
            <Button type="submit" className="d-block mx-auto">
              Save
            </Button>
          </form>
        </>
      )}
      {bio && !isEditing && (
        <>
          <p>{bio}</p>
          <Button onClick={handleEditButton} className="d-block mx-auto">
            Edit
          </Button>
        </>
      )}
    </div>
  );
};

export default BioEditor;
