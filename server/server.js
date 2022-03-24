const express = require('express');
const { Bucket, s3upload } = require('./s3');
const { uploader } = require('./uploader');
const app = express();
const cookieSession = require('cookie-session');
const compression = require('compression');
const path = require('path');
const { Server } = require('http');
const socketCreator = require('socket.io');
const server = Server(app);
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
  getFriendship,
  makeNewFriendship,
  acceptFriendship,
  deleteFriendship,
  getFriendships,
  createChatMessage,
  getChatMessages,
} = require('./db');
const cryptoRandomString = require('crypto-random-string');

const { SESSION_SECRET } = require('../secrets.json');
const PORT = 3001;

app.use(compression());

app.use(express.static(path.join(__dirname, '..', 'client', 'public')));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

const cookieSessionMiddleware = cookieSession({
  secret: SESSION_SECRET,
  maxAge: 1000 * 60 * 60 * 24 * 14,
  sameSite: true,
});

const io = socketCreator(server, {
  allowRequest: (req, callback) => callback(null, req.headers.referer.startsWith(`http://localhost:3000/`)),
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
  cookieSessionMiddleware(socket.request, socket.request.res, next);
});

io.on('connection', async (socket) => {
  console.log('[socialnetwork:socket] incoming socket connection', socket.id);
  const { user_id } = socket.request.session;
  if (!user_id) {
    return socket.disconnect(true);
  }

  // send back the latest 10 msgs to every new connected user
  // with socket.emit:
  const messages = await getChatMessages({ limit: 10 });
  socket.emit('recentMessages', messages.reverse());

  socket.on('sendMessage', async ({ text }) => {
    // save to db
    const message = await createChatMessage({
      sender_id: user_id,
      text,
    });

    console.log(message);
    // get user info
    const user = await getUserById(user_id);
    const { first_name, last_name, profile_picture_url } = user;

    // forward it to everybody - use io.emit!
    io.emit('newMessage', {
      first_name,
      last_name,
      profile_picture_url,
      ...message,
    });
  });
});

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
  console.log(req.query.q);
  // const foundUsers = await searchUsers(req.query.q);
  // res.json(foundUsers);
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

app.get('/api/friendships', async (req, res) => {
  const friendships = await getFriendships(req.session.user_id);
  res.json(friendships);
});

app.get('/api/friendships/:target_id', async (req, res) => {
  const friendship = await getFriendship({
    first_id: req.session.user_id,
    second_id: req.params.target_id,
  });

  if (!friendship) {
    res.status(404).json({
      error: `No friendship between users ${req.session.user_id} and ${req.params.target_id}`,
    });
    return;
  }
  res.json(friendship);
});

app.post('/api/friendships/:target_id', async (req, res) => {
  try {
    await makeNewFriendship({
      sender_id: req.session.user_id,
      recipient_id: +req.params.target_id,
    });
    res.json({
      message: `Successfully sent a friendship request!`,
    });
  } catch (error) {
    console.log(error);
    res.json({
      error: `An error has occurred, try again later.`,
    });
  }
});

app.put('/api/friendships/:target_id', async (req, res) => {
  try {
    await acceptFriendship({
      sender_id: req.params.target_id,
      recipient_id: req.session.user_id,
    });
    res.json({
      message: `You are now friends!`,
    });
  } catch (error) {
    console.log(error);
    res.json({
      error: `An error has occurred, try again later.`,
    });
  }
});

app.delete('/api/friendships/:target_id', async (req, res) => {
  try {
    await deleteFriendship({
      first_id: req.session.user_id,
      second_id: req.params.target_id,
    });
    res.json({
      message: `You are no longer friends.`,
    });
  } catch (error) {
    console.log(error);
    res.json({
      error: `An error has occurred, try again later.`,
    });
  }
});

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

server.listen(process.env.PORT || PORT, function () {
  console.log(`[Server] Listening on port ${PORT}.`);
});
