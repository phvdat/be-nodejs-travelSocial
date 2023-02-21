const User_Model = require('../Models/User.models');
import bcrypt from 'bcrypt';

const Register = async (req: any, res: any) => {
  const { username, password, phone, fullName } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User_Model.create({
      username,
      password: hashPassword,
      phone,
      fullName
    });
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
};
const GetUserInfo = async (req: any, res: any) => {
  try {
  } catch (error) {}
};

module.exports = {
  Register,
  GetUserInfo
};
