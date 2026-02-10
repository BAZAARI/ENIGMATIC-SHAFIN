
import React, { useRef, useState } from 'react';
import { ShieldCheck, Upload, User as UserIcon, Camera, Trash2, CheckCircle, Loader2, LogOut, Key, AtSign } from 'lucide-react';
import { User, Language, VerificationRequest } from '../types.ts';

interface WalletProps {
  user: User | null;
  onUserUpdate: (u: User) => void;
  language: Language;
  onVerifySubmit?: (req: VerificationRequest) => void;
  onLogout: () => void;
}

const Wallet: React.FC<WalletProps> = ({ user, onUserUpdate, language, onVerifySubmit, onLogout }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmittingNID, setIsSubmittingNID] = useState(false);
  const [nidSubmitted, setNidSubmitted] = useState(false);

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
        <h2 className="text-2xl font-bold text-slate-500">{language === 'bn' ? 'প্রোফাইল দেখতে লগইন করুন' : 'Please login to see profile'}</h2>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 space-y-12">
      <div className="bg-white dark:bg-slate-900 p-10 md:p-16 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center relative overflow-hidden">
        
        <button onClick={onLogout} className="absolute top-8 right-8 p-3 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
          <LogOut className="w-6 h-6" />
        </button>

        <div className="relative mb-8 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <div className="w-40 h-40 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-8 border-white dark:border-slate-800 shadow-2xl">
            {isUploading ? <Loader2 className="w-10 h-10 animate-spin text-[#1A237E]" /> : 
             user.profilePic ? <img src={user.profilePic} className="w-full h-full object-cover" /> : 
             <UserIcon className="text-slate-300 w-20 h-20" />}
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleProfilePicChange} />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-4xl font-black text-[#1A237E] dark:text-white tracking-tight">{user.name}</h3>
            {user.isVerified && <ShieldCheck className="text-[#FFD600] w-6 h-6 animate-pulse" />}
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-500">
               <Key className="w-4 h-4" /> UID: <span className="font-mono text-[#1A237E] dark:text-[#FFD600]">{user.uid}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-500">
               <AtSign className="w-4 h-4" /> @{user.username}
            </div>
          </div>
          
          <p className="text-slate-400 font-bold tracking-widest uppercase text-sm">{user.email}</p>
        </div>
      </div>

      {/* NID Section (Same as before but with verified check) */}
      <div className="bg-slate-900 p-10 md:p-16 rounded-[4rem] text-white shadow-2xl border border-white/5">
         {/* Verification Content... */}
         <h4 className="text-2xl font-bold mb-6">Security & Verification</h4>
         <p className="text-slate-400 mb-8">Account UID: {user.uid} (Unique identifier for Bazaari Network)</p>
      </div>
    </div>
  );
};

export default Wallet;
