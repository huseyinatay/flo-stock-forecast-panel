import React, { useState, useEffect } from 'react';
import { 
  Package, 
  AlertTriangle, 
  Search, 
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Truck,
  Globe,
  BarChart3,
  X,
  TrendingUp,
  CreditCard,
  DollarSign,
  Wallet
} from 'lucide-react';

export default function App() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [notification, setNotification] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const defaultMock = [
    {
      _id: 'inv_01',
      store: { storeCode: 'IST-MALL-01', storeName: 'Mall of İstanbul FLO', clusterSegment: 'A', city: 'İstanbul', region: 'Türkiye', channel: 'Omnichannel' },
      product: { sku: 'LMB-SNK-2026', title: 'Lumberjack Sport Sneaker', brand: 'Lumberjack', category: 'Ayakkabı', unitPrice: 1899.90 },
      stockQuantity: 8,
      criticalThreshold: 15,
      predictedDemand: 45,
      suggestedReplenishment: 37,
      esgMetrics: { carbonSavedKg: 14.2, ecoRoute: 'Elektrikli Filo' },
      historicalTrend: [12, 18, 25, 30, 42, 45],
      turnoverRate: '4.8x'
    },
    {
      _id: 'inv_02',
      store: { storeCode: 'BAK-28M-01', storeName: 'Bakü 28 Mall FLO', clusterSegment: 'A+', city: 'Bakü', region: 'EEMEA', channel: 'Fiziksel & Dijital' },
      product: { sku: 'KNT-RUN-1002', title: 'Kinetix Air Running', brand: 'Kinetix', category: 'Ayakkabı', unitPrice: 1249.90 },
      stockQuantity: 42,
      criticalThreshold: 15,
      predictedDemand: 50,
      suggestedReplenishment: 0,
      esgMetrics: { carbonSavedKg: 28.5, ecoRoute: 'Optimum Konsolidasyon' },
      historicalTrend: [35, 38, 40, 44, 48, 50],
      turnoverRate: '5.2x'
    },
    {
      _id: 'inv_03',
      store: { storeCode: 'IZM-FORUM-03', storeName: 'Forum Bornova InStreet', clusterSegment: 'B', city: 'İzmir', region: 'Türkiye', channel: 'Mağaza' },
      product: { sku: 'RBK-CLB-900', title: 'Reebok Club C Vintage', brand: 'Reebok', category: 'Ayakkabı', unitPrice: 3499.00 },
      stockQuantity: 5,
      criticalThreshold: 12,
      predictedDemand: 32,
      suggestedReplenishment: 27,
      esgMetrics: { carbonSavedKg: 19.8, ecoRoute: 'Bölgesel Eko-Transfer' },
      historicalTrend: [8, 14, 19, 22, 28, 32],
      turnoverRate: '3.9x'
    },
    {
      _id: 'inv_04',
      store: { storeCode: 'KAZ-ALM-01', storeName: 'Almatı Mega FLO', clusterSegment: 'A', city: 'Almatı', region: 'EEMEA', channel: 'Omnichannel' },
      product: { sku: 'NW-BAG-440', title: 'Nine West Omuz Çantası', brand: 'Nine West', category: 'Aksesuar', unitPrice: 2199.50 },
      stockQuantity: 28,
      criticalThreshold: 10,
      predictedDemand: 30,
      suggestedReplenishment: 0,
      esgMetrics: { carbonSavedKg: 32.1, ecoRoute: 'Raylı Hat' },
      historicalTrend: [15, 18, 20, 24, 27, 30],
      turnoverRate: '4.1x'
    }
  ];

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/inventory');
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        const enhanced = data.data.map((item, idx) => ({
          ...item,
          predictedDemand: item.stockQuantity <= item.criticalThreshold ? item.stockQuantity + 30 : item.stockQuantity + 5,
          suggestedReplenishment: item.stockQuantity <= item.criticalThreshold ? (item.criticalThreshold * 2) - item.stockQuantity + 10 : 0,
          historicalTrend: defaultMock[idx % defaultMock.length].historicalTrend,
          turnoverRate: defaultMock[idx % defaultMock.length].turnoverRate,
          store: { ...item.store, region: defaultMock[idx % defaultMock.length].store.region, channel: defaultMock[idx % defaultMock.length].store.channel }
        }));
        setInventory(enhanced);
      } else {
        setInventory(defaultMock);
      }
    } catch (err) {
      setInventory(defaultMock);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAutoReplenish = (item) => {
    const qty = item.suggestedReplenishment;
    const cost = qty * item.product.unitPrice;

    setInventory(prev => prev.map(inv => {
      if (inv._id === item._id) {
        return {
          ...inv,
          stockQuantity: inv.stockQuantity + qty,
          suggestedReplenishment: 0
        };
      }
      return inv;
    }));

    setNotification({
      title: 'CFO Bütçe Onayı: İkmal Faturalandı',
      message: `${item.store.storeName} için ${qty} adet ürün (${cost.toLocaleString('tr-TR')} ₺ bütçe) satın alma ve ikmal sistemine kaydedildi.`
    });

    if (selectedProduct && selectedProduct._id === item._id) {
      setSelectedProduct(prev => ({
        ...prev,
        stockQuantity: prev.stockQuantity + qty,
        suggestedReplenishment: 0
      }));
    }

    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const totalStock = inventory.reduce((acc, item) => acc + item.stockQuantity, 0);
  const criticalCount = inventory.filter(item => item.stockQuantity <= item.criticalThreshold).length;
  
  // Finansal Hesaplamalar
  const totalValuation = inventory.reduce((acc, item) => acc + (item.stockQuantity * item.product.unitPrice), 0);
  const pendingReplenishmentBudget = inventory.reduce((acc, item) => acc + (item.suggestedReplenishment * item.product.unitPrice), 0);

  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.store.storeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      {notification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-amber-950 border border-amber-500/50 text-amber-200 px-5 py-4 rounded-xl shadow-2xl animate-bounce">
          <CreditCard className="text-amber-400" size={24} />
          <div>
            <p className="font-bold text-sm text-white">{notification.title}</p>
            <p className="text-xs text-amber-300 mt-0.5">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-orange-600 text-white font-black px-2.5 py-1 rounded text-lg tracking-wider">FLO</span>
            <h1 className="text-xl font-bold tracking-tight text-white">Finansal Envanter & Akıllı İkmal Paneli</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">CFO Organizasyonu, Bağlı Stok Maliyeti ve Otomatik Satın Alma Emri Simülasyonu</p>
        </div>
        <button 
          onClick={fetchInventory}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg border border-slate-700 text-sm font-medium transition"
        >
          <RefreshCw size={16} className={loading ? "animate-spin text-orange-500" : "text-slate-400"} />
          Yenile
        </button>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Toplam Stok Adedi</p>
            <h3 className="text-2xl font-bold text-white mt-1">{totalStock} Adet</h3>
            <span className="text-emerald-400 text-xs mt-1 block">Aktif Envanter</span>
          </div>
          <div className="bg-blue-500/10 p-3 rounded-lg text-blue-400">
            <Package size={24} />
          </div>
        </div>

        <div className="bg-slate-800/80 border border-emerald-500/30 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Toplam Envanter Değeri</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">{totalValuation.toLocaleString('tr-TR')} ₺</h3>
            <span className="text-emerald-300 text-xs flex items-center mt-1">
              <DollarSign size={14} className="mr-0.5" /> Aktif Varlık (CFO Defteri)
            </span>
          </div>
          <div className="bg-emerald-500/10 p-3 rounded-lg text-emerald-400">
            <Wallet size={24} />
          </div>
        </div>

        <div className="bg-slate-800/80 border border-amber-500/30 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Gereken İkmal Bütçesi</p>
            <h3 className="text-2xl font-bold text-amber-400 mt-1">{pendingReplenishmentBudget.toLocaleString('tr-TR')} ₺</h3>
            <span className="text-amber-300 text-xs flex items-center mt-1">
              <CreditCard size={14} className="mr-1" /> Bekleyen Satın Alma
            </span>
          </div>
          <div className="bg-amber-500/10 p-3 rounded-lg text-amber-400">
            <CreditCard size={24} />
          </div>
        </div>

        <div className="bg-slate-800/80 border border-red-500/30 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Kritik Stok Uyarısı</p>
            <h3 className="text-2xl font-bold text-red-400 mt-1">{criticalCount} Ürün</h3>
            <span className="text-red-400 text-xs mt-1 block">Tedarik Bekliyor</span>
          </div>
          <div className="bg-red-500/10 p-3 rounded-lg text-red-400 animate-pulse">
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Ürün adı veya mağaza ara..."
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

      {/* Table */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold">Ürün Detayı</th>
                <th className="py-3.5 px-4 font-semibold">Birim Fiyat</th>
                <th className="py-3.5 px-4 font-semibold">Mağaza Lokasyonu</th>
                <th className="py-3.5 px-4 font-semibold text-center">Mevcut Stok</th>
                <th className="py-3.5 px-4 font-semibold text-right">Toplam Değer</th>
                <th className="py-3.5 px-4 font-semibold text-center">İkmal Maliyeti</th>
                <th className="py-3.5 px-4 font-semibold text-center">Finansal Aksiyon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 text-sm">
              {filteredItems.map((item) => {
                const isCritical = item.stockQuantity <= item.criticalThreshold;
                const rowTotalValue = item.stockQuantity * item.product.unitPrice;
                const replenishmentCost = item.suggestedReplenishment * item.product.unitPrice;

                return (
                  <tr key={item._id} className="hover:bg-slate-700/30 transition">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-100">{item.product.title}</p>
                      <span className="text-xs text-slate-400 font-mono">SKU: {item.product.sku}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-300">
                      {item.product.unitPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-slate-200">{item.store.storeName}</p>
                      <span className="text-xs text-slate-400">{item.store.city}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold text-base ${isCritical ? "text-red-400" : "text-emerald-400"}`}>
                        {item.stockQuantity}
                      </span>
                      <span className="text-xs text-slate-400 block font-normal">Eşik: {item.criticalThreshold}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-emerald-400">
                      {rowTotalValue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isCritical ? (
                        <span className="text-xs font-semibold text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-1 rounded">
                          {replenishmentCost.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedProduct(item)}
                          className="bg-slate-700 hover:bg-slate-600 text-slate-200 p-1.5 rounded-lg text-xs font-semibold transition"
                          title="Trend Analizi"
                        >
                          <BarChart3 size={15} />
                        </button>
                        {isCritical ? (
                          <button
                            onClick={() => handleAutoReplenish(item)}
                            className="inline-flex items-center gap-1 bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow transition active:scale-95"
                          >
                            <Truck size={14} />
                            +{item.suggestedReplenishment} İkmal Onayla
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-xs font-semibold">
                            <CheckCircle2 size={12} /> Bütçe Dengeli
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trend Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-700/50 transition"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 text-orange-400 mb-1">
              <BarChart3 size={18} />
              <h3 className="text-xs font-bold uppercase tracking-wider">Talep ve Satış Trendi</h3>
            </div>
            <h2 className="text-lg font-bold text-white">{selectedProduct.product.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{selectedProduct.store.storeName} ({selectedProduct.store.city})</p>

            <div className="mt-6 bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
              <p className="text-xs text-slate-400 mb-3 flex items-center justify-between">
                <span>Son 6 Aylık Satış Trendi</span>
                <span className="text-emerald-400 font-semibold">Büyüme: +18%</span>
              </p>
              <div className="flex items-end justify-between gap-3 h-32 pt-4 px-2">
                {selectedProduct.historicalTrend.map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] text-slate-400 font-mono">{val}</span>
                    <div 
                      style={{ height: `${(val / 55) * 100}%` }}
                      className="w-full bg-gradient-to-t from-orange-600 to-amber-400 rounded-t transition-all duration-500"
                    />
                    <span className="text-[10px] text-slate-500">Ay {i + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Stok Devir Hızı</span>
                <span className="text-base font-bold text-amber-300 mt-0.5 block">{selectedProduct.turnoverRate}</span>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Tahmini Talep</span>
                <span className="text-base font-bold text-orange-400 mt-0.5 block">{selectedProduct.predictedDemand} Adet</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              {selectedProduct.stockQuantity <= selectedProduct.criticalThreshold && (
                <button
                  onClick={() => handleAutoReplenish(selectedProduct)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white py-2.5 rounded-xl text-xs font-semibold shadow transition active:scale-95"
                >
                  <Truck size={14} />
                  +{(selectedProduct.suggestedReplenishment * selectedProduct.product.unitPrice).toLocaleString('tr-TR')} ₺ Bütçe ile İkmal Onayla
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}