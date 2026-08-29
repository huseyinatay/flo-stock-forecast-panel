const mongoose = require('mongoose');

const salesRecordSchema = new mongoose.Schema({
  store: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Store', 
    required: true 
  },
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  unitsSold: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  revenue: { 
    type: Number, 
    required: true 
  },
  salesDate: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

module.exports = mongoose.model('SalesRecord', salesRecordSchema);