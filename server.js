const express = require('express');

const app = express();

app.use(express.json());

const database = {
  users: [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@gmail.com',
      password: '12345678',
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
};

app.listen(3000, () => {
  console.log('Server listening on port 3000');
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
    res.json('success');
  } else {
    res.status(401).json('error logging in');
  }
});

// /register --> POST res = new user
app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const newUser = {
    id: database.users.length + 1,
    name,
    email,
    password,
    entries: 0,
    joined: new Date(),
  };
  database.users.push(newUser);
  res.send(newUser);
});

/*

/profile/:userId --> GET res = user
/image --> PUT --> res = user

*/
