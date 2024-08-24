import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    foodName: {
        type: String,
        required: true,
    },
    description: String,
    quantity: {
        type: Number,
        required: true,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    donatedDate: {
        type: Date,
        default: Date.now,
    },
    pickupLocation: {
        type: String,
        required: true,
    },
    pickupTime: {
        type: String,
        required: true,
    },
    foodType: {
        type: String,
        enum: ['veg', 'nonveg'],
        required: true,
    },
    phoneNo: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isRequested: {
        type: Boolean,
        default: false,
    },
    isDelivered: {
        type: Boolean,
        default: false,
    },
    note: String,
    foodImage: String,
});

const Foods = mongoose.model("Foods", foodSchema);

export default Foods;
