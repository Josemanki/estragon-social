import { BrowserRouter, Route } from 'react-router-dom';
import Registration from './Registration';
import Login from './Login';
import ResetPassword from './ResetPassword';

const Welcome = () => {
  return (
    <div id="welcome">
      <h1>Social Media Name</h1>
      <BrowserRouter>
        <div>
          <Route exact path="/">
            <Registration />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/reset-password">
            <ResetPassword />
          </Route>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default Welcome;
