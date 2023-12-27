import Account from '../models/account.model.js';
import Operation from '../models/operation.model.js';
import User from '../models/user.model.js';

export const getAccountId = async (req, res) => {
    const accountId = req.params.id;

    try {
        const account = await Account.findById(accountId)
            .populate({
                path: "operations",
                populate: {
                    path: "sendingAccount",
                }
            })
            .populate({
                path: "operations",
                populate: {
                    path: "receivingAccount",
                }
            })

        res.status(200).json({
            account: account,
            response: true
        });
    } catch (err) {
        res.status(500).json({
            error: 500,
            message: err.message || 'Server Error'
        });
    }
};


export const getAllAccount = async (req, res) => {
    const userId = req.user.id;

    try {
        const accounts = await Account.find({ user: userId })
            .populate({
                path: "operations",
                populate: {
                    path: "sendingAccount",
                }
            })
            .populate({
                path: "operations",
                populate: {
                    path: "receivingAccount",
                }
            })
        res.status(200).json({
            accounts: accounts,
            response: true
        });
    } catch (err) {
        res.status(500).json({
            error: 500,
            message: err.message || 'Server Error'
        });
    }
};


export const createAccount = async (req, res) => {
    const userId = req.user.id;

    try {
        const newAccount = new Account({
            ...req.body,
            user: userId
        });
        const account = await newAccount.save();

        await User.findByIdAndUpdate(userId, { $push: { accounts: account._id } }, { new: true })
        res.status(201).json({
            account: account,
            message: 'Votre compte a bien été créé.',
            response: true,
        });
    } catch (err) {
        res.status(400).json({
            error: 400,
            message: 'Une erreur est survenu durant la création du compte.',
        });
    }
};

export const depositIntoAccount = async (req, res) => {
    const { amount } = req.body;
    const sendingAccountId = req.params.id;
    const userId = req.user.id;

    try {
        await Account.findByIdAndUpdate(sendingAccountId, { $inc: { amount: amount } }, { new: true });
        const operation = await createOperation('deposit', 'accepted', amount, userId, sendingAccountId);
        const account = await Account.findByIdAndUpdate(sendingAccountId, { $push: { operations: operation._id } }, { new: true })
        res.status(200).json({
            response: true,
            message: `Dépot de ${amount} € réussi.`,
            account: account,
        });

    } catch (err) {
        res.status(400).json({
            response: false,
            error: 400,
            message: 'Une erreur est survenu durant le dépot',
        });
    }
};

export const withdrawalIntoAccount = async (req, res) => {
    const { amount } = req.body;
    const sendingAccountId = req.params.id;
    const userId = req.user.id;

    try {
        const account = await Account.findById(sendingAccountId);
        if (!account || account.overdraft + account.amount < amount) {
            const operation = await createOperation('withdrawal', 'denied', amount, userId, sendingAccountId);
            const updatedAccount = await Account.findByIdAndUpdate(sendingAccountId, { $push: { operations: operation._id } }, { new: true })
            return res.status(200).json({
                response: false,
                message: 'Retrait refusé, en dessous de votre découvert autorisé.',
                account: updatedAccount
            });
        }

        await Account.findByIdAndUpdate(sendingAccountId, { $inc: { amount: -amount } }, { new: true });
        const operation = await createOperation('withdrawal', 'accepted', amount, userId, sendingAccountId);
        const updatedAccount = await Account.findByIdAndUpdate(sendingAccountId, { $push: { operations: operation._id } }, { new: true })
        return res.status(200).json({
            response: true,
            message: `Retrait de ${amount} € réussi.`,
            account: updatedAccount
        });

    } catch (err) {
        res.status(400).json({
            error: 400,
            response: false,
            message: 'Une erreur est survenu durant le retrait',
        });
    }
};

export const transferAccount = async (req, res) => {
    const sendingAccountId = req.params.id
    const receivingAccountId = req.body.receivingAccount
    const amount = req.body.amount
    const userId = req.user.id;

    try {
        const sendingAccount = await Account.findById(sendingAccountId);
        if (!sendingAccount || sendingAccount.overdraft + sendingAccount.amount < amount) {
            const operation = await createOperation('transfer', 'denied', amount, userId, sendingAccountId, receivingAccountId);
            const updatedSendingAccount = await Account.findByIdAndUpdate(sendingAccountId, { $push: { operations: operation._id } }, { new: true })
            const updatedReceivingAccount = await Account.findByIdAndUpdate(receivingAccountId, { $push: { operations: operation._id } }, { new: true })
            return res.status(200).json({
                response: false,
                message: 'Transfère refusé, en dessous de votre découvert autorisé.',
                sendingAccount: updatedSendingAccount,
                receivingAccount: updatedReceivingAccount
            });
        }

        await Account.findByIdAndUpdate(sendingAccountId, { $inc: { amount: -amount } }, { new: true });
        await Account.findByIdAndUpdate(receivingAccountId, { $inc: { amount: amount } }, { new: true });
        const operation = await createOperation('transfer', 'accepted', amount, userId, sendingAccountId, receivingAccountId);
        const updatedSendingAccount = await Account.findByIdAndUpdate(sendingAccountId, { $push: { operations: operation._id } }, { new: true })
        const updatedReceivingAccount = await Account.findByIdAndUpdate(receivingAccountId, { $push: { operations: operation._id } }, { new: true })
        return res.status(200).json({
            response: true,
            message: `Transfère de ${amount} € vers ${updatedReceivingAccount.name} réussi.`,
            SendingAccount: updatedSendingAccount,
            ReceivingAccount: updatedReceivingAccount
        });

    } catch (err) {
        res.status(400).json({
            error: 400,
            response: false,
            message: 'Une erreur est survenu durant le transfére',
        });
    }
};

export const createOperation = async (type, status, amount, userId, sendingAccountId, receivingAccountId) => {
    const newOperation = new Operation({
        type: type,
        status: status,
        amount: amount,
        user: userId,
        sendingAccount: sendingAccountId,
        receivingAccount: receivingAccountId
    });
    return newOperation.save();
};

