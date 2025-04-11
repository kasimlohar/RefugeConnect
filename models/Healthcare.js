const mongoose = require('mongoose');

const healthcareSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    location: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Healthcare', healthcareSchema);
