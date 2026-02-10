
import React from 'react';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, ShieldCheck, Upload } from 'lucide-react';

const Wallet: React.FC = () => {
  return (
    <div className="py-12 max-w-6xl mx-auto px-4 space-y-12">
      {/* Top Section: Balance & Quick Stats */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-gradient-to-br from-[#1A237E] to-blue-900 p-8 md:p-12 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-blue-200 font-medium mb-2 uppercase tracking-widest text-xs">আপনার বর্তমান ব্যালেন্স</p>
            <h2 className="text-5xl font-black mb-8 tracking-tighter">৳১,৫০০.০০</h2>
            <div className="flex gap-4">
              <button className="px-8 py-4 bg-[#FFD600] text-[#1A237E] font-bold rounded-2xl hover:bg-yellow-400 transition-all flex items-center">
                টাকা এড করুন <ArrowUpRight className="ml-2 w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all border border-white/20">
                উত্তোলন
              </button>
            </div>
          </div>
          <WalletIcon className="absolute right-[-40px] bottom-[-40px] w-64 h-64 text-white/5" />
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl flex flex-col justify-center text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="text-green-600 w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-[#1A237E] mb-2">প্রিমিয়াম মেম্বার</h3>
          <p className="text-slate-500 text-sm mb-6">আপনার অ্যাকাউন্টটি ভেরিফাইড এবং সুরক্ষিত।</p>
          <div className="inline-block py-2 px-6 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
            VERIFIED
          </div>
        </div>
      </div>

      {/* History and NID Verification */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl">
          <h4 className="text-xl font-bold text-[#1A237E] mb-8">সাম্প্রতিক লেনদেন</h4>
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex justify-between items-center p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <ArrowDownLeft className="text-[#1A237E] w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-[#1A237E]">অ্যাড বুস্ট পেমেন্ট</p>
                    <p className="text-xs text-slate-400">১২ মার্চ, ২০২৪ • ট্রানজ্যাকশন আইডি: BZ-901</p>
                  </div>
                </div>
                <span className="font-bold text-red-500">-৳১৫০</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 p-8 md:p-12 rounded-[40px] text-white shadow-2xl">
          <h4 className="text-xl font-bold mb-4">NID ভেরিফিকেশন</h4>
          <p className="text-slate-400 mb-8 text-sm">ভেরিফাইড সেলার হিসেবে নিজেকে প্রতিষ্ঠিত করতে আপনার জাতীয় পরিচয়পত্র আপলোড করুন।</p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="aspect-[3/2] border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
              <Upload className="text-slate-500 mb-2" />
              <span className="text-[10px] font-bold text-slate-500">সামনের অংশ</span>
            </div>
            <div className="aspect-[3/2] border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
              <Upload className="text-slate-500 mb-2" />
              <span className="text-[10px] font-bold text-slate-500">পিছনের অংশ</span>
            </div>
          </div>
          <button className="w-full py-4 bg-white text-[#1A237E] font-bold rounded-2xl hover:bg-slate-100 transition-all">
            সাবমিট করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
