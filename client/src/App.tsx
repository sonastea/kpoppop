import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './components/Home';
import Login from './components/user/Login';
import Register from './components/user/Register';
import NavBar from './components/NavBar';
import Profile from './components/user/Profile';
import MemePage from 'components/meme/MemePage';
import Post from './components/meme/Post';
import ContactUs from 'components/ContactUs';
import { AuthProvider } from 'contexts/AuthContext';
import EditProfile from 'components/user/EditProfile';
import RegisterRedirect from 'components/user/RegisterRedirect';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <>
          <NavBar />
        </>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="memes" element={<MemePage />} />
          <Route path="meme/:memeid/" element={<Post />} />
          <Route path="meme/:memeid/:title" element={<Post />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="register/redirect" element={<RegisterRedirect />} />
          <Route path="user/:username" element={<Profile />} />
          <Route path="profile/settings" element={<EditProfile />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
