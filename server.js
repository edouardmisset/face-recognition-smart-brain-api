const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');

// bcrypt options
const saltRounds = 10;

const app = express();

app.use(express.json());
app.use(cors());

const database = {
  users: [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 4,
      joined: new Date(),
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'jane@gmail.com',
      password: 'bananas',
      entries: 2,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: 1,
      email: 'john@gmail.com',
      hash: '',
    },
  ],
};

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// / --> res = this is working
app.get('/', (req, res) => {
  res.send(database.users);
});

// /signin --> POST success / fail

app.post('/signin', (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.send(database.users[0]);
  } else {
    res.status(401).json('error logging in');
  }
});

// /register --> POST res = new user
app.post('/register', (req, res) => {
  const { email, name, password } = req.body;

  bcrypt.hash(password, saltRounds).then(hash => {
    // Store hash in your password DB.
    console.log(hash);
  });

  const newUser = {
    id: database.users.length + 1,
    name,
    email,
    entries: 0,
    joined: new Date(),
  };
  database.users.push(newUser);
  res.send(newUser);
});

// /profile/:userId --> GET res = user
app.get('/profile/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.send(user);
    }
  });
  if (!found) {
    res.status(404).send('user not found');
  }
});

// /image --> POST --> res = user
app.put('/image', (req, res) => {
  const { id } = req.body;
  const user = database.users.find(user => user.id === id);
  if (user) {
    user.entries++;
    res.json(user.entries);
  } else {
    res.status(404).send('user not found');
  }
});
