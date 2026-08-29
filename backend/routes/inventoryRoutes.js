const express = require('express');
const router = express.Router();

// Mock (Simülasyon) Envanter Verisi
const mockInventory = [
  {
    _id: 'inv_01',
    store: {
      _id: 'str_101',
      storeCode: 'IST-MALL-01',
      storeName: 'Mall of İstanbul FLO',
      clusterSegment: 'A',
      city: 'İstanbul'
    },
    product: {
      _id: 'prd_501',
      sku: 'LMB-SNK-2026',
      title: 'Lumberjack Sport Sneaker',
      brand: 'Lumberjack',
      category: 'Ayakkabı',
      unitPrice: 1899.90
    },
    stockQuantity: 8,
    criticalThreshold: 15,
    isAlertActive: true
  },
  {
    _id: 'inv_02',
    store: {
      _id: 'str_102',
      storeCode: 'ANK-ANKA-02',
      storeName: 'Ankamall FLO',
      clusterSegment: 'A',
      city: 'Ankara'
    },
    product: {
      _id: 'prd_502',
      sku: 'KNT-RUN-1002',
      title: 'Kinetix Air Running',
      brand: 'Kinetix',
      category: 'Ayakkabı',
      unitPrice: 1249.90
    },
    stockQuantity: 42,
    criticalThreshold: 15,
    isAlertActive: false
  }
];

// Tüm envanteri getirme
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    count: mockInventory.length,
    data: mockInventory
  });
});

// Kritik stok seviyesindeki ürünler
router.get('/critical', (req, res) => {
  const criticalItems = mockInventory.filter(item => item.isAlertActive);
  res.status(200).json({
    success: true,
    alertCount: criticalItems.length,
    data: criticalItems
  });
});

module.exports = router;