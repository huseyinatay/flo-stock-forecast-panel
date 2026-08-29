const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

// Tüm envanteri mağaza ve ürün bilgileriyle getirme
router.get('/', async (req, res, next) => {
  try {
    const { storeId, category } = req.query;
    let filter = {};

    if (storeId) filter.store = storeId;

    const inventoryData = await Inventory.find(filter)
      .populate('store')
      .populate({
        path: 'product',
        match: category ? { category: category } : {}
      });

    const result = inventoryData.filter(item => item.product !== null);

    res.status(200).json({ success: true, count: result.length, data: result });
  } catch (error) {
    next(error);
  }
});

// Kritik stok seviyesindeki ürünler
router.get('/critical', async (req, res, next) => {
  try {
    const criticalItems = await Inventory.find({
      $expr: { $lte: ['$stockQuantity', '$criticalThreshold'] }
    })
    .populate('store')
    .populate('product');

    res.status(200).json({
      success: true,
      alertCount: criticalItems.length,
      data: criticalItems
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;