import Account from '../models/account.model.js';

export const getAccountId = (req, res) => {

}

export const getAllAccount = (req, res) => {
    Account.find()
        .then((data) => {
            if (data != null) {
                res.status(200).json({
                    accounts: data,
                    response: true
                });
            } else {
                res.status(404).json({
                    accounts: null,
                    response: false
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                error: 500,
                message: err.message || 'Server Error'
            });
        });
}

export const createAccount = (req, res) => {

}

export const updateAccount = (req, res) => {

}

export const deleteAccount = (req, res) => {

}
