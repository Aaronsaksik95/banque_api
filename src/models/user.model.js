import { Schema as _Schema, model } from 'mongoose';

const Schema = _Schema;

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        unique: false
    },
    lastname: {
        type: String,
        required: true,
        unique: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 60,
        unique: false
    },
    accounts: [{
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: false
    }],
    created_at: { 
        type: Date, 
        required: true,
        default: Date.now
    },
})

export default model('User', userSchema);