
import React, { useState } from 'react';
import { Package, Truck, CheckCircle2, Search } from 'lucide-react';
import { Language } from '../types';

interface TrackOrderProps {
  language: Language;
}

const TrackOrder: React.FC<TrackOrderProps> = ({ language }) => {
  const [orderId, setOrderId] = useState('');
  const [isTracked, setIsTracked] = useState(false);

  const t = {
    title: language === 'bn' ? 'আপনার অর্ডার ট্র্যাক করুন' : 'Track Your Order',
    desc: language === 'bn' ? 'অর্ডার আইডি দিয়ে আপনার পার্সেলটির বর্তমান অবস্থা জানুন' : 'Check your parcel status using your order ID',
    placeholder: language === 'bn' ? 'অর্ডার আইডি (যেমন: BZ-98765)' : 'Order ID (e.g., BZ-98765)',
    btn: language === 'bn' ? 'ট্র্যাক' : 'Track',
    statusTitle: language === 'bn' ? 'বর্তমান অবস্থা' : 'Current Status',
    statusVal: language === 'bn' ? 'পথে আছে (On the way)' : 'On the way',
    estDelivery: language === 'bn' ? 'সম্ভাব্য ডেলিভারি' : 'Est. Delivery',
    step1: language === 'bn' ? 'অর্ডার কনফার্ম' : 'Order Confirmed',
    step2: language === 'bn' ? 'প্রসেসিং' : 'Processing',
    step3: language === 'bn' ? 'শিফট' : 'Shipped',
    step4: language === 'bn' ? 'ডেলিভারি' : 'Delivery',
    activeStep: language === 'bn' ? 'সক্রিয়' : 'Active',
    pendingStep: language === 'bn' ? 'সম্ভাব্য: ১৭ মার্চ' : 'Exp: March 17'
  };

  const steps = [
    { label: t.step1, status: 'completed', date: language === 'bn' ? '১২ মার্চ, ২০২৬' : 'Mar 12, 2026' },
    { label: t.step2, status: 'completed', date: language === 'bn' ? '১৩ মার্চ, ২০২৬' : 'Mar 13, 2026' },
    { label: t.step3, status: 'active', date: language === 'bn' ? '১৫ মার্চ, ২০২৬' : 'Mar 15, 2026' },
    { label: t.step4, status: 'pending', date: t.pendingStep }
  ];

  return (
    <div className="py-20 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#1A237E] dark:text-white mb-4">{t.title}</h2>
            <p className="text-slate-500 dark:text-slate-400">{t.desc}</p>
          </div>

          <div className="relative mb-12">
            <input 
              type="text" 
              placeholder={t.placeholder}
              className="w-full px-6 py-5 bg-slate-100 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-[#1A237E] focus:bg-white dark:focus:bg-slate-800 rounded-2xl outline-none transition-all text-lg font-mono"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
            <button 
              onClick={() => setIsTracked(true)}
              className="absolute right-3 top-3 bottom-3 px-8 bg-[#1A237E] text-[#FFD600] font-bold rounded-xl hover:bg-opacity-90 transition-all flex items-center"
            >
              <Search className="w-5 h-5 mr-2" /> {t.btn}
            </button>
          </div>

          {isTracked && (
            <div className="space-y-12 animate-in slide-in-from-bottom-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-1 uppercase tracking-wider">{t.statusTitle}</p>
                  <h4 className="text-2xl font-bold text-[#1A237E] dark:text-white">{t.statusVal}</h4>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{t.estDelivery}</p>
                  <p className="font-bold text-[#1A237E] dark:text-[#FFD600]">{language === 'bn' ? '১৭ মার্চ, ২০২৬' : 'Mar 17, 2026'}</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-1 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                <div className="space-y-10">
                  {steps.map((step, idx) => (
                    <div key={idx} className="relative flex items-center">
                      <div className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                        step.status === 'completed' ? 'bg-[#1A237E]' : 
                        step.status === 'active' ? 'bg-[#FFD600] border-4 border-white dark:border-slate-900' : 'bg-slate-200 dark:bg-slate-800'
                      }`}>
                        {step.status === 'completed' ? <CheckCircle2 className="text-white w-6 h-6" /> : 
                         step.status === 'active' ? <Truck className="text-[#1A237E] w-6 h-6" /> : 
                         <Package className="text-slate-400 dark:text-slate-600 w-6 h-6" />}
                      </div>
                      <div className="ml-20">
                        <h5 className={`font-bold ${step.status === 'pending' ? 'text-slate-400 dark:text-slate-600' : 'text-[#1A237E] dark:text-white'}`}>
                          {step.label}
                        </h5>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
