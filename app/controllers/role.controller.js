const Role = require('../models/role.model');

exports.all = (req, res) => {
  Role.find().sort({"__v": -1}).exec(
    (err, roles) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      res.status(200).send(roles);
    })
};