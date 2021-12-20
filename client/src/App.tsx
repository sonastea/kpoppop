import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './components/Home';
import Login from './components/user/Login';
import Signup from './components/user/Signup';
import NavBar from './components/NavBar';
import Profile from './components/user/Profile';
import { useContext, useEffect, useState } from 'react';
import AuthContext from './contexts/AuthContext';
import ValidateToken from './components/auth/ValidateToken';
import Memes from './components/meme/Memes';
import Post from './components/meme/Post';

const App = () => {
  const [user, setUser] = useState(useContext(AuthContext));

  useEffect(() => {
    const checkUser = async () => {
      await fetch('http://localhost:5000/auth/check-user', {
        method: 'GET',
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((data) => {
          if (data._id === null) {
            ValidateToken()
              .then((res) => res.json())
              .then((data) => setUser(data));
          } else {
            setUser(data);
          }
        });
    };
    checkUser();
    setInterval(checkUser, 15 * 60 * 1000);
  }, []);

  return (
    <BrowserRouter>
      <>
        <NavBar username={user.username} />
      </>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/memes" element={<Memes />} />
        <Route path="/meme/:memeid/:title" element={<Post />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/user/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
