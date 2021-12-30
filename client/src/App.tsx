import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './components/Home';
import Login from './components/user/Login';
import Signup from './components/user/Signup';
import NavBar from './components/NavBar';
import Profile from './components/user/Profile';
import ValidateToken from './components/auth/ValidateToken';
import Memes from './components/meme/Memes';
import Post from './components/meme/Post';
import useAuth, { AuthProvider } from './contexts/AuthContext';

const App = () => {
  const { user } = useAuth();

  return (
    <AuthProvider>
      <BrowserRouter>
        <>
          <NavBar />
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
    </AuthProvider>
  );
};

export default App;
