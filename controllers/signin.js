const handleSignin = (req, res, db, bcrypt) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json('incorrect form submission');
  }

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
              console.error(err);
              res.status(400).json('Unable to get user');
            })
        : res.status(401).json('Wrong credentials')
    )
    .catch(err => {
      console.error(err);
      res.status(400).json('Error loggin in');
    });
};

module.exports = { handleSignin };
