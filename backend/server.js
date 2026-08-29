const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


mongoose.connect('mongodb://127.0.0.1:27017/flo_inventory_db')
  .then(() => console.log('MongoDB veritabanı bağlantısı başarılı.'))
  .catch((err) => console.log('MongoDB bağlantı uyarısı (Local):', err.message));

const inventoryRoutes = require('./routes/inventoryRoutes');
const salesRoutes = require('./routes/salesRoutes');

app.use('/api/inventory', inventoryRoutes);
app.use('/api/sales', salesRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Sunucu hatası meydana geldi.', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda aktif.`);
});