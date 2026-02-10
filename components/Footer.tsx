
import React from 'react';
import { ShoppingBag, Facebook, Instagram, Twitter, Youtube, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import { Page } from '../types';

interface FooterProps {
  setCurrentPage: (p: Page) => void;
  onAdminClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  return (
    <footer className="bg-white dark:bg-slate-900 pt-20 pb-10 border-t border-slate-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center cursor-pointer" onClick={() => setCurrentPage(Page.Home)}>
              <div className="bg-[#1A237E] p-2 rounded-lg mr-2"><ShoppingBag className="text-[#FFD600] w-6 h-6" /></div>
              <span className="text-2xl font-bold text-[#1A237E] dark:text-white">Bazaari</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Bazaari হলো বাংলাদেশের প্রিমিয়াম মাল্টি-ভেন্ডার লাইফস্টাইল মার্কেটপ্লেস। আমরা নিশ্চিত করি আভিজাত্য এবং কোয়ালিটি।
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-[#1A237E] dark:text-blue-400 hover:scale-110 transition-all"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 bg-pink-50 dark:bg-pink-900/20 rounded-xl flex items-center justify-center text-pink-600 dark:text-pink-400 hover:scale-110 transition-all"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 bg-sky-50 dark:bg-sky-900/20 rounded-xl flex items-center justify-center text-sky-500 dark:text-sky-400 hover:scale-110 transition-all"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wider">দ্রুত লিংক</h4>
            <ul className="space-y-4">
              <li><button onClick={() => setCurrentPage(Page.Shop)} className="text-slate-500 dark:text-slate-400 hover:text-[#1A237E] dark:hover:text-[#FFD600] transition-colors">শপ (Buy)</button></li>
              <li><button onClick={() => setCurrentPage(Page.PostAd)} className="text-slate-500 dark:text-slate-400 hover:text-[#1A237E] dark:hover:text-[#FFD600] transition-colors">অ্যাড দিন (Sell)</button></li>
              <li><button onClick={() => setCurrentPage(Page.TrackOrder)} className="text-slate-500 dark:text-slate-400 hover:text-[#1A237E] dark:hover:text-[#FFD600] transition-colors">অর্ডার ট্র্যাকিং</button></li>
              <li><button onClick={() => setCurrentPage(Page.AIChat)} className="text-slate-500 dark:text-slate-400 hover:text-[#1A237E] dark:hover:text-[#FFD600] transition-colors">এআই অ্যাসিস্ট্যান্ট</button></li>
            </ul>
          </div>

          {/* Support Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wider">সহায়তা</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-500 dark:text-slate-400"><Phone className="w-4 h-4" /> +৮৮০ ১৫১৬ ৫৯৫ ৫৯৭</li>
              <li className="flex items-center gap-3 text-slate-500 dark:text-slate-400"><Mail className="w-4 h-4" /> help@bazaari.com</li>
              <li className="flex items-center gap-3 text-slate-500 dark:text-slate-400"><MapPin className="w-4 h-4" /> বনানী, ঢাকা, বাংলাদেশ</li>
            </ul>
          </div>

          {/* Additional Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wider">নিরাপত্তা</h4>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
               <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                 "কেনাবেচার আগে পণ্য ভালোভাবে যাচাই করে নিন। ক্যাশ অন ডেলিভারি ব্যবহারের চেষ্টা করুন।"
               </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">© ২০২৪ Bazaari Marketplace. সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex gap-6">
             <a href="#" className="text-xs font-bold text-slate-400 hover:text-[#1A237E]">গোপনীয়তা নীতি</a>
             <a href="#" className="text-xs font-bold text-slate-400 hover:text-[#1A237E]">শর্তাবলী</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
