import { Button } from 'react-bootstrap';

const Profile = () => {
  const doSomething = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    await fetch('http://localhost:5000/user/profile', {
      method: 'GET',
      credentials: 'include',
    }).then(res => res.json()).then(data => console.log(data));

  };

  return <Button onClick={doSomething}>Refresh Token</Button>;
};

export default Profile;
