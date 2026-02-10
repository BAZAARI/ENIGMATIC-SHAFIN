
import React from 'react';
import { Home, ShoppingBag, PlusCircle, ShoppingCart, User, Heart } from 'lucide-react';
import { Page, Language } from '../types';

interface BottomNavProps {
  currentPage: Page;
  setCurrentPage: (p: Page) => void;
  cartCount: number;
  language: Language;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentPage, setCurrentPage, cartCount, language }) => {
  const t = {
    home: language === 'bn' ? 'হোম' : 'Home',
    shop: language === 'bn' ? 'শপ' : 'Shop',
    post: language === 'bn' ? 'অ্যাড দিন' : 'Post Ad',
    cart: language === 'bn' ? 'কার্ট' : 'Cart',
    profile: language === 'bn' ? 'প্রোফাইল' : 'Profile'
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-[100] shadow-[0_-10px_20px_rgba(0,0,0,0.05)] backdrop-blur-lg bg-opacity-90">
      <button 
        onClick={() => setCurrentPage(Page.Home)}
        className={`flex flex-col items-center gap-1 transition-all ${currentPage === Page.Home ? 'text-[#1A237E] scale-110' : 'text-slate-400'}`}
      >
        <Home className={`w-6 h-6 ${currentPage === Page.Home ? 'fill-current' : ''}`} />
        <span className="text-[10px] font-bold">{t.home}</span>
      </button>

      <button 
        onClick={() => setCurrentPage(Page.Shop)}
        className={`flex flex-col items-center gap-1 transition-all ${currentPage === Page.Shop ? 'text-[#1A237E] scale-110' : 'text-slate-400'}`}
      >
        <ShoppingBag className={`w-6 h-6 ${currentPage === Page.Shop ? 'fill-current' : ''}`} />
        <span className="text-[10px] font-bold">{t.shop}</span>
      </button>

      <button 
        onClick={() => setCurrentPage(Page.PostAd)}
        className="flex flex-col items-center -mt-10"
      >
        <div className="bg-[#FFD600] text-[#1A237E] p-4 rounded-full shadow-2xl border-4 border-white dark:border-slate-900 transform active:scale-90 transition-all animate-glow">
          <PlusCircle className="w-8 h-8" />
        </div>
        <span className="text-[10px] font-black mt-1 text-[#1A237E] dark:text-[#FFD600]">{t.post}</span>
      </button>

      <button 
        onClick={() => setCurrentPage(Page.Cart)}
        className={`flex flex-col items-center gap-1 transition-all relative ${currentPage === Page.Cart ? 'text-[#1A237E] scale-110' : 'text-slate-400'}`}
      >
        <ShoppingCart className={`w-6 h-6 ${currentPage === Page.Cart ? 'fill-current' : ''}`} />
        {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">{cartCount}</span>}
        <span className="text-[10px] font-bold">{t.cart}</span>
      </button>

      <button 
        onClick={() => setCurrentPage(Page.Wallet)}
        className={`flex flex-col items-center gap-1 transition-all ${currentPage === Page.Wallet ? 'text-[#1A237E] scale-110' : 'text-slate-400'}`}
      >
        <User className={`w-6 h-6 ${currentPage === Page.Wallet ? 'fill-current' : ''}`} />
        <span className="text-[10px] font-bold">{t.profile}</span>
      </button>
    </div>
  );
};

export default BottomNav;
