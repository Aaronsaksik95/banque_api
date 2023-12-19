import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        unique: false
    },
    lastName: {
        type: String,
        required: true,
        unique: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: false,
    },
    account: [{
        type: Schema.Types.ObjectId,
        ref: 'Account'
    }],
    created_at: { 
        type: Date, 
        required: true,
        default: Date.now
    },
})

export default model('User', userSchema);