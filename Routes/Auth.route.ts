const express = require('express');
const AuthController = require('../Controllers/Auth.controller');

const authRouter = express.Router();

authRouter.post('/auth/register', AuthController.Register);
authRouter.get('/auth/user/:id', AuthController.GetUserInfo);

export {};
module.exports = authRouter;
