import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';

const PictureModal = ({ modalVisible, setModalVisible, setUser }) => {
  const [uploadedPicture, setUploadedPicture] = useState('');

  const handleClose = () => {
    setModalVisible(false);
  };

  const populateUploadedPicture = (e) => {
    setUploadedPicture(e.target.files[0].name);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const file = e.target.image.files[0];
    const body = new FormData();

    // use the same name inside the multer middleware!
    body.append('profile_picture', file);

    fetch('/api/users/me/picture', {
      method: 'POST',
      body,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.error) {
          console.log(response.error);
          return;
        }
        console.log(response);
        setUser((prevState) => ({ ...prevState, profile_picture_url: response.profile_picture_url }));
        setModalVisible(false);
      });
  };
  return (
    <>
      <Modal show={modalVisible} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Change profile picture</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>You can upload a profile picture here</p>
          <form className="form" onSubmit={handleFormSubmit}>
            <p>Uploaded file: {uploadedPicture ? uploadedPicture : 'None'}</p>
            <label htmlFor="form-upload" className="btn btn-secondary mx-2">
              Select File
            </label>
            <input
              type="file"
              id="form-upload"
              accept="image/*"
              className="form-upload"
              name="image"
              onChange={populateUploadedPicture}
              required
            />
            <Button type="submit" disabled={!uploadedPicture}>
              Upload
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PictureModal;
