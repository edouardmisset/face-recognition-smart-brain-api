const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { handleRegister } = require('./controllers/register');
const { handleSignin } = require('./controllers/signin');
const { handleProfileGet } = require('./controllers/profile');
const { handleImage } = require('./controllers/image');

const db = require('knex')({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'edouard',
    password: '',
    database: 'smart-brain',
  },
});

// bcrypt options
const saltRounds = 10;

const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// / --> res = this is working
app.get('/', (req, res) => {
  db.select('*')
    .from('users')
    .then(users => res.send(users));
});

// /signin --> POST success / fail

app.post('/signin', (req, res) => handleSignin(req, res, db, bcrypt));

// /register --> POST res = new user
app.post('/register', (req, res) =>
  handleRegister(req, res, db, bcrypt, saltRounds)
);

// /profile/:userId --> GET res = user
app.get('/profile/:id', (req, res) => handleProfileGet(req, res, db));

// /image --> POST --> res = user
app.put('/image', (req, res) => handleImage(req, res, db));
