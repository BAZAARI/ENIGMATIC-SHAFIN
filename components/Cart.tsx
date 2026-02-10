
import React from 'react';
import { CartItem, Page } from '../types';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';

interface CartProps {
  items: CartItem[];
  setItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setCurrentPage: (p: Page) => void;
}

const Cart: React.FC<CartProps> = ({ items, setItems, setCurrentPage }) => {
  const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const updateQty = (id: number, delta: number) => {
    setItems(prev => prev.map(item => 
      item.product.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const remove = (id: number) => {
    setItems(prev => prev.filter(item => item.product.id !== id));
  };

  if (items.length === 0) {
    return (
      <div className="py-32 text-center">
        <ShoppingBag className="w-20 h-20 text-slate-200 mx-auto mb-6" />
        <h2 className="text-3xl font-bold mb-4 dark:text-white">আপনার কার্ট খালি!</h2>
        <button onClick={() => setCurrentPage(Page.Shop)} className="px-8 py-3 bg-[#1A237E] text-white rounded-full font-bold">শপিং করুন</button>
      </div>
    );
  }

  return (
    <div className="py-20 max-w-5xl mx-auto px-4 dark:text-white transition-colors">
      <h2 className="text-4xl font-black text-[#1A237E] dark:text-white mb-12">শপিং কার্ট ({items.length})</h2>
      
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.map(item => (
            <div key={item.product.id} className="flex gap-6 p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 items-center">
              <img src={item.product.image} className="w-24 h-24 rounded-2xl object-cover" />
              <div className="flex-1">
                <h4 className="font-bold text-lg">{item.product.name}</h4>
                <p className="text-[#1A237E] dark:text-[#FFD600] font-bold">৳{item.product.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 p-2 rounded-xl">
                <button onClick={() => updateQty(item.product.id, -1)} className="p-1 hover:text-[#1A237E]"><Minus className="w-4 h-4" /></button>
                <span className="font-bold w-6 text-center">{item.quantity}</span>
                <button onClick={() => updateQty(item.product.id, 1)} className="p-1 hover:text-[#1A237E]"><Plus className="w-4 h-4" /></button>
              </div>
              <button onClick={() => remove(item.product.id)} className="text-red-400 hover:text-red-600 transition-colors">
                <Trash2 className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] shadow-xl border border-slate-100 dark:border-slate-700 h-fit space-y-8">
          <h4 className="text-xl font-bold">অর্ডার সামারি</h4>
          <div className="space-y-4 pb-6 border-b dark:border-slate-700">
            <div className="flex justify-between text-slate-500"><span>সাব-টোটাল</span><span>৳{total.toLocaleString()}</span></div>
            <div className="flex justify-between text-slate-500"><span>শিপিং চার্জ</span><span>৳৬০</span></div>
          </div>
          <div className="flex justify-between text-2xl font-black text-[#1A237E] dark:text-[#FFD600]">
            <span>মোট</span>
            <span>৳{(total + 60).toLocaleString()}</span>
          </div>
          <button className="w-full py-5 bg-[#1A237E] text-[#FFD600] font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2 hover:bg-opacity-95">
            চেকআউট করুন <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
