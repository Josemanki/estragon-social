import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email_address: '', password: '' });
  const [error, setError] = useState('');

  const onInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = response.json();
      if (result.error) {
        setError(result.error);
        return;
      }
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      <Form.Text>
        Already a user? <Link to="/login">Log in</Link> here!
      </Form.Text>

      {error && (
        <Alert variant="danger">
          <Alert.Heading>Oh snap! We've got an error!</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}

      <Form.Group className="mb-3" controlId="registerFirstName">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={onInputChange}
          placeholder="First Name"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="registerLastName">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={onInputChange}
          placeholder="Last Name"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="registerEmail">
        <Form.Label>Email Address</Form.Label>
        <Form.Control
          type="email"
          name="email_address"
          value={formData.email}
          onChange={onInputChange}
          placeholder="Enter email"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="registerPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={formData.password}
          onChange={onInputChange}
          placeholder="Password"
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default RegisterForm;
