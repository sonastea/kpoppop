import React, { useContext, useEffect }  from 'react';
import NavBar from './components/NavBar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './components/Home';
import Meme from './components/Meme/Meme';
import PostMeme from './components/Meme/PostMeme';
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import Logout from './components/auth/Logout';
import Profile from './components/Profile';
import CheckSession from './components/auth/CheckSession';
import AuthContext from './contexts/AuthContext';


const App = () => {
  const user = useContext(AuthContext);

  useEffect(() => {
    CheckSession({user});
  }, [user]);

  return (
      <Router>
        <>
          <NavBar isLoggedIn={user.isLoggedIn} username={user.username} />
        </>

        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/memes' component={PostMeme} />
          <Route exact path='/meme/:memeid/:title' component={Meme} />
          <Route exact path='/signup' component={Signup} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/logout' component={Logout} />
          <Route exact path='/profile/:username' component={Profile} />
        </Switch>

      </Router>
  );
}

export default App;