const express = require('express')
const cors = require('cors')
require('dotenv').config()
const bcrypt = require('bcrypt')
const { handleRegister } = require('./controllers/register')
const { handleSignin } = require('./controllers/signin')
const { handleProfileGet } = require('./controllers/profile')
const { handleImage, handleApiCall } = require('./controllers/image')

const db = require('knex')({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'edouard',
    password: '',
    database: 'smart-brain',
  },
})

// bcrypt options
const saltRounds = 10

const app = express()

app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

// / --> res = this is working
app.get('/', (req, res) => {
  res.send('API is working, but DB is down')
})

// /signin --> POST success / fail

app.post('/signin', (req, res) => handleSignin(req, res, db, bcrypt))

// /register --> POST res = new user
app.post('/register', (req, res) =>
  handleRegister(req, res, db, bcrypt, saltRounds)
)

// /profile/:userId --> GET res = user
app.get('/profile/:id', (req, res) => handleProfileGet(req, res, db))

// /image --> POST --> res = user
app.put('/image', (req, res) => handleImage(req, res, db))

// /imageurl --> POST --> res =
app.post('/imageurl', (req, res) => handleApiCall(req, res))
