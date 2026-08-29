const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
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
  stockQuantity: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  criticalThreshold: { 
    type: Number, 
    default: 15 
  },
  isAlertActive: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

inventorySchema.pre('save', function (next) {
  this.isAlertActive = this.stockQuantity <= this.criticalThreshold;
  next();
});

module.exports = mongoose.model('Inventory', inventorySchema);