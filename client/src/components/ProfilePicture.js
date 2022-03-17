const ProfilePicture = ({ avatar, setModalVisible, size, isEditable }) => {
  const DEFAULT_PICTURE = 'https://dummyimage.com/400x400/fff/aaa';

  const handlePictureClick = () => {
    setModalVisible(true);
  };

  return (
    <div className="mx-2" onClick={isEditable ? handlePictureClick : undefined}>
      <img
        src={avatar || DEFAULT_PICTURE}
        className={`avatar profile-picture-${size || 'small'} ${isEditable && 'cursor-pointer'}`}
      />
    </div>
  );
};

export default ProfilePicture;
