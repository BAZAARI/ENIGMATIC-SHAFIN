
import React, { useState, useRef, useEffect } from 'react';
import { Rocket, ShieldCheck, CreditCard, ChevronRight, Camera, CheckCircle, Loader2, Zap, Package, Search } from 'lucide-react';
import { BOOST_PLANS } from '../constants';
import { BoostRequest, Product } from '../types';

interface BoostPanelProps {
  onBoostSubmit: (request: BoostRequest) => void;
  initialProduct: Product | null;
  userProducts: Product[];
}

const BoostPanel: React.FC<BoostPanelProps> = ({ onBoostSubmit, initialProduct, userProducts }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(initialProduct);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | null>(null);
  const [trxId, setTrxId] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialProduct) {
      setSelectedProduct(initialProduct);
    }
  }, [initialProduct]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const autofillData = () => {
    setPaymentMethod('bKash');
    setSenderNumber('01516595597');
    setTrxId('TRX' + Math.random().toString(36).substr(2, 6).toUpperCase());
    setScreenshot('https://picsum.photos/seed/payment/200/300'); // Mock image
  };

  const handleSubmit = () => {
    if (!selectedProduct) {
      alert('অনুগ্রহ করে একটি পণ্য সিলেক্ট করুন।');
      return;
    }
    if (!trxId || !senderNumber || !selectedPlan || !screenshot || !paymentMethod) {
      alert('অনুগ্রহ করে পেমেন্ট মেথড সহ সকল তথ্য এবং স্ক্রিনশট প্রদান করুন।');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      const request: BoostRequest = {
        id: Math.random().toString(36).substr(2, 9),
        productId: selectedProduct.id,
        planId: selectedPlan,
        paymentMethod,
        senderNumber,
        trxId,
        screenshot,
        status: 'pending',
        timestamp: new Date().toLocaleString()
      };

      onBoostSubmit(request);
      setIsVerifying(false);
      setIsSubmitted(true);
      
      setTimeout(() => {
        setSelectedPlan(null);
        setPaymentMethod(null);
        setTrxId('');
        setSenderNumber('');
        setScreenshot(null);
        setIsSubmitted(false);
      }, 5000);
    }, 2000);
  };

  const filteredProducts = userProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-20 max-w-5xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1A237E] dark:text-white mb-4">অ্যাড বুস্ট করুন</h2>
        <p className="text-slate-500">আপনার পণ্যটি দ্রুত বিক্রি করতে আজই বুস্ট করুন। সাধারণ বিজ্ঞাপনের চেয়ে ১০ গুণ বেশি রিচ!</p>
      </div>

      {!selectedProduct ? (
        <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-700 animate-in fade-in duration-500">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-[#1A237E] dark:text-white mb-6 flex items-center gap-3">
              <Package className="w-6 h-6" /> বুস্ট করার জন্য পণ্য সিলেক্ট করুন
            </h3>
            <div className="relative mb-8">
              <input 
                type="text" 
                placeholder="আপনার পোস্ট খুঁজুন..."
                className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-900 dark:text-white rounded-2xl outline-none border-2 border-transparent focus:border-[#1A237E] transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredProducts.map(p => (
                <div 
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className="flex items-center gap-4 p-4 border-2 border-slate-50 dark:border-slate-700 rounded-2xl cursor-pointer hover:border-[#1A237E] hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group"
                >
                  <img src={p.image} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-[#1A237E] transition-colors">{p.name}</h4>
                    <p className="text-sm text-[#1A237E] dark:text-[#FFD600] font-bold">৳{p.price}</p>
                  </div>
                  <ChevronRight className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full py-10 text-center text-slate-400">
                  কোন পণ্য খুঁজে পাওয়া যায়নি।
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-12 flex items-center justify-between bg-blue-50 dark:bg-slate-800 p-6 rounded-3xl border border-blue-100 dark:border-slate-700 animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-4">
              <img src={selectedProduct.image} className="w-20 h-20 rounded-2xl object-cover shadow-lg" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#1A237E] dark:text-[#FFD600] mb-1 block">নির্বাচিত পণ্য</span>
                <h3 className="text-xl font-bold dark:text-white">{selectedProduct.name}</h3>
                <p className="font-bold text-[#1A237E] dark:text-[#FFD600]">৳{selectedProduct.price}</p>
              </div>
            </div>
            {!initialProduct && (
              <button 
                onClick={() => setSelectedProduct(null)}
                className="text-sm font-bold text-[#1A237E] dark:text-white hover:underline px-4 py-2"
              >
                পরিবর্তন করুন
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {BOOST_PLANS.map(plan => (
              <div 
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`p-8 rounded-3xl border-2 transition-all cursor-pointer text-center relative overflow-hidden ${
                  selectedPlan === plan.id ? 'border-[#1A237E] bg-blue-50 dark:bg-slate-800 shadow-xl scale-105' : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-200'
                }`}
              >
                {plan.id === '7d' && (
                  <div className="absolute top-4 -right-12 bg-[#FFD600] text-[#1A237E] text-[10px] font-bold py-1 px-12 rotate-45">POPULAR</div>
                )}
                <Rocket className={`w-12 h-12 mx-auto mb-6 ${selectedPlan === plan.id ? 'text-[#1A237E] dark:text-[#FFD600]' : 'text-slate-300'}`} />
                <h3 className="text-2xl font-bold text-[#1A237E] dark:text-white mb-2">{plan.days} দিন</h3>
                <p className="text-3xl font-black text-[#1A237E] dark:text-[#FFD600] mb-4">৳{plan.price}</p>
                <p className="text-sm text-slate-500">{plan.description}</p>
                <div className={`mt-6 w-8 h-8 mx-auto rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === plan.id ? 'bg-[#1A237E] border-[#1A237E] dark:bg-[#FFD600] dark:border-[#FFD600]' : 'border-slate-200'
                }`}>
                  {selectedPlan === plan.id && <ShieldCheck className="w-5 h-5 text-white dark:text-[#1A237E]" />}
                </div>
              </div>
            ))}
          </div>

          {selectedPlan && !isSubmitted && (
            <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-8">
                <h4 className="text-xl font-bold text-[#1A237E] dark:text-white flex items-center">
                  <CreditCard className="mr-3 w-6 h-6 text-[#FFD600]" /> পেমেন্ট প্রক্রিয়া
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
                  <button 
                    type="button"
                    onClick={() => setPaymentMethod('bKash')}
                    className={`w-full p-4 rounded-2xl flex justify-between items-center border-2 transition-all ${
                      paymentMethod === 'bKash' ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 shadow-md scale-[1.02]' : 'border-pink-100 dark:border-pink-900/10 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <span className={`font-bold ${paymentMethod === 'bKash' ? 'text-pink-600' : 'text-pink-400'}`}>bKash (Personal)</span>
                    <span className="font-mono font-bold text-[#1A237E] dark:text-white">01516-595597</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPaymentMethod('Nagad')}
                    className={`w-full p-4 rounded-2xl flex justify-between items-center border-2 transition-all ${
                      paymentMethod === 'Nagad' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-md scale-[1.02]' : 'border-orange-100 dark:border-orange-900/10 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <span className={`font-bold ${paymentMethod === 'Nagad' ? 'text-orange-600' : 'text-orange-400'}`}>Nagad (Personal)</span>
                    <span className="font-mono font-bold text-[#1A237E] dark:text-white">01516-595597</span>
                  </button>
                  <p className="text-xs text-slate-400 mt-4 italic">
                    * ওপরের যেকোনো মেথড সিলেক্ট করে 'Send Money' করুন এবং নিচের তথ্য দিন।
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">আপনার {paymentMethod || 'বিকাশ/নগদ'} নাম্বার</label>
                      <input 
                        type="text" 
                        placeholder="01XXXXX..."
                        className="w-full px-6 py-4 bg-slate-100 dark:bg-slate-900 dark:text-white border-2 border-transparent focus:border-[#1A237E] rounded-2xl outline-none transition-all font-mono"
                        value={senderNumber}
                        onChange={(e) => setSenderNumber(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">ট্রানজ্যাকশন আইডি (TrxID)</label>
                      <input 
                        type="text" 
                        placeholder="যেমন: AH78JK90"
                        className="w-full px-6 py-4 bg-slate-100 dark:bg-slate-900 dark:text-white border-2 border-transparent focus:border-[#1A237E] rounded-2xl outline-none transition-all font-mono"
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">পেমেন্ট স্ক্রিনশট (SS)</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                        screenshot ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-[#1A237E]'
                      }`}
                    >
                      {screenshot ? (
                        <img src={screenshot} className="h-full w-full object-contain p-2 rounded-2xl" alt="SS" />
                      ) : (
                        <>
                          <Camera className="text-slate-400 mb-2" />
                          <span className="text-xs font-bold text-slate-400">স্ক্রিনশট আপলোড করুন</span>
                        </>
                      )}
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                  </div>

                  <button 
                    type="button"
                    onClick={handleSubmit}
                    disabled={isVerifying}
                    className="w-full py-5 bg-[#1A237E] text-[#FFD600] font-black rounded-2xl hover:scale-[1.02] shadow-xl transition-all flex items-center justify-center text-lg disabled:opacity-70"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="mr-2 w-6 h-6 animate-spin" /> পেমেন্ট যাচাই করা হচ্ছে...
                      </>
                    ) : (
                      <>
                        পেমেন্ট ভেরিফাই করুন <ChevronRight className="ml-2 w-6 h-6" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {isSubmitted && (
        <div className="bg-white dark:bg-slate-800 p-12 rounded-[40px] shadow-2xl border border-green-100 dark:border-green-900/30 text-center animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-white w-10 h-10" />
          </div>
          <h3 className="text-3xl font-black text-[#1A237E] dark:text-white mb-4">রিকোয়েস্ট জমা হয়েছে!</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            আপনার পেমেন্ট ভেরিফাই করা হচ্ছে। পরবর্তী ২ ঘণ্টার মধ্যে আপনার অ্যাডটি বুস্ট করা হবে। ধন্যবাদ।
          </p>
        </div>
      )}
    </div>
  );
};

export default BoostPanel;
