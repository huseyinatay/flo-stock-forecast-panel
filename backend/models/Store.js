const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  storeCode: { type: String, required: true, unique: true },
  storeName: { type: String, required: true },
  clusterSegment: { type: String, enum: ['A', 'B', 'C'], default: 'B' },
  city: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Store', storeSchema);