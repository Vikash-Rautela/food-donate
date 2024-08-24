import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
    },
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Foods',
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

export default activitySchema;
