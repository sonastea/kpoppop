import AdminPanel from 'components/admin/AdminPanel';
import ContactUs from 'components/ContactUs';
import MemePage from 'components/meme/MemePage';
import EditProfile from 'components/user/EditProfile';
import Messages from 'components/user/Messages';
import RegisterRedirect from 'components/user/RegisterRedirect';
import VerifyEmail from 'components/user/VerifyEmail';
import { AuthProvider } from 'contexts/AuthContext';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/Home';
import Post from './components/meme/Post';
import NavBar from './components/NavBar';
import Login from './components/user/Login';
import Profile from './components/user/Profile';
import Register from './components/user/Register';

const Layout = () => {
  return (
    <AuthProvider>
      <ToastContainer
        autoClose={1000}
        bodyClassName="toastifyBody"
        closeOnClick
        draggable
        hideProgressBar={true}
        position="top-right"
        limit={3}
      />
      <NavBar />
      <Outlet />
    </AuthProvider>
  );
};

const router = createBrowserRouter([
  {
    path: '*',
    children: [
      { index: true, Component: Home },
      { path: 'memes', Component: MemePage },
      { path: 'meme/:memeid/', Component: Post },
      { path: 'meme/:memeid/:title', Component: Post },
      { path: 'contact', Component: ContactUs },
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
      { path: 'register/redirect', Component: RegisterRedirect },
      { path: 'email/verify', Component: VerifyEmail },
      { path: 'user/:username', Component: Profile },
      { path: 'messages', Component: Messages },
      { path: 'profile/settings', Component: EditProfile },
      { path: 'employees-only-do-not-enter', Component: AdminPanel },
    ],
    Component: Layout,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
