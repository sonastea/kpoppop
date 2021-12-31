import { Button } from 'react-bootstrap';
import { API_URL } from '../../Global.d';

const Profile = () => {
  const doSomething = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    await fetch(API_URL + 'user/profile', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  return <Button onClick={doSomething}>Refresh Token</Button>;
};

export default Profile;
