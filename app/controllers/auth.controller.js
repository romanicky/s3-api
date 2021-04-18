const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "Email or Password is invalid!" });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Email or Password is invalid!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var refreshToken = jwt.sign({ id: user.id }, config.secretRefreshToken, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push(user.roles[i].name.toUpperCase());
      }

      // TODO: get data from server
      res.status(200).send({
        accessToken: token,
        refreshToken: refreshToken,
        userData: {
          id: user._id,
          fullName: 'John Doe',
          username: user.username,
          password: 'admin',
          avatar: '/static/media/avatar-s-11.1d46cc62.jpg',
          email: user.email,
          role: authorities,
          ability: [
            {
              action: 'manage',
              subject: 'all'
            }
          ],
          extras: {
            eCommerceCartItemsCount: 15
          }
        },
      });
    });
};

exports.refreshToken = (req, res) => {
  const refreshToken = req.body.refreshToken;

  try {
    const { id } = jwt.verify(refreshToken, config.secret)

    const userData = { ...data.users.find(user => user.id === id) }

    const newAccessToken = jwt.sign({ id: userData.id }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn })
    const newRefreshToken = jwt.sign({ id: userData.id }, jwtConfig.secretRefreshToken, {
      expiresIn: jwtConfig.refreshTokenExpireTime
    })

    delete userData.password
    const response = {
      userData,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
    return res.status(200).send(response);
  } catch (e) {
    return res.status(401).send({ message: "Invalid refresh token" });
  }
}