import { BrowserRouter, Route } from 'react-router-dom';
import Registration from './Registration';
import Login from './Login';
import ResetPassword from './ResetPassword';

const Welcome = () => {
  return (
    <div id="welcome">
      <a className="text-decoration-none" href="/">
        <h1 className="fw-bold text-primary ">Facebook(Not)</h1>
      </a>
      <BrowserRouter>
        <Route exact path="/">
          <Registration />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/reset-password">
          <ResetPassword />
        </Route>
      </BrowserRouter>
    </div>
  );
};

export default Welcome;
