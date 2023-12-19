import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const accountSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: false,
    },
    amount: {
        type: Number,
        required: true,
        unique: false,
    },
    created_at: { 
        type: Date, 
        required: true,
        default: Date.now
    },
})

export default model('Account', accountSchema);