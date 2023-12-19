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
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    issuingAccount: [{
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    }],
    receivingAccount: [{
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: false
    }],
})

export default model('Operation', operationSchema);