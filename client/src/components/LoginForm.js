import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

const LoginForm = () => {
  let history = useHistory();
  const [formData, setFormData] = useState({ email_address: '', password: '' });
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
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      if (result.error) {
        setError(result.error);
        return;
      }
      history.push('/');
      location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Text>
        Don't have an account? <Link to="/">Sign up</Link> here!
      </Form.Text>

      {error && (
        <Alert variant="danger">
          <Alert.Heading>Oh snap! We've got an error!</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}

      <Form.Group className="mb-3" controlId="registerEmail">
        <Form.Label>Email</Form.Label>
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

export default LoginForm;
