
import React, { useState, useMemo } from 'react';
import { Filter, Search, ChevronDown, SlidersHorizontal, Tag, Star } from 'lucide-react';
import { Product, Category } from '../types.ts';
import { CATEGORIES } from '../constants.tsx';
import ProductCard from './ProductCard.tsx';

interface ShopProps {
  products: Product[];
  addToCart: (p: Product) => void;
  onProductClick: (p: Product) => void;
}

const Shop: React.FC<ShopProps> = ({ products, addToCart, onProductClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<number>(50000);
  const [sortBy, setSortBy] = useState<'default' | 'priceLow' | 'priceHigh'>('default');

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             p.vendor.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory ? p.category.toLowerCase() === selectedCategory.toLowerCase() : true;
        const matchesPrice = p.price <= priceRange;
        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'priceLow') return a.price - b.price;
        if (sortBy === 'priceHigh') return b.price - a.price;
        return 0;
      });
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black text-[#1A237E] dark:text-white mb-2">প্রিমিয়াম কালেকশন</h2>
            <p className="text-slate-500">আপনার পছন্দের পণ্যটি খুঁজে নিন আমাদের আভিজাত্য থেকে</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="পণ্য বা ব্র্যান্ড খুঁজুন..." 
                className="pl-12 pr-6 py-4 bg-white dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-[#1A237E] w-full md:w-80 transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1A237E]" />
            </div>
            
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-2xl shadow-sm">
              <select 
                className="bg-transparent text-sm font-bold text-slate-600 dark:text-slate-300 outline-none px-2 py-2"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="default">সর্টিং (ডিফল্ট)</option>
                <option value="priceLow">দাম: কম থেকে বেশি</option>
                <option value="priceHigh">দাম: বেশি থেকে কম</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl">
              <div className="flex items-center gap-2 mb-8">
                <SlidersHorizontal className="w-5 h-5 text-[#1A237E] dark:text-[#FFD600]" />
                <h3 className="font-black text-xl text-slate-800 dark:text-white">ফিল্টার</h3>
              </div>

              <div className="space-y-10">
                {/* Category Filter */}
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">ক্যাটাগরি</h4>
                  <div className="space-y-2">
                    <button 
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all ${!selectedCategory ? 'bg-[#1A237E] text-white' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    >
                      সব পণ্য
                    </button>
                    {CATEGORIES.map(cat => (
                      <button 
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-between ${selectedCategory === cat.name ? 'bg-[#1A237E] text-white' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="text-lg">{cat.icon}</span>
                          {cat.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">মূল্য পরিসীমা (৳)</h4>
                  <input 
                    type="range" 
                    min="0" 
                    max="100000" 
                    step="500" 
                    value={priceRange}
                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                    className="w-full accent-[#1A237E]"
                  />
                  <div className="flex justify-between mt-4">
                    <span className="text-sm font-bold text-slate-500">৳০</span>
                    <span className="text-sm font-black text-[#1A237E] dark:text-[#FFD600]">৳{priceRange.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-9">
            {filteredProducts.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    addToCart={addToCart} 
                    onClick={() => onProductClick(product)} 
                  />
                ))}
              </div>
            ) : (
              <div className="py-32 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 text-center">
                 <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-8 h-8 text-slate-300" />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-400 mb-2">দুঃখিত! কোনো পণ্য পাওয়া যায়নি</h3>
                 <p className="text-slate-400">ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
