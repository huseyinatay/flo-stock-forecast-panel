import React, { useState, useEffect } from 'react';
import { 
  Package, 
  AlertTriangle, 
  Search, 
  RefreshCw,
  ArrowDownRight,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Truck,
  Leaf,
  Globe,
  Zap,
  Award
} from 'lucide-react';

export default function App() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [notification, setNotification] = useState(null);

  const defaultMock = [
    {
      _id: 'inv_01',
      store: { storeCode: 'IST-MALL-01', storeName: 'Mall of İstanbul FLO', clusterSegment: 'A', city: 'İstanbul', region: 'Türkiye', channel: 'Omnichannel' },
      product: { sku: 'LMB-SNK-2026', title: 'Lumberjack Sport Sneaker', brand: 'Lumberjack', category: 'Ayakkabı', unitPrice: 1899.90 },
      stockQuantity: 8,
      criticalThreshold: 15,
      predictedDemand: 45,
      suggestedReplenishment: 37,
      esgMetrics: { carbonSavedKg: 14.2, ecoRoute: 'Elektrikli Filo / Yakın Depo' },
      supplyChain: { agilityScore: 94, logisticsStatus: 'Yeşil Rota Aktif' }
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
      supplyChain: { agilityScore: 88, logisticsStatus: 'Sınır Ötesi Stabil' }
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
      supplyChain: { agilityScore: 96, logisticsStatus: 'Düşük Emisyonlu Sevkiyat' }
    },
    {
      _id: 'inv_04',
      store: { storeCode: 'KAZ-ALM-01', storeName: 'Almatı Mega FLO', clusterSegment: 'A', city: 'Almatı', region: 'EEMEA', channel: 'Omnichannel' },
      product: { sku: 'NW-BAG-440', title: 'Nine West Omuz Çantası', brand: 'Nine West', category: 'Aksesuar', unitPrice: 2199.50 },
      stockQuantity: 28,
      criticalThreshold: 10,
      predictedDemand: 30,
      suggestedReplenishment: 0,
      esgMetrics: { carbonSavedKg: 32.1, ecoRoute: 'Merkezi Raylı Sistem' },
      supplyChain: { agilityScore: 82, logisticsStatus: 'Uluslararası Yeşil Hat' }
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
          esgMetrics: defaultMock[idx % defaultMock.length].esgMetrics,
          supplyChain: defaultMock[idx % defaultMock.length].supplyChain,
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
      title: 'Yeşil Lojistik & Eko-İkmal Başlatıldı',
      message: `${item.store.city} mağazası için ${item.esgMetrics.ecoRoute} rotasıyla +${qty} adet ürün transferi başlatıldı (${item.esgMetrics.carbonSavedKg} kg CO2 tasarrufu).`
    });

    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const totalStock = inventory.reduce((acc, item) => acc + item.stockQuantity, 0);
  const criticalCount = inventory.filter(item => item.stockQuantity <= item.criticalThreshold).length;
  const totalCarbonSaved = inventory.reduce((acc, item) => acc + (item.esgMetrics?.carbonSavedKg || 0), 0);

  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.store.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.store.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      {notification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-emerald-950 border border-emerald-500/50 text-emerald-200 px-5 py-4 rounded-xl shadow-2xl animate-bounce">
          <Leaf className="text-emerald-400" size={24} />
          <div>
            <p className="font-bold text-sm text-white">{notification.title}</p>
            <p className="text-xs text-emerald-300 mt-0.5">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-orange-600 text-white font-black px-2.5 py-1 rounded text-lg tracking-wider">FLO</span>
            <h1 className="text-xl font-bold tracking-tight text-white">Sürdürülebilir Stok & Yeşil Lojistik Paneli</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">ESG Standartları, Düşük Karbon Salımlı Rota ve Çevik İkmal Modeli</p>
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
            <h3 className="text-2xl font-bold text-white mt-1">{totalStock}</h3>
            <span className="text-emerald-400 text-xs flex items-center mt-1">
              <ArrowUpRight size={14} className="mr-0.5" /> Envanter Hazır
            </span>
          </div>
          <div className="bg-blue-500/10 p-3 rounded-lg text-blue-400">
            <Package size={24} />
          </div>
        </div>

        <div className="bg-slate-800/80 border border-red-500/30 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Kritik Stok Uyarısı</p>
            <h3 className="text-2xl font-bold text-red-400 mt-1">{criticalCount} Ürün</h3>
            <span className="text-red-400 text-xs flex items-center mt-1">
              <ArrowDownRight size={14} className="mr-0.5" /> Acil Eko-İkmal
            </span>
          </div>
          <div className="bg-red-500/10 p-3 rounded-lg text-red-400 animate-pulse">
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="bg-slate-800/80 border border-emerald-500/30 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Karbon Tasarrufu (ESG)</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">{totalCarbonSaved.toFixed(1)} kg CO₂</h3>
            <span className="text-emerald-300 text-xs flex items-center mt-1">
              <Leaf size={14} className="mr-1" /> Yeşil Rota Optimizasyonu
            </span>
          </div>
          <div className="bg-emerald-500/10 p-3 rounded-lg text-emerald-400">
            <Leaf size={24} />
          </div>
        </div>

        <div className="bg-slate-800/80 border border-amber-500/30 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Kurumsal ESG Başarısı</p>
            <h3 className="text-2xl font-bold text-amber-400 mt-1">12 Ödül</h3>
            <span className="text-amber-300 text-xs flex items-center mt-1">
              <Award size={14} className="mr-0.5" /> 2025-2026 Dönemi
            </span>
          </div>
          <div className="bg-amber-500/10 p-3 rounded-lg text-amber-400">
            <Award size={24} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Ürün, mağaza veya bölge ara..."
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
                <th className="py-3.5 px-4 font-semibold">Bölge & Kanal</th>
                <th className="py-3.5 px-4 font-semibold">Mağaza Lokasyonu</th>
                <th className="py-3.5 px-4 font-semibold text-center">Stok / Eşik</th>
                <th className="py-3.5 px-4 font-semibold text-center">Yeşil Lojistik & ESG</th>
                <th className="py-3.5 px-4 font-semibold text-center">Tahmini Talep</th>
                <th className="py-3.5 px-4 font-semibold text-center">İkmal Aksiyonu</th>
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
                      <span className={`inline-block border rounded px-2 py-0.5 text-xs font-medium ${item.store.region === 'EEMEA' ? 'bg-indigo-900/50 border-indigo-500/50 text-indigo-300' : 'bg-slate-900 border-slate-700 text-slate-300'}`}>
                        {item.store.region} • {item.store.channel}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-slate-200">{item.store.storeName}</p>
                      <span className="text-xs text-slate-400 flex items-center mt-0.5 gap-1">
                        <Globe size={10} /> {item.store.city} • Seg. {item.store.clusterSegment}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold text-base ${isCritical ? "text-red-400" : "text-emerald-400"}`}>
                        {item.stockQuantity}
                      </span>
                      <span className="text-xs text-slate-400 block font-normal mt-0.5">Eşik: {item.criticalThreshold}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                          <Leaf size={12} /> {item.esgMetrics?.carbonSavedKg} kg CO₂ Tasarruf
                        </span>
                        <span className="text-xs text-slate-400 mt-0.5">
                          {item.esgMetrics?.ecoRoute}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-slate-200 font-medium bg-slate-900/60 px-2.5 py-1 rounded border border-slate-700">
                        <Sparkles size={12} className="text-orange-400" />
                        {item.predictedDemand}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isCritical ? (
                        <button
                          onClick={() => handleAutoReplenish(item)}
                          className="inline-flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow transition transform active:scale-95"
                        >
                          <Truck size={14} />
                          +{item.suggestedReplenishment} Eko-İkmal
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-xs font-semibold">
                          <CheckCircle2 size={12} /> Yeşil Rota Tamam
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