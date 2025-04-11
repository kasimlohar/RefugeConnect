const mongoose = require('mongoose');

const housingSchema = new mongoose.Schema({
    type: { type: String, required: true },
    price: { type: String, required: true },
    location: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Housing', housingSchema);
