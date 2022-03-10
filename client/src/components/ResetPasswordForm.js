import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ResetPasswordForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email_address: '',
    error: '',
    password: '',
    code: '',
  });

  const onInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleOnSubmit = async (e, step) => {
    e.preventDefault();
    console.log(step);
    switch (step) {
      case 1:
        try {
          const response = await fetch('/api/password/reset', {
            method: 'POST',
            body: JSON.stringify({ email_address: formData.email_address }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const result = await response.json();
          if (result.error) {
            setFormData((prevState) => ({ ...prevState, error: result.error }));
            return;
          }
          setFormData((prevState) => ({ ...prevState, error: result.error }));
          setStep(2);
        } catch (error) {
          console.log(error);
        }
        break;
      case 2:
        try {
          const response = await fetch('/api/password/reset', {
            method: 'PUT',
            body: JSON.stringify({ password: formData.password, code: formData.code }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const result = await response.json();
          if (result.error) {
            setFormData((prevState) => ({ ...prevState, error: result.error }));
            return;
          }
          setFormData((prevState) => ({ ...prevState, error: result.error }));
          setStep(3);
        } catch (error) {
          console.log(error);
        }
        break;

      default:
        break;
    }
  };

  const renderStep = (step) => {
    const steps = [
      <div>
        <Form.Group className="mb-3" controlId="registerEmail">
          <p>Enter your registered email address</p>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            name="email_address"
            value={formData.email_address}
            onChange={onInputChange}
            placeholder="Enter email"
            required
          />
        </Form.Group>
        <Button type="submit">Submit</Button>
      </div>,
      <div>
        <p>Enter your new password</p>
        <Form.Group className="mb-3" controlId="resetPasswordPassword">
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

        <Form.Group className="mb-3" controlId="resetPasswordCode">
          <Form.Label>Code</Form.Label>
          <Form.Control
            type="password"
            name="code"
            value={formData.code}
            onChange={onInputChange}
            placeholder="Code"
            required
          />
        </Form.Group>
        <Button type="submit">Submit</Button>
      </div>,
      <div>
        <h2>Success!</h2>
        <p>
          Your password has been changed, and you can <Link to="/">Log in</Link> now!
        </p>
      </div>,
    ];
    return steps[step - 1];
  };
  return (
    <Form onSubmit={(e) => handleOnSubmit(e, step)}>
      {formData.error && (
        <Alert variant="danger">
          <Alert.Heading>Oh snap! We've got an error!</Alert.Heading>
          <p>{formData.error}</p>
        </Alert>
      )}
      {renderStep(step)}
    </Form>
  );
};

export default ResetPasswordForm;
