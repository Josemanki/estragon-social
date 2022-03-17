import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import FriendshipButton from '../components/FriendshipButton';
import ProfilePicture from '../components/ProfilePicture';

const OtherProfile = () => {
  const params = useParams();
  const history = useHistory();
  const [userData, setUserData] = useState({});
  useEffect(() => {
    fetch(`/api/users/${params.user_id}`)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.error) {
          history.replace('/');
          return;
        }
        setUserData(res);
      });
  }, []);

  return (
    <div className="d-flex my-4">
      <div className="d-flex flex-column gap-2">
        <ProfilePicture avatar={userData.profile_picture_url} size={'big'} />
        <FriendshipButton id={params.user_id} />
      </div>
      <div className="d-flex flex-column mx-4">
        <h2>{`${userData.first_name}'s Profile`}</h2>
      </div>
    </div>
  );
};

export default OtherProfile;
