const express = require('express');
const AuthController = require('../Controllers/Auth.controller');

const authRouter = express.Router();

authRouter.post('/auth/register', AuthController.Register);
authRouter.post('/auth/login', AuthController.Login);
authRouter.post('/auth/refresh-token', AuthController.RefreshToken);
authRouter.get('/auth/user/:id', AuthController.GetUserInfo);

module.exports = authRouter;
