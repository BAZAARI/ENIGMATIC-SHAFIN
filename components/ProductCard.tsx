
import React, { useState } from 'react';
import { Star, ShoppingCart, Eye, Check } from 'lucide-react';
import { Product } from '../types.ts';

interface ProductCardProps {
  product: Product;
  addToCart: (p: Product) => void;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart, onClick }) => {
  const [isAdding, setIsAdding] = useState(false);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 2000);
  };

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] transition-all duration-500 transform hover:-translate-y-2">
      <div className="relative aspect-[4/5] overflow-hidden cursor-pointer" onClick={onClick}>
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-5 left-5 bg-[#FFD600] text-[#1A237E] text-xs font-black px-4 py-1.5 rounded-full shadow-lg border border-white/20">
          {discount}% অফ
        </div>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
          <button 
            onClick={handleAddToCart}
            className={`p-4 rounded-full transition-all shadow-2xl transform active:scale-90 ${
              isAdding ? 'bg-green-500 text-white' : 'bg-white text-[#1A237E] hover:bg-[#FFD600]'
            }`}
          >
            {isAdding ? <Check className="w-6 h-6" /> : <ShoppingCart className="w-6 h-6" />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); onClick(); }} className="bg-white p-4 rounded-full text-[#1A237E] hover:bg-[#FFD600] transition-all shadow-2xl transform active:scale-90">
            <Eye className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#1A237E] dark:text-[#FFD600] bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-md">
            {product.vendor}
          </span>
          <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/30 px-2.5 py-1 rounded-lg text-xs font-black text-yellow-700 dark:text-yellow-400">
            <Star className="w-3.5 h-3.5 fill-current mr-1" />
            {product.rating}
          </div>
        </div>
        
        <h3 onClick={onClick} className="font-bold text-slate-800 dark:text-white text-xl mb-3 line-clamp-1 group-hover:text-[#1A237E] dark:group-hover:text-[#FFD600] transition-colors cursor-pointer leading-tight">
          {product.name}
        </h3>

        <div className="flex items-baseline space-x-3 mb-6">
          <span className="text-2xl font-black text-[#1A237E] dark:text-[#FFD600]">৳{product.price.toLocaleString()}</span>
          <span className="text-sm text-slate-400 line-through font-bold opacity-70">৳{product.originalPrice.toLocaleString()}</span>
        </div>

        <button 
          onClick={handleAddToCart}
          className={`w-full py-4 font-black rounded-2xl border-2 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
            isAdding 
              ? 'bg-green-500 border-green-500 text-white' 
              : 'bg-transparent border-[#1A237E] dark:border-slate-600 text-[#1A237E] dark:text-white hover:bg-[#1A237E] hover:text-white dark:hover:bg-[#FFD600] dark:hover:text-[#1A237E] dark:hover:border-[#FFD600]'
          }`}
        >
          {isAdding ? <><Check className="w-5 h-5" /> যোগ হয়েছে</> : <><ShoppingCart className="w-5 h-5" /> কার্টে যোগ করুন</>}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
