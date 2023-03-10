const dotenv = require("dotenv")
const User_Model = require('../Models/User.models');
const bcrypt = require('bcrypt');
const jwtHelper = require('../Helpers/jwt.helper');
const redis = require('redis')
dotenv.config()

const redisClient = redis.createClient({
	url: process.env.REDIS_URL
})

const Register = async (req, res) => {
	const { username, password, phone, fullName } = req.body;
	const user = User_Model.findOne({ username: username });
	if (user) {
		return res.status(409).json({ message: 'Account already exist' });
	}
	const hashPassword = await bcrypt.hash(password, 10);
	try {
		const user = await User_Model.create({
			username,
			password: hashPassword,
			phone,
			fullName
		});
		return res.status(201).json({ payload: user });
	} catch (error) {
		return res.status(500).json(error);
	}
};

const Login = async (req, res) => {
	const accessTokenSecret =
		process.env.ACCESS_TOKEN_SECRET ||
		'access-token-secret-phamvandat.hcmut@gmail.com';
	const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || '10d';
	const refreshTokenSecret =
		process.env.ACCESS_TOKEN_SECRET ||
		'refresh-token-secret-phamvandat.hcmut@gmail.com';
	const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || '30d';
	const { username, password } = req.body;
	try {
		const user = await User_Model.findOne({ username: username });
		if (!user) {
			return res
				.status(404)
				.json({ message: 'Incorrect username or password' });
		}
		const correctPassword = await bcrypt.compare(password, user.password);
		if (!correctPassword) {
			return res
				.status(404)
				.json({ message: 'Incorrect username or password' });
		}
		const accessToken = await jwtHelper.generateToken(
			user,
			accessTokenSecret,
			accessTokenLife
		);

		const refreshToken = await jwtHelper.generateToken(
			user,
			refreshTokenSecret,
			refreshTokenLife
		);

		redisClient.on('error', err => console.log('Redis Client Error', err));
		await redisClient.connect();
		// await redisClient.set('refreshToken', refreshToken)
		await redisClient.hSet('refreshToken', refreshToken, refreshToken)
		const listRefresh = await redisClient.hVals('refreshToken');
		console.log(listRefresh);
		await redisClient.disconnect();
		return res.status(200).json({ payload: user, accessToken, refreshToken });
	} catch (error) {
		return res.status(500).json(error);
	}
};

const RefreshToken = async (req, res) => {
	await redisClient.connect();

	const listRefresh = await redisClient.get('refreshToken');
	const refreshTokenFromClient = req.body.refreshToken
	if (refreshTokenFromClient && await redisClient.get[refreshTokenFromClient]) {
		try {
			const decoded = await jwtHelper.verifyToken(refreshTokenFromClient, refreshTokenSecret)
			const user = decoded.data
			const accessToken = await jwtHelper.generateToken(
				user,
				accessTokenSecret,
				accessTokenLife
			);
			return res.status(200).json({ accessToken });
		} catch (error) {
			res.status(403).json({
				message: 'Invalid refresh token.',
			});
		}
	} else {
		// Kh??ng t??m th???y token trong request
		return res.status(403).send({
			message: 'No token provided.',
		});
	}
}

const GetUserInfo = async (req, res) => {
	try {
		const userId = req.params['id'];
		const user = await User_Model.findById(userId);
		if (!user) {
			return;
		}
		return res.status(200).json({ payload: user });
	} catch (error) { }
};

module.exports = {
	Register,
	Login,
	RefreshToken,
	GetUserInfo,
};
