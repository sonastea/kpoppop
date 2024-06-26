import ErrorPage from 'components/ErrorPage';
import LoadingUI from 'components/LoadingUI';
import { AuthProvider } from 'contexts/AuthContext';
import { Suspense, lazy } from 'react';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from './components/NavBar';

const MemePage = lazy(() => import('components/meme/MemePage'));
const Post = lazy(() => import('components/meme/Post'));
const ContactUs = lazy(() => import('components/ContactUs'));
const Login = lazy(() => import('./components/user/Login'));
const Register = lazy(() => import('./components/user/Register'));
const RegisterRedirect = lazy(() => import('./components/user/RegisterRedirect'));
const VerifyEmail = lazy(() => import('./components/user/VerifyEmail'));
const Profile = lazy(() => import('./components/user/Profile'));
const Messages = lazy(() => import('./components/user/Messages'));
const EditProfile = lazy(() => import('./components/user/EditProfile'));
const AdminPanel = lazy(() => import('components/admin/AdminPanel'));

const preconnectApi =
  process.env.NODE_ENV === 'production' ? 'https://api.kpoppop.com' : 'https://localhost:5000';

const Layout = () => {
  const initialUser = JSON.parse(sessionStorage.getItem('current-user')!) ?? undefined;

  return (
    <AuthProvider initialUser={initialUser}>
      <link rel="preconnect" href="https://ik.imagekit.io" />
      <link rel="preconnect" href={preconnectApi} />
      <ToastContainer
        autoClose={1000}
        bodyClassName="toastifyBody"
        closeOnClick
        draggable
        hideProgressBar={true}
        position="top-right"
        limit={3}
      />
      <Suspense fallback={<LoadingUI />}>
        <NavBar />
        <div className="mt-nav-mobile sm:mt-nav-larger">
          <Outlet />
        </div>
      </Suspense>
    </AuthProvider>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    ErrorBoundary: ErrorPage,
    children: [
      { index: true, Component: MemePage },
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
  },
]);

const App = () => {
  return (
    <RouterProvider
      router={router}
      fallbackElement={<LoadingUI />}
      future={{ v7_startTransition: true }}
    />
  );
};

export default App;
