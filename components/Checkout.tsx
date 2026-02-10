
import React, { useState } from 'react';
import { ShoppingBag, MapPin, CreditCard, ChevronRight, CheckCircle, ArrowLeft, Loader2, Phone, User, Home, Wallet } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutProps {
  items: CartItem[];
  total: number;
  onOrderComplete: (orderData: any) => void;
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ items, total, onOrderComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'COD'>('COD');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'ঢাকা',
    notes: ''
  });

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const handleSubmit = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      onOrderComplete({
        ...formData,
        paymentMethod,
        total: total + 60,
        items
      });
      setLoading(false);
    }, 2000);
  };

  const deliveryCharge = 60;
  const grandTotal = total + deliveryCharge;

  return (
    <div className="py-20 max-w-5xl mx-auto px-4">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={onBack} className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:scale-110 transition-all">
          <ArrowLeft className="w-6 h-6 dark:text-white" />
        </button>
        <div>
          <h2 className="text-3xl font-black text-[#1A237E] dark:text-white">চেকআউট</h2>
          <p className="text-slate-500">আপনার তথ্য দিয়ে অর্ডারটি কনফার্ম করুন</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Main Checkout Section */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Progress Bar */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl mb-8 flex justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0 mx-20"></div>
            {[1, 2, 3].map(i => (
              <div key={i} className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-black transition-all ${
                step >= i ? 'bg-[#1A237E] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}>
                {step > i ? <CheckCircle className="w-6 h-6" /> : i}
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl">
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <h3 className="text-2xl font-bold flex items-center gap-3 mb-8">
                  <MapPin className="text-[#1A237E] dark:text-[#FFD600]" /> শিপিং অ্যাড্রেস
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">আপনার নাম</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input 
                        type="text" 
                        placeholder="আবরার আহমেদ" 
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl outline-none border focus:border-[#1A237E]"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">ফোন নম্বর</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input 
                        type="text" 
                        placeholder="০১৫১৬ ৫৯৫ ৫৯৭" 
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl outline-none border focus:border-[#1A237E]"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">পুরো ঠিকানা</label>
                  <div className="relative">
                    <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder="বাসা নম্বর, রোড, এলাকা..." 
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl outline-none border focus:border-[#1A237E]"
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                </div>
                <button 
                  onClick={handleNext}
                  disabled={!formData.name || !formData.phone || !formData.address}
                  className="w-full py-5 bg-[#1A237E] text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50"
                >
                  পরবর্তী ধাপ <ChevronRight />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <h3 className="text-2xl font-bold flex items-center gap-3 mb-8">
                  <CreditCard className="text-[#1A237E] dark:text-[#FFD600]" /> পেমেন্ট মেথড
                </h3>
                <div className="grid gap-4">
                  <div 
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-6 border-2 rounded-2xl flex items-center gap-6 cursor-pointer transition-all ${
                      paymentMethod === 'COD' ? 'border-[#1A237E] bg-blue-50 dark:bg-slate-800' : 'border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600"><ShoppingBag /></div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-800 dark:text-white text-lg">ক্যাশ অন ডেলিভারি</p>
                      <p className="text-sm text-slate-500">পণ্য হাতে পেয়ে টাকা পরিশোধ করুন</p>
                    </div>
                    {paymentMethod === 'COD' && <CheckCircle className="text-[#1A237E] dark:text-[#FFD600]" />}
                  </div>

                  <div 
                    onClick={() => setPaymentMethod('bKash')}
                    className={`p-6 border-2 rounded-2xl flex items-center gap-6 cursor-pointer transition-all ${
                      paymentMethod === 'bKash' ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/10' : 'border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center font-black text-pink-600">b</div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-800 dark:text-white text-lg">বিকাশ পেমেন্ট</p>
                      <p className="text-sm text-slate-500">দ্রুত ও নিরাপদ ডিজিটাল পেমেন্ট</p>
                    </div>
                    {paymentMethod === 'bKash' && <CheckCircle className="text-pink-600" />}
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button onClick={handlePrev} className="flex-1 py-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-white font-bold rounded-2xl">আগের ধাপ</button>
                  <button onClick={handleNext} className="flex-1 py-5 bg-[#1A237E] text-white font-black rounded-2xl shadow-xl">শেষ ধাপ</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <h3 className="text-2xl font-bold flex items-center gap-3 mb-8">
                  <Wallet className="text-[#1A237E] dark:text-[#FFD600]" /> অর্ডার কনফার্ম করুন
                </h3>
                <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
                  <div className="flex justify-between border-b pb-4 dark:border-slate-700">
                    <span className="text-slate-500">শিপিং নাম:</span>
                    <span className="font-bold dark:text-white">{formData.name}</span>
                  </div>
                  <div className="flex justify-between border-b pb-4 dark:border-slate-700">
                    <span className="text-slate-500">ফোন:</span>
                    <span className="font-bold dark:text-white">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between border-b pb-4 dark:border-slate-700">
                    <span className="text-slate-500">পেমেন্ট মেথড:</span>
                    <span className="font-black text-[#1A237E] dark:text-[#FFD600]">{paymentMethod === 'COD' ? 'Cash on Delivery' : 'Digital Payment'}</span>
                  </div>
                </div>

                <button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="w-full py-6 bg-[#1A237E] text-[#FFD600] font-black rounded-2xl shadow-2xl hover:scale-[1.01] transition-all text-xl flex items-center justify-center"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'অর্ডার প্লেস করুন'}
                </button>
                <button onClick={handlePrev} className="w-full py-3 text-slate-400 font-bold hover:text-slate-600">পরিবর্তন করতে ফিরে যান</button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl h-fit">
            <h4 className="text-xl font-bold mb-8">অর্ডার সামারি</h4>
            <div className="space-y-4 mb-8">
              {items.map(item => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-slate-500 line-clamp-1 flex-1 pr-4">{item.product.name} × {item.quantity}</span>
                  <span className="font-bold dark:text-white">৳{(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="space-y-4 pt-8 border-t dark:border-slate-800">
              <div className="flex justify-between text-slate-500">
                <span>সাব-টোটাল</span>
                <span>৳{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>শিপিং চার্জ</span>
                <span>৳{deliveryCharge}</span>
              </div>
              <div className="flex justify-between text-2xl font-black text-[#1A237E] dark:text-[#FFD600] pt-4">
                <span>মোট</span>
                <span>৳{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
