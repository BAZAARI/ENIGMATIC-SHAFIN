
import React, { useState, useRef } from 'react';
import { Search, ShoppingBag, User, Menu, X, MessageCircle, Wallet, PlusSquare, Moon, Sun, Sparkles, UserPlus, ShieldCheck, Languages, Headset, Lock, LogOut } from 'lucide-react';
import { Page, User as UserType, Language } from '../types';

interface NavbarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  cartCount: number;
  user: UserType | null;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onLogout: () => void;
  onLogoClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  currentPage, 
  setCurrentPage, 
  isDarkMode, 
  setIsDarkMode, 
  language,
  setLanguage,
  cartCount, 
  user, 
  onLoginClick, 
  onSignupClick,
  onLogout,
  onLogoClick
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const clickCountRef = useRef(0);
  const lastClickTimeRef = useRef(0);

  const handleLogoClick = (e: React.MouseEvent) => {
    const now = Date.now();
    if (now - lastClickTimeRef.current < 800) {
      clickCountRef.current += 1;
    } else {
      clickCountRef.current = 1;
    }
    lastClickTimeRef.current = now;

    if (clickCountRef.current === 5) {
      setCurrentPage(Page.AdminLogin);
      clickCountRef.current = 0; 
      if (window.navigator.vibrate) window.navigator.vibrate(50);
    } else if (clickCountRef.current === 1) {
      setCurrentPage(Page.Home);
    }
    
    if (onLogoClick) onLogoClick();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 shadow-sm border-b border-slate-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <div 
            className="flex items-center cursor-pointer group active:scale-95 transition-transform select-none" 
            onClick={handleLogoClick}
          >
            <div className="relative flex items-center justify-center mr-3 transition-transform group-hover:scale-105">
              <div className="bg-[#1A237E] w-12 h-12 rounded-xl rotate-3 absolute group-hover:rotate-6 transition-transform"></div>
              <div className="bg-[#FFD600] w-12 h-12 rounded-xl -rotate-3 border-2 border-[#1A237E] flex items-center justify-center relative z-10">
                <span className="text-[#1A237E] font-black text-2xl italic">B</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-[#1A237E] dark:text-white leading-none tracking-tighter">BAZAARI</span>
              <span className="text-[10px] font-black text-[#FFD600] bg-[#1A237E] px-2 py-0.5 rounded-sm mt-0.5 tracking-[0.2em] w-fit uppercase">Premium</span>
            </div>
          </div>

          <div className="hidden lg:flex flex-1 max-w-sm mx-6">
            <div className="relative w-full">
              <input type="text" placeholder={language === 'bn' ? 'পণ্য খুঁজুন...' : 'Search products...'} className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-full focus:ring-2 focus:ring-[#1A237E] text-sm outline-none transition-colors font-bold" />
              <Search className="absolute left-3 top-2 text-slate-400 w-4 h-4" />
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <button onClick={() => setCurrentPage(Page.SupportChat)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-[#FFD600] transition-all hover:scale-110" title={language === 'bn' ? 'লাইভ সাপোর্ট' : 'Live Support'}>
              <Headset className="w-5 h-5" />
            </button>

            <button onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-[#FFD600] transition-all flex items-center gap-2 px-3">
              <Languages className="w-5 h-5" />
              <span className="text-xs font-black uppercase">{language}</span>
            </button>

            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-[#FFD600] transition-all hover:rotate-12">
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button onClick={() => setCurrentPage(Page.PostAd)} className="flex items-center gap-2 px-6 py-2 bg-[#FFD600] text-[#1A237E] font-black rounded-full hover:scale-105 transition-all text-sm shadow-md italic">
              <PlusSquare className="w-4 h-4" /> {language === 'bn' ? 'অ্যাড দিন' : 'Post Ad'}
            </button>

            <div className="flex items-center gap-2 border-l pl-4 border-slate-200 dark:border-slate-700">
              <button onClick={() => setCurrentPage(Page.Wallet)} className="p-2 text-slate-400 hover:text-[#1A237E] dark:hover:text-white transition-colors" title={language === 'bn' ? 'ওয়ালেট' : 'Wallet'}><Wallet className="w-6 h-6" /></button>
              <button onClick={() => setCurrentPage(Page.Cart)} className="p-2 text-slate-400 hover:text-[#1A237E] dark:hover:text-white relative transition-colors">
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-bounce shadow-sm">{cartCount}</span>}
              </button>
              {user ? (
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentPage(Page.Wallet)} className="bg-[#1A237E] text-white p-2 rounded-full hover:bg-opacity-90 transition-all shadow-md border-2 border-white dark:border-slate-800" title={language === 'bn' ? 'প্রোফাইল' : 'Profile'}>
                    <User className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={onLogout} 
                    className="p-2 text-red-400 hover:text-red-500 transition-colors"
                    title={language === 'bn' ? 'লগ আউট' : 'Logout'}
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={onLoginClick} className="px-5 py-2 text-[#1A237E] dark:text-white rounded-full font-black text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all uppercase italic text-[10px] tracking-widest">Login</button>
                  <button onClick={onSignupClick} className="px-5 py-2 bg-[#1A237E] text-[#FFD600] rounded-full font-black text-sm hover:bg-opacity-90 transition-all shadow-lg uppercase italic border-2 border-[#FFD600] text-[10px] tracking-widest">Signup</button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:hidden flex items-center space-x-4">
             <button onClick={() => setCurrentPage(Page.SupportChat)} className="p-2 text-slate-600 dark:text-[#FFD600]"><Headset className="w-6 h-6" /></button>
             <button onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')} className="p-2 text-slate-600 dark:text-[#FFD600]"><Languages className="w-6 h-6" /></button>
             <button className="text-[#1A237E] dark:text-white" onClick={() => setIsDarkMode(!isDarkMode)}>{isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}</button>
             <button className="text-[#1A237E] dark:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}</button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-t p-6 space-y-4 shadow-2xl animate-in slide-in-from-top duration-300">
          <button onClick={() => {setCurrentPage(Page.Home); setIsMenuOpen(false);}} className="block w-full text-left py-3 font-black dark:text-white uppercase italic tracking-tighter">হোম</button>
          <button onClick={() => {setCurrentPage(Page.Shop); setIsMenuOpen(false);}} className="block w-full text-left py-3 font-black dark:text-white uppercase italic tracking-tighter">শপ</button>
          <button onClick={() => {setCurrentPage(Page.SupportChat); setIsMenuOpen(false);}} className="block w-full text-left py-3 font-black dark:text-white uppercase italic tracking-tighter">লাইভ সাপোর্ট</button>
          <button onClick={() => {setCurrentPage(Page.PostAd); setIsMenuOpen(false);}} className="block w-full py-4 bg-[#FFD600] text-[#1A237E] rounded-2xl font-black uppercase italic tracking-tighter shadow-lg">অ্যাড দিন</button>
          <div className="flex flex-col gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
             {user ? (
               <div className="space-y-2 w-full">
                 <button onClick={() => {setCurrentPage(Page.Wallet); setIsMenuOpen(false);}} className="w-full py-3 bg-[#1A237E] text-white rounded-xl font-bold flex items-center justify-center gap-2">
                   <User className="w-4 h-4" /> প্রোফাইল
                 </button>
                 <button 
                  onClick={() => { onLogout(); setIsMenuOpen(false); }} 
                  className="w-full py-3 border border-red-200 text-red-500 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-50"
                 >
                   <LogOut className="w-4 h-4" /> {language === 'bn' ? 'লগ আউট' : 'Logout'}
                 </button>
               </div>
             ) : (
               <div className="flex gap-4">
                 <button onClick={() => { onLoginClick(); setIsMenuOpen(false); }} className="flex-1 py-3 border border-[#1A237E] text-[#1A237E] dark:text-white rounded-xl font-bold uppercase italic text-[10px] tracking-widest">Login</button>
                 <button onClick={() => { onSignupClick(); setIsMenuOpen(false); }} className="flex-1 py-3 bg-[#1A237E] text-white rounded-xl font-bold uppercase italic text-[10px] tracking-widest">Signup</button>
               </div>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
