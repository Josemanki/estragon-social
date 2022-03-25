import LoginForm from '../components/LoginForm';

const Login = () => {
  return (
    <div id="login" className="form-wrapper">
      <h2 className="mt-4">Sign in!</h2>
      <LoginForm />
    </div>
  );
};

// fetch('/api/users/me')
//   .then((response) => response.json())
//   .then((user) => {
//     if (user) {
//       // history.replaceState({}, '', '/');
//       return;
//     }
//   });

export default Login;
