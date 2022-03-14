const ProfilePicture = ({ avatar, setModalVisible, size }) => {
  const DEFAULT_PICTURE = 'https://dummyimage.com/400x400/fff/aaa';

  return (
    <div
      className="mx-2"
      onClick={() => {
        setModalVisible(true);
      }}
    >
      <img src={avatar || DEFAULT_PICTURE} className={`header-avatar profile-picture-${size || 'small'} `} />
    </div>
  );
};

export default ProfilePicture;
