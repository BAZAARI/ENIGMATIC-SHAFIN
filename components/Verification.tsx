
import React, { useState } from 'react';
import { ShieldCheck, Check, CreditCard, Clock, CheckCircle, Loader2, Zap } from 'lucide-react';
import { VERIFY_PLANS } from '../constants';
import { VerificationRequest } from '../types';

interface VerificationProps {
  userEmail: string;
  onVerifySubmit: (request: VerificationRequest) => void;
}

const Verification: React.FC<VerificationProps> = ({ userEmail, onVerifySubmit }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [trx, setTrx] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const autofillData = () => {
    setTrx('VRF' + Math.random().toString(36).substr(2, 6).toUpperCase());
    if (!selected) setSelected('6m');
  };

  const handleSubmit = () => {
    if (!selected || !trx) {
      alert('প্ল্যান সিলেক্ট করুন এবং ট্রানজ্যাকশন আইডি দিন।');
      return;
    }
    if (!userEmail) {
      alert('আগে লগইন করুন!');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      const request: VerificationRequest = {
        id: Math.random().toString(36).substr(2, 9),
        planId: selected,
        trxId: trx,
        userEmail: userEmail,
        status: 'pending',
        timestamp: new Date().toLocaleString()
      };

      onVerifySubmit(request);
      setIsVerifying(false);
      setIsSubmitted(true);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="py-20 max-w-6xl mx-auto px-4 text-center">
        <div className="bg-white dark:bg-slate-800 p-12 rounded-[40px] shadow-2xl border border-green-100 dark:border-green-900/30 text-center animate-in zoom-in duration-500 max-w-lg mx-auto">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-white w-10 h-10" />
          </div>
          <h3 className="text-3xl font-black text-[#1A237E] dark:text-white mb-4">রিকোয়েস্ট জমা হয়েছে!</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg">
            আপনার ভেরিফিকেশন পেমেন্ট যাচাই করা হচ্ছে।
          </p>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
            <p className="text-[#1A237E] dark:text-[#FFD600] font-bold">
              আগামী ৩ ঘণ্টার মধ্যে আপনার অ্যাকাউন্টে ভেরিফিকেশন ব্যাজ যুক্ত হবে।
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 max-w-6xl mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-[#1A237E] dark:text-white mb-4">সেলার ভেরিফিকেশন</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">প্রিমিয়াম ব্যাজ নিয়ে বায়ারদের কাছে নিজের বিশ্বাসযোগ্যতা বাড়ান। ভেরিফাইড সেলারদের পণ্য দ্রুত বিক্রি হয়!</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {VERIFY_PLANS.map(plan => (
          <div 
            key={plan.id}
            onClick={() => setSelected(plan.id)}
            className={`p-10 rounded-[40px] border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col items-center ${
              selected === plan.id ? 'border-[#1A237E] bg-blue-50 dark:bg-slate-800 shadow-2xl scale-105' : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-200'
            }`}
          >
            <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center ${selected === plan.id ? 'bg-[#1A237E]' : 'bg-slate-100 dark:bg-slate-800'}`}>
              <ShieldCheck className={`w-8 h-8 ${selected === plan.id ? 'text-[#FFD600]' : 'text-slate-400'}`} />
            </div>
            <h3 className="text-2xl font-bold text-[#1A237E] dark:text-white mb-2">{plan.duration}</h3>
            <p className="text-4xl font-black text-[#1A237E] dark:text-white mb-6">৳{plan.price}</p>
            <p className="text-sm text-slate-500 mb-8">{plan.desc}</p>
            
            <ul className="space-y-3 w-full mb-10">
              <li className="flex items-center text-sm text-slate-600 dark:text-slate-400"><Check className="w-4 h-4 mr-2 text-green-500" /> গোল্ডেন ভেরিফাইড ব্যাজ</li>
              <li className="flex items-center text-sm text-slate-600 dark:text-slate-400"><Check className="w-4 h-4 mr-2 text-green-500" /> সার্চে অগ্রধিকার</li>
              <li className="flex items-center text-sm text-slate-600 dark:text-slate-400"><Check className="w-4 h-4 mr-2 text-green-500" /> আনলিমিটেড অ্যাড পোস্ট</li>
            </ul>

            <div className={`mt-auto w-full py-3 rounded-2xl font-bold text-center transition-all ${
              selected === plan.id ? 'bg-[#1A237E] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}>
              {selected === plan.id ? 'সিলেক্ট করা হয়েছে' : 'প্ল্যানটি বেছে নিন'}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-xl font-bold text-[#1A237E] dark:text-white flex items-center">
              <CreditCard className="mr-3 w-6 h-6 text-[#FFD600]" /> পেমেন্ট ডিটেইলস
            </h4>
            <button 
              type="button"
              onClick={autofillData}
              className="text-xs font-bold bg-[#FFD600]/10 text-[#1A237E] dark:text-[#FFD600] px-4 py-2 rounded-full border border-[#FFD600]/30 hover:bg-[#FFD600] hover:text-[#1A237E] transition-all flex items-center gap-2"
            >
              <Zap className="w-3 h-3 fill-current" /> টেস্ট ডাটা পূরণ করুন
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="p-5 bg-pink-50 dark:bg-pink-900/20 rounded-2xl flex justify-between items-center border border-pink-100 dark:border-pink-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-pink-600">b</div>
                  <span className="font-bold text-pink-600">bKash (Personal)</span>
                </div>
                <span className="font-mono font-bold text-[#1A237E] dark:text-white">01516-595597</span>
              </div>
              <div className="p-5 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex justify-between items-center border border-orange-100 dark:border-orange-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-orange-600">n</div>
                  <span className="font-bold text-orange-600">Nagad (Personal)</span>
                </div>
                <span className="font-mono font-bold text-[#1A237E] dark:text-white">01516-595597</span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Transaction ID (TrxID)</label>
                <input 
                  type="text" 
                  placeholder="পেমেন্ট করার পর আইডি দিন"
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-[#1A237E] rounded-2xl outline-none dark:text-white font-mono"
                  value={trx}
                  onChange={(e) => setTrx(e.target.value)}
                />
              </div>
              <button 
                type="button"
                onClick={handleSubmit}
                disabled={isVerifying}
                className="w-full py-5 bg-[#1A237E] text-[#FFD600] font-bold rounded-2xl hover:scale-[1.02] transition-all shadow-xl text-lg flex items-center justify-center disabled:opacity-70"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 w-6 h-6 animate-spin" /> পেমেন্ট যাচাই করা হচ্ছে...
                  </>
                ) : (
                  <>ভেরিফিকেশন রিকোয়েস্ট পাঠান</>
                )}
              </button>
              <div className="flex items-center justify-center text-[10px] text-slate-400 italic">
                <Clock className="w-3 h-3 mr-1" /> ২৪ ঘণ্টার মধ্যে ব্যাজ অ্যাক্টিভ করা হবে
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Verification;
