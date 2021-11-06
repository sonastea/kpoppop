export const LoginStatus = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const status = JSON.parse(isLoggedIn);
  return status;
}