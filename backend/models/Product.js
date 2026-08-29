const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  unitPrice: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);