import React from 'react';

const Profile = (props) => {
  return (
    <>
      <div className="container">
        <h1>{props.match.params.username}</h1>
      </div>
    </>
  )
}

export default Profile;