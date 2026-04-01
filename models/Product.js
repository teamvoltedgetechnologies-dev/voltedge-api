const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    type: { type: String, required: true },
    category: { type: String, required: true },
    name: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: String, default: 'Inquire' },
    bgClass: { type: String, default: 'bg-blue' },
    iconClass: { type: String, default: 'node' },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
