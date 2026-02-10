
import React, { useState } from 'react';
import { Product } from '../types';
import { ShoppingCart, Phone, MapPin, Share2, ShieldCheck, Heart, ArrowLeft, MessageCircle, AlertTriangle, Info, Clock } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  addToCart: (p: Product) => void;
  onLoginRequired: () => void;
  adminEmails?: string[];
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, addToCart, onLoginRequired, adminEmails = [] }) => {
  const [showFullNumber, setShowFullNumber] = useState(false);

  const share = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Bazaari-তে এই পণ্যটি দেখুন!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('লিংক কপি করা হয়েছে!');
    }
  };

  const handleProtectedAction = (action: () => void) => {
    // We assume the caller handles the user check via onLoginRequired
    action();
  };

  return (
    <div className="py-12 bg-white dark:bg-slate-900 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Left: Images (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="aspect-[4/3] bg-slate-50 dark:bg-slate-800 rounded-[3rem] overflow-hidden border border-slate-100 dark:border-slate-700 shadow-2xl group">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700 cursor-pointer hover:border-[#1A237E] transition-all">
                  <img src={product.image} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-700 space-y-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <Info className="text-[#1A237E] dark:text-[#FFD600]" /> পণ্যের বিবরণ
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                {product.description || `এই চমৎকার প্রিমিয়াম কোয়ালিটি ${product.name} আপনার আধুনিক লাইফস্টাইলের জন্য সেরা পছন্দ। এর টেকসই ডিজাইন এবং আকর্ষণীয় ফিনিশিং আপনাকে দিবে এক অনন্য অভিজ্ঞতা। প্রতিটি সেলাই এবং ফিনিশিংয়ে আমরা নিশ্চিত করেছি সর্বোচ্চ মান।`}
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">অবস্থা</p>
                  <p className="font-bold">নতুন (Brand New)</p>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">ক্যাটাগরি</p>
                  <p className="font-bold">{product.category}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Info & Seller (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-xl space-y-8 sticky top-28">
              <div>
                <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">{product.name}</h1>
                <div className="flex items-center gap-4">
                  <p className="text-[#1A237E] dark:text-[#FFD600] text-4xl font-black">৳{product.price.toLocaleString()}</p>
                  {product.originalPrice > product.price && (
                    <p className="text-slate-400 line-through font-bold mt-1">৳{product.originalPrice.toLocaleString()}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full py-5 bg-[#1A237E] text-[#FFD600] font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-xl"
                >
                  <ShoppingCart className="w-6 h-6" /> কার্টে যোগ করুন
                </button>
                <div className="flex gap-4">
                  <button onClick={onLoginRequired} className="flex-1 py-4 bg-pink-50 dark:bg-pink-900/20 text-pink-600 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-pink-100 transition-all">
                    <Heart className="w-5 h-5" /> ফেভারিট
                  </button>
                  <button onClick={share} className="flex-1 py-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-100 transition-all">
                    <Share2 className="w-5 h-5" /> শেয়ার
                  </button>
                </div>
              </div>

              {/* Seller Box */}
              <div className="p-10 bg-slate-50/50 dark:bg-slate-900/50 rounded-[3rem] border border-slate-100 dark:border-slate-700 space-y-8 shadow-inner">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-[#1A237E] rounded-full flex items-center justify-center text-[#FFD600] font-black text-4xl shadow-2xl border-4 border-white dark:border-slate-800">
                      {product.vendor[0]}
                    </div>
                    <div className="absolute -bottom-1 right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white dark:border-slate-800"></div>
                  </div>
                  <div>
                    <h4 className="font-black text-2xl text-slate-800 dark:text-white leading-tight">{product.vendor}</h4>
                    <p className="text-sm text-green-500 font-bold flex items-center gap-1 mt-1">
                      <ShieldCheck className="w-4 h-4" /> ভেরিফাইড মেম্বার
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4 bg-white dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300 font-medium">
                    <MapPin className="w-5 h-5 text-[#1A237E] dark:text-[#FFD600]" /> 
                    {product.location || 'রাজশাহী, বাংলাদেশ'}
                  </div>
                  <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300 font-medium">
                    <Clock className="w-5 h-5 text-[#1A237E] dark:text-[#FFD600]" /> 
                    মেম্বারশিপ: ৬ বছর
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => {
                      if (!showFullNumber) {
                        onLoginRequired();
                        // For demonstration, we'll let them show it, but in real flow login modal blocks it.
                        setShowFullNumber(true);
                      }
                    }}
                    className="w-full py-5 bg-[#FFD600] text-[#1A237E] font-black rounded-2xl flex items-center justify-center gap-4 shadow-xl hover:bg-yellow-400 transition-all text-lg group"
                  >
                    <Phone className="w-6 h-6 group-hover:rotate-12 transition-transform" /> 
                    {showFullNumber ? (product.phone || '+৮৮০ ১৫১৬ ৫৯৫ ৫৯৭') : `কল দিন: ${product.phone?.substring(0, 8) || '+৮৮০ ১৫১৬'}...`}
                  </button>
                  <button 
                    onClick={onLoginRequired}
                    className="w-full py-5 bg-white dark:bg-slate-800 text-[#1A237E] dark:text-white border-2 border-[#1A237E] dark:border-slate-600 font-black rounded-2xl flex items-center justify-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-lg"
                  >
                    <MessageCircle className="w-6 h-6" /> মেসেজ করুন
                  </button>
                </div>
              </div>

              <div className="p-6 bg-yellow-50 dark:bg-yellow-900/10 rounded-[2rem] border border-yellow-100 dark:border-yellow-900/20 flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800 dark:text-yellow-200 leading-relaxed font-medium">
                  সতর্কতা: পণ্য কেনার আগে ভালোমতো যাচাই করে নিন। টাকা পরিশোধের আগে ডেলিভারি নিশ্চিত করুন। Bazaari কোনো অসাধু লেনদেনের দায়ভার নেয় না।
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
