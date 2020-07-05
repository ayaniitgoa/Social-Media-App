import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import { Container } from 'semantic-ui-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/dist/util';
import 'bootstrap/js/dist/dropdown';
import './App.css';

import AuthRoute from './utils/AuthRoute';
import { AuthProvider } from './context/auth';
import Menubar from './components/MenuBar';
import Home from '../src/pages/Home';
import Login from '../src/pages/Login';
import Register from '../src/pages/Register';
import SinglePost from './pages/SinglePost';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <Menubar />
          <Route exact path='/' component={Home} />
          <AuthRoute exact path='/login' component={Login} />
          <AuthRoute exact path='/register' component={Register} />
          <Route
            path='/posts/:postId'
            render={(props) => <SinglePost {...props} />}
          />
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
