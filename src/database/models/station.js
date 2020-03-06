const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  installationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Installation' },
  hasInstallation: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Station', stationSchema);