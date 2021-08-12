const handleProfileGet = (req, res, db) => {
  const id = parseInt(req.params.id, 10);
  db.select('*')
    .from('users')
    .where({ id })
    .then(user =>
      user.length ? res.send(user[0]) : res.status(404).json('user not found')
    )
    .catch(err => {
      console.error(err);
      res.status(400).json('unable to get user');
    });
};

module.exports = { handleProfileGet };
