
import React, { useState, useRef, useEffect } from 'react';
import { Rocket, ShieldCheck, CreditCard, ChevronRight, Camera, CheckCircle, Loader2, Zap, Package, Search, Smartphone, Image as ImageIcon, X } from 'lucide-react';
import { BoostRequest, Product, BoostPlan, Language } from '../types';

interface BoostPanelProps {
  onBoostSubmit: (request: BoostRequest) => void;
  initialProduct: Product | null;
  userProducts: Product[];
  plans: BoostPlan[];
  language: Language;
}

const BoostPanel: React.FC<BoostPanelProps> = ({ onBoostSubmit, initialProduct, userProducts, plans, language }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(initialProduct);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | null>(null);
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
    setScreenshot('https://picsum.photos/seed/payment/200/300'); 
    if (plans.length > 0) setSelectedPlan(plans[0].id);
  };

  const handleSubmit = () => {
    if (!selectedProduct) {
      alert(language === 'bn' ? 'অনুগ্রহ করে একটি পণ্য সিলেক্ট করুন।' : 'Please select a product.');
      return;
    }
    if (!trxId || !senderNumber || !selectedPlan || !screenshot || !paymentMethod) {
      alert(language === 'bn' ? 'অনুগ্রহ করে পেমেন্ট মেথড সহ সকল তথ্য এবং স্ক্রিনশট প্রদান করুন।' : 'Please provide all payment info and screenshot.');
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
    }, 2000);
  };

  const filteredProducts = userProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-20 max-w-5xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-black text-[#1A237E] dark:text-white mb-4 uppercase italic tracking-tighter">
          {language === 'bn' ? 'অ্যাড বুস্ট করুন' : 'Boost Your Post'}
        </h2>
        <p className="text-slate-500 font-medium">
          {language === 'bn' 
            ? '১০ গুণ বেশি কাস্টমারের কাছে পৌঁছাতে আপনার বিজ্ঞাপনটি বুস্ট করুন।' 
            : 'Get 10x more reach by boosting your product today.'}
        </p>
      </div>

      {!selectedProduct ? (
        <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in duration-500">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-[#1A237E] dark:text-white mb-6 flex items-center gap-3 uppercase">
              <Package className="w-6 h-6" /> {language === 'bn' ? 'পণ্য সিলেক্ট করুন' : 'Select Product'}
            </h3>
            <div className="relative mb-8">
              <input 
                type="text" 
                placeholder={language === 'bn' ? 'আপনার পোস্ট খুঁজুন...' : 'Find your post...'}
                className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-900 dark:text-white rounded-2xl outline-none border-2 border-transparent focus:border-[#1A237E] transition-all font-bold"
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
                  className="flex items-center gap-4 p-4 border-2 border-slate-50 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-[#1A237E] hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group"
                >
                  <img src={p.image} className="w-16 h-16 rounded-xl object-cover border border-slate-100 dark:border-slate-700 shadow-sm" />
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-[#1A237E] transition-colors">{p.name}</h4>
                    <p className="text-sm text-[#1A237E] dark:text-[#FFD600] font-black">৳{p.price}</p>
                  </div>
                  <ChevronRight className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-12 flex items-center justify-between bg-[#1A237E] p-8 rounded-[3rem] text-white shadow-2xl animate-in slide-in-from-top-6 duration-500">
            <div className="flex items-center gap-6">
              <img src={selectedProduct.image} className="w-24 h-24 rounded-2xl object-cover border-4 border-white/20 shadow-xl" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD600] mb-1 block">
                  Selected Post
                </span>
                <h3 className="text-2xl font-black">{selectedProduct.name}</h3>
                <p className="font-bold text-blue-200">৳{selectedProduct.price}</p>
              </div>
            </div>
            {!initialProduct && (
              <button onClick={() => setSelectedProduct(null)} className="px-6 py-2 bg-white/10 rounded-xl text-xs font-black uppercase hover:bg-white/20 transition-all">Change</button>
            )}
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {plans.map(plan => (
              <div 
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer text-center relative overflow-hidden group ${
                  selectedPlan === plan.id ? 'border-[#FFD600] bg-white dark:bg-slate-800 shadow-2xl scale-105' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-200'
                }`}
              >
                <div className={`w-14 h-14 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-colors ${selectedPlan === plan.id ? 'bg-[#1A237E]' : 'bg-slate-50 dark:bg-slate-800'}`}>
                  <Rocket className={`w-8 h-8 ${selectedPlan === plan.id ? 'text-[#FFD600]' : 'text-slate-300'}`} />
                </div>
                <h3 className="text-xl font-black text-[#1A237E] dark:text-white mb-2">{plan.days} {language === 'bn' ? 'দিন' : 'Days'}</h3>
                <p className="text-2xl font-black text-[#1A237E] dark:text-[#FFD600] mb-4">৳{plan.price}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{plan.description}</p>
                
                {selectedPlan === plan.id && <div className="absolute top-0 right-0 p-2"><CheckCircle className="text-[#1A237E] dark:text-[#FFD600] w-6 h-6" /></div>}
              </div>
            ))}
          </div>

          {selectedPlan && !isSubmitted && (
            <div className="bg-white dark:bg-slate-800 p-10 md:p-16 rounded-[4rem] shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-6 duration-500">
              <div className="flex justify-between items-center mb-10">
                <h4 className="text-2xl font-black text-[#1A237E] dark:text-white flex items-center gap-3 uppercase italic tracking-tighter">
                  <CreditCard className="text-[#FFD600]" /> Payment Gateway
                </h4>
                <button onClick={autofillData} className="text-[10px] font-black bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-[#FFD600] transition-all uppercase tracking-widest">Test Data</button>
              </div>

              <div className="grid md:grid-cols-2 gap-16">
                <div className="space-y-4">
                  <div onClick={() => setPaymentMethod('bKash')} className={`p-6 rounded-2xl flex justify-between items-center border-2 cursor-pointer transition-all ${paymentMethod === 'bKash' ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/10' : 'border-slate-100 dark:border-slate-900'}`}>
                    <span className="font-black text-pink-600">bKash (Per)</span>
                    <span className="font-black dark:text-white">01516-595597</span>
                  </div>
                  <div onClick={() => setPaymentMethod('Nagad')} className={`p-6 rounded-2xl flex justify-between items-center border-2 cursor-pointer transition-all ${paymentMethod === 'Nagad' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10' : 'border-slate-100 dark:border-slate-900'}`}>
                    <span className="font-black text-orange-600">Nagad (Per)</span>
                    <span className="font-black dark:text-white">01516-595597</span>
                  </div>
                  <div onClick={() => setPaymentMethod('Rocket')} className={`p-6 rounded-2xl flex justify-between items-center border-2 cursor-pointer transition-all ${paymentMethod === 'Rocket' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10' : 'border-slate-100 dark:border-slate-900'}`}>
                    <span className="font-black text-purple-600 flex items-center gap-2"><Smartphone className="w-5 h-5" /> Rocket</span>
                    <span className="font-black dark:text-white">01516-595597-4</span>
                  </div>

                  {/* Missing Fields added here */}
                  <div className="pt-4">
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Your Payment Screenshot</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-[16/9] bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-[#1A237E] transition-all overflow-hidden"
                    >
                      {screenshot ? (
                        <div className="relative w-full h-full">
                          <img src={screenshot} className="w-full h-full object-cover" />
                          <button 
                            onClick={(e) => { e.stopPropagation(); setScreenshot(null); }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="text-slate-300 w-10 h-10 mb-2" />
                          <span className="text-[10px] font-bold text-slate-400">Click to Upload</span>
                        </>
                      )}
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Sender Phone Number</label>
                    <input 
                      type="text" 
                      placeholder="01712xxxxxx" 
                      className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-900 dark:text-white border-2 border-transparent focus:border-[#1A237E] rounded-2xl outline-none font-black text-xl" 
                      value={senderNumber} 
                      onChange={(e) => setSenderNumber(e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Transaction ID (TrxID)</label>
                    <input 
                      type="text" 
                      placeholder="Enter TrxID" 
                      className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-900 dark:text-white border-2 border-transparent focus:border-[#1A237E] rounded-2xl outline-none font-black text-xl" 
                      value={trxId} 
                      onChange={(e) => setTrxId(e.target.value)} 
                    />
                  </div>
                  
                  <button onClick={handleSubmit} disabled={isVerifying} className="w-full py-6 bg-[#1A237E] text-[#FFD600] font-black rounded-3xl shadow-2xl hover:scale-[1.01] transition-all text-xl uppercase italic">
                    {isVerifying ? <Loader2 className="animate-spin mx-auto" /> : 'Confirm Boost'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {isSubmitted && (
        <div className="bg-white dark:bg-slate-800 p-16 rounded-[4rem] shadow-2xl text-center border-4 border-green-500 animate-in zoom-in">
          <CheckCircle className="text-green-500 w-24 h-24 mx-auto mb-8" />
          <h3 className="text-4xl font-black text-[#1A237E] dark:text-white mb-6 uppercase tracking-tighter italic">Boost Requested!</h3>
          <p className="text-slate-500 font-bold max-w-md mx-auto">অ্যাডমিন এটি যাচাই করার পর আপনার পণ্যটি ২ ঘণ্টার মধ্যে বুস্ট করা হবে।</p>
        </div>
      )}
    </div>
  );
};

export default BoostPanel;
