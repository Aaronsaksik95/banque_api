import User from '../models/user.model.js';
import Account from '../models/account.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import secretJwt from '../configs/jwt.config.js'

export const register = async (req, res) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.user.password, 10);
    const newUser = new User({
      firstName: req.body.user.firstName,
      lastName: req.body.user.lastName,
      email: req.body.user.email,
      password: hashedPassword
    });

    const savedUser = await newUser.save();

    const userToken = jwt.sign(
      { id: savedUser._id },
      secretJwt,
      { expiresIn: 86400 },
    );

    const newAccount = new Account({
      ...req.body.account,
      user: savedUser._id
    });

    const savedAccount = await newAccount.save();

    savedUser.accounts.push(savedAccount._id);
    await savedUser.save();

    res.status(200).json({
      userCreate: true,
      firstAccountCreate: true,
      user: userToken,
    });

  } catch (err) {
    res.status(500).json({
      error: 500,
      message: err.message || 'Server Error',
    });
  }
};
