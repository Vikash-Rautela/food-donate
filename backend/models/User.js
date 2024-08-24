import mongoose from 'mongoose';
import activitySchema from './Activity.js';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    gender: String,
    contact: String,
    address: String,
    password: {
        type: String,
        required: true,
    },
    activities: [activitySchema],
});

const Users = mongoose.model("Users", userSchema);

export default Users;
