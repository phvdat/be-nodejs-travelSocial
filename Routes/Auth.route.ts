const express = require('express');
const AuthController = require('../Controllers/Auth.controller');

const router = express.Router();

router.post('/auth/register', AuthController.Register);
router.get('/auth/user', AuthController.GetUserInfo);

module.exports = router;
