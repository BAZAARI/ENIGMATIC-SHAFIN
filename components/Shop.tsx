
import React, { useState, useMemo, useEffect } from 'react';
import { Filter, Search, ChevronDown, SlidersHorizontal, Tag, Star, Users, UserCheck, X } from 'lucide-react';
import { Product, Category, Language } from '../types.ts';
import { CATEGORIES } from '../constants.tsx';
import ProductCard from './ProductCard.tsx';

interface ShopProps {
  products: Product[];
  addToCart: (p: Product) => void;
  onProductClick: (p: Product) => void;
  language: Language;
  initialToLetType?: 'Bachelor' | 'Family' | null;
  adminEmails?: string[];
}

const Shop: React.FC<ShopProps> = ({ products, addToCart, onProductClick, language, initialToLetType, adminEmails = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [rentalFilter, setRentalFilter] = useState<'Bachelor' | 'Family' | null>(initialToLetType || null);
  const [priceRange, setPriceRange] = useState<number>(100000);
  const [sortBy, setSortBy] = useState<'default' | 'priceLow' | 'priceHigh'>('default');

  useEffect(() => {
    if (initialToLetType) {
      setSelectedCategory('টু-লেট');
      setRentalFilter(initialToLetType);
    }
  }, [initialToLetType]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             p.vendor.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory ? p.category.toLowerCase() === selectedCategory.toLowerCase() : true;
        const matchesRental = (selectedCategory === 'টু-লেট' && rentalFilter) ? p.rentalType === rentalFilter : true;
        const matchesPrice = p.price <= priceRange;
        return matchesSearch && matchesCategory && matchesPrice && matchesRental;
      })
      .sort((a, b) => {
        if (sortBy === 'priceLow') return a.price - b.price;
        if (sortBy === 'priceHigh') return b.price - a.price;
        return 0;
      });
  }, [products, searchQuery, selectedCategory, rentalFilter, priceRange, sortBy]);

  const t = {
    title: language === 'bn' ? 'প্রিমিয়াম কালেকশন' : 'Premium Collection',
    subtitle: language === 'bn' ? 'আপনার পছন্দের পণ্যটি খুঁজে নিন আমাদের আভিজাত্য থেকে' : 'Find your favorite product from our collection',
    search: language === 'bn' ? 'পণ্য বা ব্র্যান্ড খুঁজুন...' : 'Search products or brands...',
    sortDefault: language === 'bn' ? 'সর্টিং (ডিফল্ট)' : 'Sorting (Default)',
    sortLow: language === 'bn' ? 'দাম: কম থেকে বেশি' : 'Price: Low to High',
    sortHigh: language === 'bn' ? 'দাম: বেশি থেকে কম' : 'Price: High to Low',
    filter: language === 'bn' ? 'ফিল্টার' : 'Filter',
    cat: language === 'bn' ? 'ক্যাটাগরি' : 'Category',
    all: language === 'bn' ? 'সব পণ্য' : 'All Products',
    price: language === 'bn' ? 'মূল্য পরিসীমা (৳)' : 'Price Range (৳)',
    noFound: language === 'bn' ? 'দুঃখিত! কোনো পণ্য পাওয়া যায়নি' : 'Sorry! No products found',
    tryAgain: language === 'bn' ? 'ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।' : 'Try again by changing the filter.'
  };

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black text-[#1A237E] dark:text-white mb-2 italic uppercase tracking-tighter">
              {selectedCategory === 'টু-লেট' ? (rentalFilter ? `${rentalFilter} To-Let` : 'To-Let Collection') : t.title}
            </h2>
            <p className="text-slate-500">{t.subtitle}</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative group flex-grow md:flex-grow-0">
              <input 
                type="text" 
                placeholder={t.search} 
                className="pl-12 pr-6 py-4 bg-white dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-[#1A237E] w-full md:w-80 transition-all shadow-sm font-bold"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-2xl shadow-sm">
              <select className="bg-transparent text-sm font-bold text-slate-600 dark:text-slate-300 outline-none px-2 py-2 appearance-none" value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                <option value="default">{t.sortDefault}</option>
                <option value="priceLow">{t.sortLow}</option>
                <option value="priceHigh">{t.sortHigh}</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 mr-2" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl">
              <div className="flex items-center gap-2 mb-8">
                <SlidersHorizontal className="w-5 h-5 text-[#1A237E] dark:text-[#FFD600]" />
                <h3 className="font-black text-xl text-slate-800 dark:text-white uppercase italic">FILTERS</h3>
              </div>

              <div className="space-y-10">
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">{t.cat}</h4>
                  <div className="space-y-2">
                    <button onClick={() => { setSelectedCategory(null); setRentalFilter(null); }} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all ${!selectedCategory ? 'bg-[#1A237E] text-white shadow-lg' : 'hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-300'}`}>{t.all}</button>
                    {CATEGORIES.map(cat => (
                      <button key={cat.id} onClick={() => { setSelectedCategory(cat.name); if(cat.name !== 'টু-লেট') setRentalFilter(null); }} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-between ${selectedCategory === cat.name ? 'bg-[#1A237E] text-white shadow-lg' : 'hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-300'}`}>
                        <span className="flex items-center gap-3"><span>{cat.icon}</span>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedCategory === 'টু-লেট' && (
                  <div className="animate-in slide-in-from-top-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Type</h4>
                    <div className="flex gap-2">
                      <button onClick={() => setRentalFilter('Bachelor')} className={`flex-1 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1 border ${rentalFilter === 'Bachelor' ? 'bg-[#1A237E] text-white border-[#1A237E]' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500'}`}><Users className="w-3 h-3" /> Bachelor</button>
                      <button onClick={() => setRentalFilter('Family')} className={`flex-1 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1 border ${rentalFilter === 'Family' ? 'bg-pink-600 text-white border-pink-600' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500'}`}><UserCheck className="w-3 h-3" /> Family</button>
                    </div>
                    {rentalFilter && (
                      <button onClick={() => setRentalFilter(null)} className="w-full mt-2 text-[10px] text-slate-400 font-bold hover:text-red-500 flex items-center justify-center gap-1"><X className="w-3 h-3" /> Clear Rental Filter</button>
                    )}
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">{t.price}</h4>
                  <input type="range" min="0" max="200000" step="500" value={priceRange} onChange={(e) => setPriceRange(parseInt(e.target.value))} className="w-full accent-[#1A237E]" />
                  <div className="flex justify-between mt-4"><span className="text-sm font-bold text-slate-500">৳০</span><span className="text-sm font-black text-[#1A237E] dark:text-[#FFD600]">৳{priceRange.toLocaleString()}</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-9">
            {filteredProducts.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} addToCart={addToCart} onClick={() => onProductClick(product)} language={language} adminEmails={adminEmails} />
                ))}
              </div>
            ) : (
              <div className="py-32 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 text-center animate-in fade-in">
                 <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6"><Search className="w-8 h-8 text-slate-300" /></div>
                 <h3 className="text-2xl font-bold text-slate-400 mb-2">{t.noFound}</h3>
                 <p className="text-slate-400">{t.tryAgain}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
