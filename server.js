const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
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
  const { email, password } = req.body;

  db.select('email', 'hash')
    .from('login')
    .where({ email })
    .then(user =>
      bcrypt.compareSync(password, user[0].hash)
        ? db
            .select('*')
            .from('users')
            .where({ email })
            .then(user => {
              res.send(user[0]);
            })
            .catch(err => {
              res.status(400).send('Unable to get user');
            })
        : res.status(401).send('Wrong credentials')
    )
    .catch(err => {
      res.status(400).send('Error loggin in');
    });
});

// /register --> POST res = new user
app.post('/register', (req, res) => {
  const { email, name, password } = req.body;

  bcrypt.hash(password, saltRounds).then(hash => {
    // Store hash in your password DB.
    db.transaction(trx => {
      trx
        .insert({
          email,
          hash,
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
          return trx('users')
            .returning('*')
            .insert({
              email: loginEmail[0],
              name,
              joined: new Date(),
            })
            .then(user => res.send(user[0]));
        })
        .then(trx.commit)
        .catch(trx.rollback);
    }).catch(err => {
      res.status(400).send('unable to register');
    });
  });
});

// /profile/:userId --> GET res = user
app.get('/profile/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.select('*')
    .from('users')
    .where({ id })
    .then(user =>
      user.length ? res.send(user[0]) : res.status(404).send('user not found')
    )
    .catch(err => {
      console.error(err);
      res.status(400).send('unable to get user');
    });
});

// /image --> POST --> res = user
app.put('/image', (req, res) => {
  const { id } = req.body;

  db('users')
    .where({ id })
    .increment('entries', 1)
    .returning('entries')
    .then(data => res.send(data[0]))
    .catch(err => {
      res.status(400).send('unable to get entries');
    });
});
