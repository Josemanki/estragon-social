import LoginForm from '../components/LoginForm';

const Login = () => {
  return (
    <div id="login">
      <h1>Sign in!</h1>
      <LoginForm />
    </div>
  );
};

fetch('/api/users/me')
  .then((response) => response.json())
  .then((user) => {
    if (!user) {
      history.replaceState({}, '', '/');
      return;
    }
  });

export default Login;
