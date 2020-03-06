const mongoose = require('mongoose');

const installationSchema = new mongoose.Schema({
    planet: { type: String, required: true },
    stationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Station', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Installation', installationSchema);