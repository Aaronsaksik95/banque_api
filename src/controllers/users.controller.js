import User from '../models/user.model.js';
import Account from '../models/account.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import secretJwt from '../configs/jwt.config.js'


export const getUserId = (req, res) => {

}

export const getAllUser = (req, res) => {

}

export const createUser = (req, res) => {
  const account = new Account(req.body.account);
  const hashedPassword = bcrypt.hashSync(req.body.user.password, 10);
  account.save()
    .then(account => {
      const user = new User({
        firstName: req.body.user.firstName,
        lastName: req.body.user.lastName,
        email: req.body.user.email,
        password: hashedPassword,
        account: account._id
      });
      user.save()
        .then(user => {
          const userToken = jwt.sign(
            {
              id: user._id,
            },
            secretJwt,
            {
              expiresIn: 86400,
            },
          );
          res.status(200).json({
            userCreate: true,
            firstAccountCreate: true,
            user: userToken,
          });
        })
        .catch(err => {
          res.status(500).json({
            error: 500,
            message: err.message || 'Server Error',
          });
        });
    })
    .catch(err => {
      res.status(500).json({
        error: 500,
        message: err.message || 'Server Error',
      });
    });
}

export const updateUser = (req, res) => {

}

export const deleteUser = (req, res) => {

}