import { useAuth } from 'contexts/AuthContext';
import { API_URL } from 'Global.d';
import { useEffect, useState } from 'react';

const AdminPanel = () => {
  const [modUser, setModUser] = useState<string>();
  const [unmodUser, setUnmodUser] = useState<string>();
  const [banUser, setBanUser] = useState<string>();
  const [hideMemeId, setHideMemeId] = useState<string>();
  const [showMemeId, setShowMemeId] = useState<string>();
  const [isAuthorized, setAuthorized] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'MODERATOR' || user?.role === 'ADMIN') setAuthorized(true);
  }, [user?.role]);

  const modUserHandler = async (e: any) => {
    e.preventDefault();
    await fetch(`${API_URL}/user/mod_user`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: modUser }),
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => window.alert(data));
  };

  const banUserHandler = async (e: any) => {
    e.preventDefault();
    await fetch(`${API_URL}/user/ban_user`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: banUser }),
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => window.alert(JSON.stringify(data)));
  };

  const unmodUserHandler = async (e: any) => {
    e.preventDefault();
    await fetch(`${API_URL}/user/unmod_user`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: unmodUser }),
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => window.alert(JSON.stringify(data)));
  };

  const hideMemeHandler = async (e: any) => {
    e.preventDefault();
    await fetch(`${API_URL}/meme/hide_meme`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memeId: hideMemeId }),
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => window.alert(JSON.stringify(data)));
  };

  const showMemeHandler = async (e: any) => {
    e.preventDefault();
    await fetch(`${API_URL}/meme/show_meme`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memeId: showMemeId }),
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => window.alert(JSON.stringify(data)));
  };

  if (isAuthorized) {
    return (
      <div className="flex flex-col p-2 space-y-2">
        <div className="row">
          <span>Moderator username </span>{' '}
          <input
            onChange={(e) => setModUser(e.target.value)}
            className="rounded-md border-black border px-1"
          ></input>{' '}
          <button
            className="bg-once-500 px-1 rounded-md border-black/50 border-2"
            onClick={(e) => {
              modUserHandler(e);
            }}
          >
            Mod user
          </button>
        </div>
        <div className="row">
          <span>Unmod username </span>{' '}
          <input
            onChange={(e) => setUnmodUser(e.target.value)}
            className="rounded-md border-black border px-1"
          ></input>{' '}
          <button
            className="bg-once-500 px-1 rounded-md border-black/50 border-2"
            onClick={(e) => {
              unmodUserHandler(e);
            }}
          >
            Unmod user
          </button>
        </div>
        <div className="row">
          <span>Ban username </span>{' '}
          <input
            onChange={(e) => setBanUser(e.target.value)}
            className="rounded-md border border-black px-1"
          ></input>{' '}
          <button
            className="bg-once-500 px-1 rounded-md border-black/50 border-2"
            onClick={(e) => {
              banUserHandler(e);
            }}
          >
            Ban user
          </button>
        </div>
        <div className="row">
          <span>Hide meme: </span>{' '}
          <input
            onChange={(e) => setHideMemeId(e.target.value)}
            className="rounded-md border border-black px-1"
          ></input>{' '}
          <button
            className="bg-once-500 px-1 rounded-md border-black/50 border-2"
            onClick={(e) => {
              hideMemeHandler(e);
            }}
          >
            Hide Meme id
          </button>
        </div>
        <div className="row">
          <span>Show meme: </span>{' '}
          <input
            onChange={(e) => setShowMemeId(e.target.value)}
            className="rounded-md border border-black px-1"
          ></input>{' '}
          <button
            className="bg-once-500 px-1 rounded-md border-black/50 border-2"
            onClick={(e) => {
              showMemeHandler(e);
            }}
          >
            Show Meme id
          </button>
        </div>
      </div>
    );
  } else {
    return null;
  }
};
export default AdminPanel;
