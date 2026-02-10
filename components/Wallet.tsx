
import React, { useRef, useState } from 'react';
import { ShieldCheck, Upload, User as UserIcon, Camera, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import { User, Language } from '../types.ts';

interface WalletProps {
  user: User | null;
  onUserUpdate: (u: User) => void;
  language: Language;
}

const Wallet: React.FC<WalletProps> = ({ user, onUserUpdate, language }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        onUserUpdate({ ...user, profilePic: reader.result as string });
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePic = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) {
      onUserUpdate({ ...user, profilePic: undefined });
    }
  };

  if (!user) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-500">
          {language === 'bn' ? 'প্রোফাইল দেখতে লগইন করুন' : 'Please login to see profile'}
        </h2>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 space-y-12 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 p-10 md:p-16 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
        
        {/* Fixed Profile Pic Section */}
        <div className="relative mb-8 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <div className="w-40 h-40 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-8 border-white dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative">
            {isUploading ? (
              <Loader2 className="w-10 h-10 animate-spin text-[#1A237E]" />
            ) : user.profilePic ? (
              <img src={user.profilePic} className="w-full h-full object-cover" alt="Profile" />
            ) : (
              <UserIcon className="text-slate-300 w-20 h-20" />
            )}
            
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="text-white w-8 h-8" />
            </div>
          </div>
          
          <div className="absolute bottom-2 right-2 flex gap-2">
            {user.profilePic && (
              <button 
                onClick={removeProfilePic}
                className="p-3 bg-red-500 text-white rounded-full shadow-lg border-4 border-white dark:border-slate-900 transition-transform hover:scale-110 active:scale-90"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button 
              className="p-3 bg-[#1A237E] text-white rounded-full shadow-lg border-4 border-white dark:border-slate-900 transition-transform hover:scale-110 active:scale-90"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleProfilePicChange} />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-4xl font-black text-[#1A237E] dark:text-white tracking-tight">{user.name}</h3>
          <p className="text-slate-400 font-bold tracking-widest uppercase text-sm">{user.email}</p>
          
          <div className="flex flex-col gap-4 items-center pt-4">
            <div className={`flex items-center gap-2 py-3 px-8 rounded-full text-sm font-black border uppercase tracking-widest transition-all ${user.isVerified ? 'bg-green-50 text-green-700 border-green-200 animate-glow' : 'bg-slate-50 text-slate-400 border-slate-100 dark:bg-slate-800/50'}`}>
              {user.isVerified ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  {language === 'bn' ? 'ভেরিফাইড প্রিমিয়াম মেম্বার' : 'Verified Premium Member'}
                </>
              ) : (
                language === 'bn' ? 'সাধারণ সেলার' : 'Standard Seller'
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-10 md:p-16 rounded-[4rem] text-white shadow-2xl border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
           <ShieldCheck className="w-64 h-64" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-6 mb-8">
            <ShieldCheck className="w-14 h-14 text-[#FFD600]" />
            <div>
              <h4 className="text-3xl font-black">{language === 'bn' ? 'NID ভেরিফিকেশন' : 'NID Verification'}</h4>
              <p className="text-slate-400 font-medium">আপনার এনআইডি কার্ড দিয়ে অ্যাকাউন্ট ভেরিফাই করুন।</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="aspect-[1.6/1] border-2 border-dashed border-slate-700 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer hover:border-[#FFD600] hover:bg-white/5 transition-all group/box">
              <Upload className="text-slate-600 mb-3 group-hover/box:text-[#FFD600] transition-colors" />
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{language === 'bn' ? 'সম্মুখ অংশ' : 'Front Side'}</span>
            </div>
            <div className="aspect-[1.6/1] border-2 border-dashed border-slate-700 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer hover:border-[#FFD600] hover:bg-white/5 transition-all group/box">
              <Upload className="text-slate-600 mb-3 group-hover/box:text-[#FFD600] transition-colors" />
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{language === 'bn' ? 'পিছনের অংশ' : 'Back Side'}</span>
            </div>
          </div>
          
          <button className="w-full py-6 bg-white text-[#1A237E] font-black rounded-3xl hover:bg-[#FFD600] transition-all shadow-[0_20px_40px_rgba(0,0,0,0.3)] text-xl active:scale-[0.98]">
            {language === 'bn' ? 'ভেরিফিকেশন সাবমিট করুন' : 'Submit for Verification'}
          </button>
        </div>
        
        <div className="flex items-center justify-center mt-12 pt-8 border-t border-white/10 opacity-30">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">© ২০২৬ Bazaari Security Panel</p>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
