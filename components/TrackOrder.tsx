
import React, { useState } from 'react';
import { Package, Truck, CheckCircle2, Search } from 'lucide-react';

const TrackOrder: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [isTracked, setIsTracked] = useState(false);

  const steps = [
    { label: 'অর্ডার কনফার্ম', status: 'completed', date: '১২ মার্চ, ২০২৪' },
    { label: 'প্রসেসিং', status: 'completed', date: '১৩ মার্চ, ২০২৪' },
    { label: 'শিফট', status: 'active', date: '১৫ মার্চ, ২০২৪' },
    { label: 'ডেলিভারি', status: 'pending', date: 'সম্ভাব্য: ১৭ মার্চ' }
  ];

  return (
    <div className="py-20 min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#1A237E] mb-4">আপনার অর্ডার ট্র্যাক করুন</h2>
            <p className="text-slate-500">অর্ডার আইডি দিয়ে আপনার পার্সেলটির বর্তমান অবস্থা জানুন</p>
          </div>

          <div className="relative mb-12">
            <input 
              type="text" 
              placeholder="অর্ডার আইডি (যেমন: BZ-98765)"
              className="w-full px-6 py-5 bg-slate-100 border-2 border-transparent focus:border-[#1A237E] focus:bg-white rounded-2xl outline-none transition-all text-lg font-mono"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
            <button 
              onClick={() => setIsTracked(true)}
              className="absolute right-3 top-3 bottom-3 px-8 bg-[#1A237E] text-[#FFD600] font-bold rounded-xl hover:bg-opacity-90 transition-all flex items-center"
            >
              <Search className="w-5 h-5 mr-2" /> ট্র্যাক
            </button>
          </div>

          {isTracked && (
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <div>
                  <p className="text-sm text-blue-600 font-semibold mb-1 uppercase tracking-wider">বর্তমান অবস্থা</p>
                  <h4 className="text-2xl font-bold text-[#1A237E]">পথে আছে (On the way)</h4>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <p className="text-slate-500 text-sm">সম্ভাব্য ডেলিভারি</p>
                  <p className="font-bold text-[#1A237E]">১৭ মার্চ, ২০২৪</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-1 bg-slate-100 rounded-full"></div>
                <div className="space-y-10">
                  {steps.map((step, idx) => (
                    <div key={idx} className="relative flex items-center">
                      <div className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                        step.status === 'completed' ? 'bg-[#1A237E]' : 
                        step.status === 'active' ? 'bg-[#FFD600] border-4 border-white' : 'bg-slate-200'
                      }`}>
                        {step.status === 'completed' ? <CheckCircle2 className="text-white w-6 h-6" /> : 
                         step.status === 'active' ? <Truck className="text-[#1A237E] w-6 h-6" /> : 
                         <Package className="text-slate-400 w-6 h-6" />}
                      </div>
                      <div className="ml-20">
                        <h5 className={`font-bold ${step.status === 'pending' ? 'text-slate-400' : 'text-[#1A237E]'}`}>
                          {step.label}
                        </h5>
                        <p className="text-sm text-slate-500">{step.date}</p>
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
