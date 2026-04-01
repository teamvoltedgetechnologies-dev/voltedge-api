const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    formData: { type: Object, required: true }, // Temporarily store the initial contact data
    createdAt: { type: Date, default: Date.now, expires: '10m' } // Standard Mongoose TTL index
});

module.exports = mongoose.model('Otp', OtpSchema);
