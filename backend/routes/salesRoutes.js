const express = require('express');
const router = express.Router();
const SalesRecord = require('../models/SalesRecord');
const Inventory = require('../models/Inventory');

router.post('/', async (req, res, next) => {
  try {
    const { storeId, productId, unitsSold, unitPrice } = req.body;

    if (!storeId || !productId || !unitsSold || unitsSold <= 0) {
      return res.status(400).json({ success: false, message: 'Geçersiz satış verisi girdiniz.' });
    }

    const inventoryItem = await Inventory.findOne({ store: storeId, product: productId });

    if (!inventoryItem) {
      return res.status(404).json({ success: false, message: 'İlgili mağazada ürün envanteri bulunamadı.' });
    }

    if (inventoryItem.stockQuantity < unitsSold) {
      return res.status(400).json({
        success: false,
        message: `Yetersiz stok! Mevcut stok: ${inventoryItem.stockQuantity}, Talep edilen: ${unitsSold}`
      });
    }

    const revenue = unitsSold * (unitPrice || 0);
    const newSale = await SalesRecord.create({
      store: storeId,
      product: productId,
      unitsSold,
      revenue,
      salesDate: new Date()
    });

    inventoryItem.stockQuantity -= unitsSold;
    await inventoryItem.save();

    res.status(201).json({
      success: true,
      message: 'Satış başarıyla işlendi ve stok güncellendi.',
      sale: newSale,
      remainingStock: inventoryItem.stockQuantity,
      isCritical: inventoryItem.isAlertActive
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;