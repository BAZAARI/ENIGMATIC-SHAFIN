
import React, { useRef } from 'react';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, ShieldCheck, Upload, User as UserIcon, Camera } from 'lucide-react';
import { User } from '../types.ts';

interface WalletProps {
  user: User | null;
  onUserUpdate: (u: User) => void;
}

const Wallet: React.FC<WalletProps> = ({ user, onUserUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUserUpdate({ ...user, profilePic: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="py-12 max-w-6xl mx-auto px-4 space-y-12">
      {/* Top Section: Balance & Quick Stats */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-gradient-to-br from-[#1A237E] to-blue-900 p-8 md:p-12 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-blue-200 font-medium mb-2 uppercase tracking-widest text-xs">আপনার বর্তমান ব্যালেন্স</p>
            <h2 className="text-5xl font-black mb-8 tracking-tighter">৳০.০০</h2>
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

        <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-xl flex flex-col justify-center text-center">
          <div className="relative mx-auto mb-6 group">
            <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
              {user?.profilePic ? (
                <img src={user.profilePic} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                <UserIcon className="text-slate-400 w-12 h-12" />
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 bg-[#1A237E] text-white rounded-full shadow-lg border-2 border-white transition-transform hover:scale-110"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleProfilePicChange} />
          </div>
          <h3 className="text-xl font-bold text-[#1A237E] dark:text-white mb-1">{user?.name || 'ইউজার নাম'}</h3>
          <p className="text-slate-500 text-sm mb-4">@{user?.username || 'username'}</p>
          <div className={`inline-block py-2 px-6 rounded-full text-xs font-bold border ${user?.isVerified ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
            {user?.isVerified ? 'VERIFIED SELLER' : 'STANDARD USER'}
          </div>
        </div>
      </div>

      {/* History and NID Verification */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-xl">
          <h4 className="text-xl font-bold text-[#1A237E] dark:text-white mb-8">সাম্প্রতিক লেনদেন</h4>
          <div className="space-y-6">
            <div className="py-12 text-center text-slate-400">
               কোনো লেনদেনের ইতিহাস পাওয়া যায়নি।
            </div>
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
          <p className="text-[10px] text-center text-slate-500 mt-4 italic">© ২০২৬ Bazaari সিকিউরিটি প্যানেল</p>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
