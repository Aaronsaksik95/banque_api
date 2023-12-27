import User from '../models/user.model.js';
import Account from '../models/account.model.js';
import secretJwt from '../configs/jwt.config.js';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const newUser = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashedPassword
    });

    const savedUser = await newUser.save();

    const userToken = jwt.sign(
      { id: savedUser._id },
      secretJwt,
      { expiresIn: 86400 },
    );

    const newAccount = new Account({
      name: "Current account",
      amount: 0,
      overdraft: 400,
      user: savedUser._id
    });

    const savedAccount = await newAccount.save();

    savedUser.accounts.push(savedAccount._id);
    await savedUser.save();

    res.status(200).json({
      userCreate: true,
      firstAccountCreate: true,
      message: 'Compte utilisateur et bancaire bien créés.',
      auth: true,
      token: userToken,
    });

  } catch (err) {
    res.status(500).json({
      error: 500,
      auth: false,
      message: 'Une erreur est survenu durant l\'inscription',
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (bcrypt.compareSync(req.body.password, user.password)) {
      let userToken = jwt.sign({
        id: user._id,
      },
        secretJwt,
        {
          expiresIn: 86400
        }
      )
      res.send({
        message: 'Connecté.',
        token: userToken,
        auth: true
      })
    } else {
      res.status(500).send({
        error: 500,
        auth: false,
        message: "Mot de passe incorrect."
      })
    }
  } catch (err) {
    res.status(500).send({
      error: 500,
      auth: false,
      message: "Email incorrect"
    })
  }

}
