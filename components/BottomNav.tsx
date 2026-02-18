
import React from 'react';
import { Home, ShoppingBag, PlusCircle, ShoppingCart, User, MessageSquare } from 'lucide-react';
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
    msgs: language === 'bn' ? 'মেসেজ' : 'Messages',
    profile: language === 'bn' ? 'প্রোফাইল' : 'Profile'
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-4 py-3 flex justify-between items-center z-[100] shadow-[0_-10px_20px_rgba(0,0,0,0.1)] backdrop-blur-lg bg-opacity-95">
      <button 
        onClick={() => setCurrentPage(Page.Home)}
        className={`flex flex-col items-center gap-1 transition-all flex-1 ${currentPage === Page.Home ? 'text-[#1A237E] scale-110' : 'text-slate-400'}`}
      >
        <Home className={`w-6 h-6 ${currentPage === Page.Home ? 'fill-current' : ''}`} />
        <span className="text-[9px] font-black uppercase tracking-tighter">{t.home}</span>
      </button>

      <button 
        onClick={() => setCurrentPage(Page.Shop)}
        className={`flex flex-col items-center gap-1 transition-all flex-1 ${currentPage === Page.Shop ? 'text-[#1A237E] scale-110' : 'text-slate-400'}`}
      >
        <ShoppingBag className={`w-6 h-6 ${currentPage === Page.Shop ? 'fill-current' : ''}`} />
        <span className="text-[9px] font-black uppercase tracking-tighter">{t.shop}</span>
      </button>

      <button 
        onClick={() => setCurrentPage(Page.PostAd)}
        className="flex flex-col items-center -mt-12 flex-1 relative z-20"
      >
        <div className="bg-[#FFD600] text-[#1A237E] p-4 rounded-full shadow-[0_0_20px_rgba(255,214,0,0.5)] border-4 border-white dark:border-slate-900 transform active:scale-90 transition-all animate-glow">
          <PlusCircle className="w-8 h-8" />
        </div>
        <span className="text-[9px] font-black mt-1 text-[#1A237E] dark:text-[#FFD600] uppercase tracking-tighter">{t.post}</span>
      </button>

      <button 
        onClick={() => setCurrentPage(Page.SupportChat)}
        className={`flex flex-col items-center gap-1 transition-all flex-1 ${currentPage === Page.SupportChat ? 'text-[#1A237E] scale-110' : 'text-slate-400'}`}
      >
        <MessageSquare className={`w-6 h-6 ${currentPage === Page.SupportChat ? 'fill-current' : ''}`} />
        <span className="text-[9px] font-black uppercase tracking-tighter">{t.msgs}</span>
      </button>

      <button 
        onClick={() => setCurrentPage(Page.Wallet)}
        className={`flex flex-col items-center gap-1 transition-all flex-1 ${currentPage === Page.Wallet ? 'text-[#1A237E] scale-110' : 'text-slate-400'}`}
      >
        <User className={`w-6 h-6 ${currentPage === Page.Wallet ? 'fill-current' : ''}`} />
        <span className="text-[9px] font-black uppercase tracking-tighter">{t.profile}</span>
      </button>
    </div>
  );
};

export default BottomNav;
