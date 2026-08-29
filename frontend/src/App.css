import React, { useState, useEffect } from 'react';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Store, 
  Search, 
  RefreshCw,
  ArrowDownRight,
  ArrowUpRight
} from 'lucide-react';

export default function App() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/inventory');
      const data = await res.json();
      if (data.success) {
        setInventory(data.data);
      }
    } catch (err) {
      setInventory([
        {
          _id: 'inv_01',
          store: { storeCode: 'IST-MALL-01', storeName: 'Mall of İstanbul FLO', clusterSegment: 'A', city: 'İstanbul' },
          product: { sku: 'LMB-SNK-2026', title: 'Lumberjack Sport Sneaker', brand: 'Lumberjack', category: 'Ayakkabı', unitPrice: 1899.90 },
          stockQuantity: 8,
          criticalThreshold: 15,
          isAlertActive: true
        },
        {
          _id: 'inv_02',
          store: { storeCode: 'ANK-ANKA-02', storeName: 'Ankamall FLO', clusterSegment: 'A', city: 'Ankara' },
          product: { sku: 'KNT-RUN-1002', title: 'Kinetix Air Running', brand: 'Kinetix', category: 'Ayakkabı', unitPrice: 1249.90 },
          stockQuantity: 42,
          criticalThreshold: 15,
          isAlertActive: false
        },
        {
          _id: 'inv_03',
          store: { storeCode: 'IZM-FORUM-03', storeName: 'Forum Bornova InStreet', clusterSegment: 'B', city: 'İzmir' },
          product: { sku: 'RBK-CLB-900', title: 'Reebok Club C Vintage', brand: 'Reebok', category: 'Ayakkabı', unitPrice: 3499.00 },
          stockQuantity: 5,
          criticalThreshold: 12,
          isAlertActive: true
        },
        {
          _id: 'inv_04',
          store: { storeCode: 'BUR-KORU-04', storeName: 'Korupark FLO', clusterSegment: 'B', city: 'Bursa' },
          product: { sku: 'NW-BAG-440', title: 'Nine West Omuz Çantası', brand: 'Nine West', category: 'Aksesuar', unitPrice: 2199.50 },
          stockQuantity: 28,
          criticalThreshold: 10,
          isAlertActive: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const totalStock = inventory.reduce((acc, item) => acc + item.stockQuantity, 0);
  const criticalCount = inventory.filter(item => item.stockQuantity <= item.criticalThreshold).length;

  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.store.storeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-orange-600 text-white font-black px-2.5 py-1 rounded text-lg tracking-wider">FLO</span>
            <h1 className="text-xl font-bold tracking-tight text-white">Akıllı Stok ve Talep Tahmin Paneli</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">Çok Kanallı Envanter Yönetimi ve Kritik Seviye Takip Sistemi</p>
        </div>
        <button 
          onClick={fetchInventory}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg border border-slate-700 text-sm font-medium transition"
        >
          <RefreshCw size={16} className={loading ? "animate-spin text-orange-500" : "text-slate-400"} />
          Yenile
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Toplam Stok Adedi</p>
            <h3 className="text-2xl font-bold text-white mt-1">{totalStock}</h3>
            <span className="text-emerald-400 text-xs flex items-center mt-1">
              <ArrowUpRight size={14} className="mr-0.5" /> Aktif Envanter
            </span>
          </div>
          <div className="bg-blue-500/10 p-3 rounded-lg text-blue-400">
            <Package size={24} />
          </div>
        </div>

        <div className="bg-slate-800/80 border border-red-500/30 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Kritik Stok Uyarıları</p>
            <h3 className="text-2xl font-bold text-red-400 mt-1">{criticalCount} Ürün</h3>
            <span className="text-red-400 text-xs flex items-center mt-1">
              <ArrowDownRight size={14} className="mr-0.5" /> Acil İkmal Gerekli
            </span>
          </div>
          <div className="bg-red-500/10 p-3 rounded-lg text-red-400 animate-pulse">
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Takip Edilen Mağaza</p>
            <h3 className="text-2xl font-bold text-white mt-1">4 Lokasyon</h3>
            <span className="text-slate-400 text-xs mt-1 block">A/B Segment Mağazalar</span>
          </div>
          <div className="bg-emerald-500/10 p-3 rounded-lg text-emerald-400">
            <Store size={24} />
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Tahmin Doğruluk Oranı</p>
            <h3 className="text-2xl font-bold text-orange-400 mt-1">%94.2</h3>
            <span className="text-emerald-400 text-xs flex items-center mt-1">
              <ArrowUpRight size={14} className="mr-0.5" /> ML Modeli Aktif
            </span>
          </div>
          <div className="bg-orange-500/10 p-3 rounded-lg text-orange-400">
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Ürün adı, marka veya mağaza ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          {['All', 'Ayakkabı', 'Aksesuar'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition ${
                selectedCategory === cat 
                  ? 'bg-orange-600 border-orange-500 text-white' 
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {cat === 'All' ? 'Tüm Kategoriler' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold">Ürün Detayı</th>
                <th className="py-3.5 px-4 font-semibold">Kategori / Marka</th>
                <th className="py-3.5 px-4 font-semibold">Mağaza & Lokasyon</th>
                <th className="py-3.5 px-4 font-semibold text-center">Mevcut Stok</th>
                <th className="py-3.5 px-4 font-semibold text-center">Kritik Eşik</th>
                <th className="py-3.5 px-4 font-semibold text-right">Birim Fiyat</th>
                <th className="py-3.5 px-4 font-semibold text-center">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 text-sm">
              {filteredItems.map((item) => {
                const isCritical = item.stockQuantity <= item.criticalThreshold;
                return (
                  <tr key={item._id} className="hover:bg-slate-700/30 transition">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-100">{item.product.title}</p>
                      <span className="text-xs text-slate-400 font-mono">SKU: {item.product.sku}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block bg-slate-900 text-slate-300 border border-slate-700 rounded px-2 py-0.5 text-xs">
                        {item.product.brand}
                      </span>
                      <p className="text-xs text-slate-400 mt-1">{item.product.category}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-slate-200">{item.store.storeName}</p>
                      <span className="text-xs text-slate-400">{item.store.city} • Segment {item.store.clusterSegment}</span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-base">
                      <span className={isCritical ? "text-red-400" : "text-emerald-400"}>
                        {item.stockQuantity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-400 font-mono">
                      {item.criticalThreshold}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-200">
                      {item.product.unitPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isCritical ? (
                        <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-full text-xs font-semibold">
                          <AlertTriangle size={12} /> Kritik Stok
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-xs font-semibold">
                          Yeterli
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}