const express = require('express');
const userController = require('../controllers/usercontroller');

const router = express.Router();

router.post('/signup', userController.userSignup);

router.post('/login', userController.userLogin);

module.exports = router;
