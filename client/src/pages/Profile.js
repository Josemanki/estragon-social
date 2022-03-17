import ProfilePicture from '../components/ProfilePicture';
import BioEditor from '../components/BioEditor';

const Profile = ({ userData, setUser }) => {
  return (
    <div className="d-flex my-4">
      <ProfilePicture isEditable avatar={userData.profile_picture_url} size={'big'} />
      <div className="d-flex flex-column mx-4">
        <h2>{`${userData.first_name}'s Profile`}</h2>
        <BioEditor setUser={setUser} bio={userData.bio} />
      </div>
    </div>
  );
};

export default Profile;
