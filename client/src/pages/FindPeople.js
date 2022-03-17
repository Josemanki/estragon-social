import { useState, useEffect } from 'react';
import { useParams } from 'react-router';

const FindPeople = () => {
  const DEFAULT_PICTURE = 'https://dummyimage.com/400x400/fff/aaa';
  const [recentUsers, setRecentUsers] = useState([]);
  const [foundUsers, setFoundUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users/recent')
      .then((response) => {
        return response.json();
      })
      .then((recentUsers) => {
        setRecentUsers(recentUsers);
      });
  }, []);

  function onSubmit(e) {
    e.preventDefault();
    fetch(`/api/users/search?q=${e.target.q.value}`)
      .then((response) => {
        return response.json();
      })
      .then((searchResults) => {
        setFoundUsers(searchResults);
      });
  }

  return (
    <div className="find-people">
      <h1>Find People</h1>
      <section>
        <h2>Recent users</h2>
        <ul>
          {recentUsers.map((user) => {
            return (
              <li className="" key={user.id}>
                <img
                  src={user.profile_picture_url || DEFAULT_PICTURE}
                  alt="Profile Picture"
                  className="profile-picture-small"
                />
                {`${user.first_name} ${user.last_name}`}
              </li>
            );
          })}
        </ul>
      </section>
      <section>
        <h2>Search results</h2>
        <form onSubmit={onSubmit}>
          <input type="search" name="q" required minLength={3} placeholder="Search users..." />
        </form>
        {foundUsers.map((user) => (
          <li className="" key={user.id}>
            <img
              src={user.profile_picture_url || DEFAULT_PICTURE}
              alt="Profile Picture"
              className="profile-picture-small"
            />
            {`${user.first_name} ${user.last_name}`}
          </li>
        ))}
      </section>
    </div>
  );
};

export default FindPeople;
