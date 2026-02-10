
import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Globe, Star, ShoppingBag, Tag, CircleDollarSign, Zap, ChevronRight } from 'lucide-react';
import { Page, Product } from '../types';

interface HeroProps {
  setCurrentPage: (p: Page) => void;
  setSelectedProduct: (p: Product) => void;
  boostedProducts: Product[];
}

const Hero: React.FC<HeroProps> = ({ setCurrentPage, setSelectedProduct, boostedProducts }) => {
  const [currentBoostedIdx, setCurrentBoostedIdx] = useState(0);

  useEffect(() => {
    if (boostedProducts.length === 0) return;
    const interval = setInterval(() => {
      setCurrentBoostedIdx((prev) => (prev + 1) % boostedProducts.length);
    }, 4000); // Change product every 4 seconds
    return () => clearInterval(interval);
  }, [boostedProducts.length]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage(Page.ProductDetail);
    window.scrollTo(0, 0);
  };

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center marketplace-bg py-20 overflow-hidden">
      {/* Decorative Background Icons */}
      <div className="absolute top-20 left-10 text-white/10 rotate-12 hidden lg:block">
        <ShoppingBag className="w-64 h-64" />
      </div>
      <div className="absolute bottom-10 right-10 text-white/5 -rotate-12 hidden lg:block">
        <Tag className="w-48 h-48" />
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Text Content */}
        <div className="animate-in fade-in slide-in-from-left-10 duration-1000 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-[#FFD600] text-sm font-black tracking-widest uppercase border border-white/20 mb-8 shadow-2xl">
            <Zap className="w-4 h-4 fill-current animate-bounce" />
            সেরা ডিল এবং প্রিমিয়াম কালেকশন
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight mb-8 drop-shadow-premium">
            সব কিনুন <br />
            সব বেচুন <br />
            <span className="text-[#FFD600] inline-block bg-[#1A237E]/60 px-6 py-2 rounded-3xl mt-4 border border-white/10 backdrop-blur-md animate-glow">
              Bazaari-তে
            </span>
          </h1>
          
          <p className="text-xl text-blue-50 max-w-xl mb-12 font-medium opacity-90 leading-relaxed drop-shadow-premium">
            আপনার পছন্দের পণ্য খুঁজে পাওয়া এবং দ্রুত বিক্রয় করা এখন আরও সহজ। আমাদের আভিজাত্যই আপনার আস্থা।
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <button 
              onClick={() => setCurrentPage(Page.Shop)} 
              className="group relative px-10 py-5 bg-[#FFD600] text-[#1A237E] font-black rounded-2xl hover:bg-white transform hover:-translate-y-1 transition-all flex items-center justify-center gap-4 shadow-2xl"
            >
              <span>পণ্য কিনুন</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
            
            <button 
              onClick={() => setCurrentPage(Page.PostAd)} 
              className="px-10 py-5 bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white font-black rounded-2xl hover:bg-white hover:text-[#1A237E] transition-all shadow-2xl"
            >
              অ্যাড দিন (Sell)
            </button>
          </div>
        </div>

        {/* Right Side: Boosted Products Showcase */}
        <div className="relative animate-in fade-in slide-in-from-right-10 duration-1000">
          <div className="relative z-20">
            {boostedProducts.length > 0 && (
              <>
                <div className="absolute -top-6 -left-6 bg-[#1A237E] text-[#FFD600] px-6 py-2 rounded-2xl font-black text-xs z-30 shadow-2xl flex items-center gap-2 border border-white/10">
                  <Sparkles className="w-4 h-4" /> বুস্টেড প্রোডাক্ট
                </div>

                {boostedProducts.map((product, idx) => (
                  <div 
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className={`transition-all duration-700 absolute inset-0 cursor-pointer ${
                      idx === currentBoostedIdx ? 'opacity-100 scale-100 translate-x-0 z-20' : 'opacity-0 scale-95 translate-x-10 z-10'
                    }`}
                    style={{ position: idx === currentBoostedIdx ? 'relative' : 'absolute' }}
                  >
                    <div className="bg-white/10 backdrop-blur-3xl border border-white/20 p-8 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] group overflow-hidden">
                      <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-6">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-4 right-4 bg-[#FFD600] text-[#1A237E] font-black px-4 py-1 rounded-full text-xs shadow-lg">
                          HOT DEAL
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-[#FFD600] font-black tracking-widest uppercase bg-[#1A237E]/40 px-3 py-1 rounded-lg border border-white/10">
                            {product.vendor}
                          </span>
                          <div className="flex items-center gap-1 text-[#FFD600]">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-bold">{product.rating}</span>
                          </div>
                        </div>
                        <h3 className="text-2xl font-black text-white leading-tight group-hover:text-[#FFD600] transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <p className="text-3xl font-black text-white">৳{product.price.toLocaleString()}</p>
                          <button className="p-3 bg-white/10 rounded-xl text-[#FFD600] group-hover:bg-[#FFD600] group-hover:text-[#1A237E] transition-all">
                            <ChevronRight className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          
          {/* Slider Indicators */}
          <div className="flex justify-center gap-3 mt-8">
            {boostedProducts.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentBoostedIdx ? 'w-10 bg-[#FFD600]' : 'w-3 bg-white/30'}`}
              ></div>
            ))}
          </div>
        </div>

      </div>

      {/* Centered Trust Badges (Bottom) */}
      <div className="absolute bottom-10 left-0 right-0 z-10 hidden lg:block">
        <div className="max-w-4xl mx-auto flex justify-between gap-12 px-8 py-6 bg-black/20 backdrop-blur-md rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div className="flex items-center gap-4 text-white">
            <ShieldCheck className="w-8 h-8 text-[#FFD600]" />
            <div>
              <p className="text-xs font-black uppercase tracking-tighter">১০০% নিরাপদ</p>
              <p className="text-[10px] opacity-60">ভেরিফাইড লেনদেন</p>
            </div>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="flex items-center gap-4 text-white">
            <Globe className="w-8 h-8 text-[#FFD600]" />
            <div>
              <p className="text-xs font-black uppercase tracking-tighter">সারা দেশ</p>
              <p className="text-[10px] opacity-60">ফাস্ট ডেলিভারি</p>
            </div>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="flex items-center gap-4 text-white">
            <CircleDollarSign className="w-8 h-8 text-[#FFD600]" />
            <div>
              <p className="text-xs font-black uppercase tracking-tighter">সেরা মূল্য</p>
              <p className="text-[10px] opacity-60">সরাসরি বিক্রেতা</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
