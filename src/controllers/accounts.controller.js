import Account from '../models/account.model.js';
import Operation from '../models/operation.model.js';
import User from '../models/user.model.js';

export const getAccountId = async (req, res) => {
    const accountId = req.params.id;

    try {
        const account = await Account.findById(accountId);
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
        const accounts = await Account.find({ user: userId });
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
            response: true,
        });
    } catch (err) {
        res.status(400).json({
            error: 400,
            message: err.message || 'Bad Request',
        });
    }
};

export const depositIntoAccount = async (req, res) => {
    const { amount } = req.body;
    const sendingAccountId = req.params.id;
    const userId = req.user.id;

    try {
        const account = await Account.findByIdAndUpdate(sendingAccountId, { $inc: { amount: amount } }, { new: true });
        await createOperation('deposit', 'accepted', amount, userId, sendingAccountId);
        res.status(200).json({
            deposit: true,
            account: account,
        });

    } catch (err) {
        res.status(400).json({
            error: 400,
            message: err.message || 'Bad Request',
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
            await createOperation('withdrawal', 'denied', amount, userId, sendingAccountId);
            return res.status(200).json({
                withdrawal: false,
                message: 'Withdrawal denied, below your authorized overdraft.',
                account: account
            });
        }

        const updatedAccount = await Account.findByIdAndUpdate(sendingAccountId, { $inc: { amount: -amount } }, { new: true });
        await createOperation('withdrawal', 'accepted', amount, userId, sendingAccountId);
        return res.status(200).json({
            withdrawal: true,
            account: updatedAccount
        });

    } catch (err) {
        res.status(400).json({
            error: 400,
            message: err.message || 'Bad Request',
        });
    }
};

export const transferAccount = async (req, res) => {
    const sendingAccountId = req.body.sendingAccount
    const receivingAccountId = req.body.receivingAccount
    const amount = req.body.amount
    const userId = req.user.id;

    try {
        const sendingAccount = await Account.findById(sendingAccountId);
        const receivingAccount = await Account.findById(receivingAccountId);
        if (!sendingAccount || sendingAccount.overdraft + sendingAccount.amount < amount) {
            await createOperation('transfer', 'denied', amount, userId, sendingAccountId, receivingAccountId);
            return res.status(200).json({
                transfer: false,
                message: 'Transfer denied, below your authorized overdraft.',
                sendingAccount: sendingAccount,
                receivingAccount: receivingAccount
            });
        }

        const updatedSendingAccount = await Account.findByIdAndUpdate(sendingAccountId, { $inc: { amount: -amount } }, { new: true });
        const updatedReceivingAccount = await Account.findByIdAndUpdate(receivingAccountId, { $inc: { amount: amount } }, { new: true });
        await createOperation('transfer', 'accepted', amount, userId, sendingAccountId, receivingAccountId);
        return res.status(200).json({
            transfer: true,
            SendingAccount: updatedSendingAccount,
            ReceivingAccount: updatedReceivingAccount
        });

    } catch (err) {
        res.status(400).json({
            error: 400,
            message: err.message || 'Bad Request',
        });
    }
};

const createOperation = async (type, status, amount, userId, sendingAccountId, receivingAccountId) => {
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

