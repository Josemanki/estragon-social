const express = require('express');
const { Bucket, s3upload } = require('./s3');
const { uploader } = require('./uploader');
const app = express();
const cookieSession = require('cookie-session');
const compression = require('compression');
const path = require('path');
const {
  createUser,
  getUserById,
  login,
  getUserByEmail,
  updatePassword,
  addPasswordResetCode,
  findPasswordResetCode,
  updateProfilePicture,
  updateUserBio,
  getRecentUsers,
  searchUsers,
} = require('./db');
const cryptoRandomString = require('crypto-random-string');

const { SESSION_SECRET } = require('../secrets.json');
const PORT = 3001;

app.use(compression());

app.use(express.static(path.join(__dirname, '..', 'client', 'public')));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(
  cookieSession({
    secret: SESSION_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 14,
    sameSite: true,
  })
);

app.post('/api/users', (req, res) => {
  createUser(req.body)
    .then((user) => {
      console.log(`Created user: ${user.id}`);
      req.session.user_id = user.id;
      res.json({});
    })
    .catch((error) => {
      console.log(error);
      if (error.constraint === 'users_email_key') {
        res.status(400).json({
          error: 'That email already exists',
        });
        return;
      }
      if (error.code === '23502') {
        res.status(400).json({
          error: 'All fields must be filled!',
        });
      }
      res.status(400).json({
        error: 'Oops! An error has occurred. Try again later.',
      });
    });
});

app.post('/api/login', (req, res) => {
  const { email_address, password } = req.body;
  if (!email_address || !password) {
    res.status(400).json({
      error: 'You must fill out every field!',
    });
    return;
  }

  login(req.body).then((foundUser) => {
    if (!foundUser) {
      res.status(401).json({
        error: 'Some data doesnt seem alright, please check it out!',
      });
    } else {
      req.session.user_id = foundUser.id;
      res.json({});
    }
  });
});

app.post('/api/password/reset', async (req, res) => {
  const { email_address } = req.body;
  if (!email_address) {
    res.status(400).json({
      error: 'You need to provide an email address first!',
    });
    return;
  }
  const foundUser = await getUserByEmail(email_address);
  if (!foundUser) {
    res.status(400).json({
      error: 'This email does not match any registered one.',
    });
    return;
  }
  const code = cryptoRandomString({ length: 6 });
  await addPasswordResetCode({ email_address, code });
  res.json({});
});

app.put('/api/password/reset', async (req, res) => {
  const { code, password } = req.body;
  if (!code || !password) {
    res.status(400).json({
      error: 'You need to provide correct information on both fields!',
    });
    return;
  }
  const foundCode = await findPasswordResetCode(code);
  if (!foundCode) {
    res.status(400).json({
      error: 'This code is not correct!',
    });
    return;
  }
  await updatePassword({ email_address: foundCode.email, password });
  res.json({});
});

app.get('/api/users/me', (req, res) => {
  getUserById(req.session.user_id).then((user) => {
    if (!user) {
      res.json(null);
      return;
    }
    const { first_name, last_name, email, profile_picture_url, bio } = user;
    res.json({ first_name, last_name, email, profile_picture_url, bio });
  });
});

app.get('/api/users/recent', async (req, res) => {
  const recentUsers = await getRecentUsers(req.query.limit);
  res.json(recentUsers);
});

app.get('/api/users/:user_id', async (req, res) => {
  getUserById(req.params.user_id).then((user) => {
    if (!user) {
      res.status(404).json({
        error: 'User not found',
      });
      return;
    }
    const { first_name, last_name, email, profile_picture_url, bio } = user;
    res.json({ first_name, last_name, email, profile_picture_url, bio });
  });
});

app.get('/api/users/search', async (req, res) => {
  const foundUsers = await searchUsers(req.query.q);
  res.json(foundUsers);
});

app.post('/api/users/me/picture', uploader.single('profile_picture'), s3upload, (req, res) => {
  const url = `https://s3.amazonaws.com/${Bucket}/${req.file.filename}`;
  updateProfilePicture({ url, user_id: req.session.user_id })
    .then((image) => {
      console.log('an image', image);
      res.json(image);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post('/api/users/me/bio', (req, res) => {
  console.log(req.body);
  updateUserBio({ bio: req.body.bio, user_id: req.session.user_id })
    .then((bio) => {
      res.json(bio);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

app.listen(process.env.PORT || PORT, function () {
  console.log(`[Server] Listening on port ${PORT}.`);
});
