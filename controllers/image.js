const handleImage = (req, res, db) => {
  const { id } = req.body;

  db('users')
    .where({ id })
    .increment('entries', 1)
    .returning('entries')
    .then(data => res.send(data[0]))
    .catch(err => {
      res.status(400).json('unable to get entries');
    });
};

module.exports = { handleImage };
