import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import ProfilePicture from '../components/ProfilePicture';
import BioEditor from '../components/BioEditor';

const OtherProfile = () => {
  const params = useParams();
  const history = useHistory();
  const [userData, setUserData] = useState({});
  useEffect(() => {
    fetch(`/api/users/${params.user_id}`)
      .then((res) => {
        console.log(params);
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
      <ProfilePicture avatar={userData.profile_picture_url} size={'big'} />
      <div className="d-flex flex-column mx-4">
        <h2>{`${userData.first_name}'s Profile`}</h2>
      </div>
    </div>
  );
};

export default OtherProfile;
