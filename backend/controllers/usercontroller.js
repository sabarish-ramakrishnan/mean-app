const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.userSignup = (req, res, next) => {
  console.log(req.body);
  const user = new User({
    email: req.body.email,
    password: req.body.password
  });
  user.save().then(result => {
    res.status(201).json({
      message: 'User created!',
      result: result
    })
  }).catch(e => {
    console.log(e);
    res.status(500).json({
      error: {
        message: "Invalid authentication credentials"
      }
    });
  });
}

exports.userLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({
    email: email
  }).then(user => {
    if (user == null) {
      res.status(401).json({
        message: 'bad user'
      });
    } else if (user.password !== password) {
      res.status(401).json({
        message: 'bad password'
      });
    } else {
      const token = jwt.sign({
        email: user.email,
        userId: user._id
      }, "test", {
        expiresIn: "1h"
      });
      res.status(200).json({
        message: 'Login successfull',
        token: token,
        expiresIn: 3600,
        userId: user._id
      });
    }

  }).catch(error => {
    console.log(error);
    res.status(401).json({
      message: 'bad login'
    });
  });
}
