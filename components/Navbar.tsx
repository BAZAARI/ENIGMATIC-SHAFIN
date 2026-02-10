
import React, { useState } from 'react';
import { Search, ShoppingBag, User, Menu, X, MessageCircle, Wallet, PlusSquare, Moon, Sun, Sparkles, UserPlus, ShieldCheck } from 'lucide-react';
import { Page, User as UserType } from '../types';

interface NavbarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  cartCount: number;
  user: UserType | null;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onLogoClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  currentPage, 
  setCurrentPage, 
  isDarkMode, 
  setIsDarkMode, 
  cartCount, 
  user, 
  onLoginClick, 
  onSignupClick,
  onLogoClick
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 shadow-sm border-b border-slate-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <div 
            className="flex items-center cursor-pointer group" 
            onClick={() => {
              setCurrentPage(Page.Home);
              if (onLogoClick) onLogoClick();
            }}
          >
            <div className="bg-[#1A237E] p-2 rounded-lg mr-2 transition-transform group-hover:scale-110">
              <ShoppingBag className="text-[#FFD600] w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-[#1A237E] dark:text-white">Bazaari</span>
          </div>

          <div className="hidden lg:flex flex-1 max-w-sm mx-6">
            <div className="relative w-full">
              <input type="text" placeholder="পণ্য খুঁজুন..." className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-full focus:ring-2 focus:ring-[#1A237E] text-sm outline-none transition-colors" />
              <Search className="absolute left-3 top-2 text-slate-400 w-4 h-4" />
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-5">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-[#FFD600] transition-all hover:rotate-12">
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button onClick={() => setCurrentPage(Page.AIChat)} className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-full text-[#1A237E] dark:text-blue-300 relative group transition-all">
              <Sparkles className="w-5 h-5" />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1A237E] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all">Smart AI</span>
            </button>

            <button onClick={() => setCurrentPage(Page.PostAd)} className="flex items-center gap-2 px-6 py-2 bg-[#FFD600] text-[#1A237E] font-bold rounded-full hover:scale-105 transition-all text-sm shadow-md">
              <PlusSquare className="w-4 h-4" /> অ্যাড দিন
            </button>

            <div className="flex items-center gap-2 border-l pl-4 border-slate-200 dark:border-slate-700">
              <button onClick={() => setCurrentPage(Page.Messenger)} className="p-2 text-slate-400 hover:text-[#1A237E] dark:hover:text-white relative"><MessageCircle className="w-6 h-6" /></button>
              <button onClick={() => setCurrentPage(Page.Wallet)} className="p-2 text-slate-400 hover:text-[#1A237E] dark:hover:text-white"><Wallet className="w-6 h-6" /></button>
              <button onClick={() => setCurrentPage(Page.Cart)} className="p-2 text-slate-400 hover:text-[#1A237E] dark:hover:text-white relative">
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-bounce">{cartCount}</span>}
              </button>
              {user ? (
                <div className="relative">
                  <button className="bg-[#1A237E] text-white p-2 rounded-full hover:bg-opacity-90 transition-all shadow-md">
                    <User className="w-5 h-5" />
                  </button>
                  {user.isVerified && (
                    <div className="absolute -top-1 -right-1 bg-[#FFD600] rounded-full p-0.5 border border-[#1A237E]">
                      <ShieldCheck className="w-3 h-3 text-[#1A237E]" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={onLoginClick} className="px-5 py-2 text-[#1A237E] dark:text-white rounded-full font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">Login</button>
                  <button onClick={onSignupClick} className="px-5 py-2 bg-[#1A237E] text-white rounded-full font-bold text-sm hover:bg-opacity-90 transition-all shadow-lg flex items-center gap-2">
                    <UserPlus className="w-4 h-4" /> Signup
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:hidden flex items-center space-x-4">
             <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-slate-600 dark:text-[#FFD600]">{isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}</button>
             <button className="text-[#1A237E] dark:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}</button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-t p-6 space-y-4 shadow-2xl animate-in slide-in-from-top duration-300">
          <button onClick={() => {setCurrentPage(Page.Home); setIsMenuOpen(false);}} className="block w-full text-left py-3 font-bold dark:text-white">হোম</button>
          <button onClick={() => {setCurrentPage(Page.Shop); setIsMenuOpen(false);}} className="block w-full text-left py-3 font-bold dark:text-white">শপ</button>
          <button onClick={() => {setCurrentPage(Page.PostAd); setIsMenuOpen(false);}} className="block w-full py-4 bg-[#FFD600] text-[#1A237E] rounded-2xl font-bold">অ্যাড দিন</button>
          <button onClick={() => {setCurrentPage(Page.AIChat); setIsMenuOpen(false);}} className="block w-full py-4 bg-blue-50 dark:bg-blue-900/30 text-[#1A237E] dark:text-white rounded-2xl font-bold flex items-center justify-center gap-2"><Sparkles className="w-5 h-5" /> এআই চ্যাট</button>
          <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
             {user ? (
               <button className="flex-1 py-3 bg-[#1A237E] text-white rounded-xl font-bold flex items-center justify-center gap-2">
                 {user.isVerified && <ShieldCheck className="w-4 h-4 text-[#FFD600]" />} প্রোফাইল
               </button>
             ) : (
               <>
                 <button onClick={() => { onLoginClick(); setIsMenuOpen(false); }} className="flex-1 py-3 border border-[#1A237E] text-[#1A237E] dark:text-white rounded-xl font-bold">লগইন</button>
                 <button onClick={() => { onSignupClick(); setIsMenuOpen(false); }} className="flex-1 py-3 bg-[#1A237E] text-white rounded-xl font-bold">সাইনআপ</button>
               </>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
