
import React from 'react';
import { ShoppingBag, Facebook, Instagram, Twitter, Youtube, MapPin, Mail, Phone, ExternalLink, Headset } from 'lucide-react';
import { Page, Language } from '../types.ts';

interface FooterProps {
  setCurrentPage: (p: Page) => void;
  onAdminClick: () => void;
  language: Language;
}

const Footer: React.FC<FooterProps> = ({ setCurrentPage, language }) => {
  const t = {
    desc: language === 'bn' 
      ? 'Bazaari হলো বাংলাদেশের প্রিমিয়াম মাল্টি-ভেন্ডার লাইফস্টাইল মার্কেটপ্লেস। আমরা নিশ্চিত করি আভিজাত্য এবং কোয়ালিটি।'
      : 'Bazaari is the premium multi-vendor lifestyle marketplace in Bangladesh. We ensure elegance and quality.',
    quickLinks: language === 'bn' ? 'দ্রুত লিংক' : 'Quick Links',
    shop: language === 'bn' ? 'শপ (Buy)' : 'Shop (Buy)',
    post: language === 'bn' ? 'অ্যাড দিন (Sell)' : 'Post Ad (Sell)',
    track: language === 'bn' ? 'অর্ডার ট্র্যাকিং' : 'Order Tracking',
    ai: language === 'bn' ? 'এআই অ্যাসিস্ট্যান্ট' : 'AI Assistant',
    support: language === 'bn' ? 'সহায়তা' : 'Support',
    liveSupport: language === 'bn' ? 'লাইভ সাপোর্ট চ্যাট' : 'Live Support Chat',
    location: language === 'bn' ? 'বাংলাদেশ' : 'Bangladesh',
    security: language === 'bn' ? 'নিরাপত্তা' : 'Security',
    warning: language === 'bn' 
      ? '"কেনাবেচার আগে পণ্য ভালোভাবে যাচাই করে নিন। ক্যাশ অন ডেলিভারি ব্যবহারের চেষ্টা করুন।"'
      : '"Verify products carefully before buying/selling. Try using Cash on Delivery."',
    rights: language === 'bn' ? '© ২০২৬ Bazaari Marketplace. সর্বস্বত্ব সংরক্ষিত।' : '© 2026 Bazaari Marketplace. All Rights Reserved.',
    privacy: language === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy',
    terms: language === 'bn' ? 'শর্তাবলী' : 'Terms & Conditions'
  };

  return (
    <footer className="bg-white dark:bg-slate-900 pt-20 pb-10 border-t border-slate-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center cursor-pointer group" onClick={() => setCurrentPage(Page.Home)}>
              <div className="relative flex items-center justify-center mr-3 scale-90">
                <div className="bg-[#1A237E] w-10 h-10 rounded-xl rotate-3 absolute"></div>
                <div className="bg-[#FFD600] w-10 h-10 rounded-xl -rotate-3 border-2 border-[#1A237E] flex items-center justify-center relative z-10">
                  <span className="text-[#1A237E] font-black text-xl italic">B</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-[#1A237E] dark:text-white leading-none tracking-tighter">BAZAARI</span>
                <span className="text-[8px] font-black text-[#FFD600] bg-[#1A237E] px-1.5 py-0.5 rounded-sm mt-0.5 tracking-[0.2em] w-fit">PREMIUM</span>
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              {t.desc}
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-[#1A237E] dark:text-blue-400 hover:scale-110 transition-all"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 bg-pink-50 dark:bg-pink-900/20 rounded-xl flex items-center justify-center text-pink-600 dark:text-pink-400 hover:scale-110 transition-all"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 bg-sky-50 dark:bg-sky-900/20 rounded-xl flex items-center justify-center text-sky-500 dark:text-sky-400 hover:scale-110 transition-all"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wider">{t.quickLinks}</h4>
            <ul className="space-y-4">
              <li><button onClick={() => setCurrentPage(Page.Shop)} className="text-slate-500 dark:text-slate-400 hover:text-[#1A237E] dark:hover:text-[#FFD600] transition-colors">{t.shop}</button></li>
              <li><button onClick={() => setCurrentPage(Page.PostAd)} className="text-slate-500 dark:text-slate-400 hover:text-[#1A237E] dark:hover:text-[#FFD600] transition-colors">{t.post}</button></li>
              <li><button onClick={() => setCurrentPage(Page.TrackOrder)} className="text-slate-500 dark:text-slate-400 hover:text-[#1A237E] dark:hover:text-[#FFD600] transition-colors">{t.track}</button></li>
              <li><button onClick={() => setCurrentPage(Page.AIChat)} className="text-slate-500 dark:text-slate-400 hover:text-[#1A237E] dark:hover:text-[#FFD600] transition-colors">{t.ai}</button></li>
            </ul>
          </div>

          {/* Support Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wider">{t.support}</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-500 dark:text-slate-400"><Phone className="w-4 h-4" /> +৮৮০ ১৫১৬ ৫৯৫ ৫৯৭</li>
              <li className="flex items-center gap-3 text-slate-500 dark:text-slate-400"><Mail className="w-4 h-4" /> bazaarihelp@gmail.com</li>
              <li className="flex items-center gap-3 text-slate-500 dark:text-slate-400"><MapPin className="w-4 h-4" /> {t.location}</li>
              <li className="pt-2">
                <button 
                  onClick={() => setCurrentPage(Page.SupportChat)}
                  className="w-full py-3 bg-[#1A237E] text-[#FFD600] font-black rounded-xl flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-md text-sm"
                >
                  <Headset className="w-4 h-4" /> {t.liveSupport}
                </button>
              </li>
            </ul>
          </div>

          {/* Additional Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wider">{t.security}</h4>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
               <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                 {t.warning}
               </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t.rights}</p>
          <div className="flex gap-6">
             <a href="#" className="text-xs font-bold text-slate-400 hover:text-[#1A237E]">{t.privacy}</a>
             <a href="#" className="text-xs font-bold text-slate-400 hover:text-[#1A237E]">{t.terms}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
