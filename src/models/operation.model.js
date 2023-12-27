import { Schema as _Schema, model } from 'mongoose';

const Schema = _Schema;

const operationSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: ['deposit', 'withdrawal', 'transfer'],
        unique: false
    },
    status: {
        type: String,
        required: true,
        enum: ['accepted', 'denied'],
        unique: false
    },
    amount: {
        type: Number,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sendingAccount: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    receivingAccount: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: false
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
})

export default model('Operation', operationSchema);