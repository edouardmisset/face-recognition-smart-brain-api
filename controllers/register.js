const handleRegister = (req, res, db, bcrypt, saltRounds) => {
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
      res.status(400).json('unable to register');
    });
  });
};

module.exports = { handleRegister };
