import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './components/Home';
import Login from './components/user/Login';
import Register from './components/user/Register';
import NavBar from './components/NavBar';
import Profile from './components/user/Profile';
import Memes from './components/meme/Memes';
import Post from './components/meme/Post';
import { AuthProvider } from './contexts/AuthContext';

const App = () => {

  return (
    <AuthProvider>
      <BrowserRouter>
        <>
          <NavBar />
        </>

        <Routes>
          <Route path="/" element={<Home />} />
            <Route path="memes" element={<Memes />} />
            <Route path="meme/:memeid/:title" element={<Post />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="user/profile/:username" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
