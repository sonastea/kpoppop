import AdminPanel from 'components/admin/AdminPanel';
import ContactUs from 'components/ContactUs';
import MemePage from 'components/meme/MemePage';
import EditProfile from 'components/user/EditProfile';
import Messages from 'components/user/Messages';
import RegisterRedirect from 'components/user/RegisterRedirect';
import VerifyEmail from 'components/user/VerifyEmail';
import { AuthProvider } from 'contexts/AuthContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Post from './components/meme/Post';
import NavBar from './components/NavBar';
import Login from './components/user/Login';
import Profile from './components/user/Profile';
import Register from './components/user/Register';

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
          <Route path="email/verify" element={<VerifyEmail />} />
          <Route path="user/:username" element={<Profile />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile/settings" element={<EditProfile />} />
          <Route path="employees-only-do-not-enter" element={<AdminPanel />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
