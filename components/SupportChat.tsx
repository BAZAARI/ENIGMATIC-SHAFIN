
import React, { useState, useRef, useEffect } from 'react';
// Added MessageSquare to the import list
import { Send, X, Headset, Circle, MessageSquare } from 'lucide-react';
import { SupportMessage } from '../types';

interface SupportChatProps {
  messages: SupportMessage[];
  onSend: (text: string) => void;
  onClose: () => void;
}

const SupportChat: React.FC<SupportChatProps> = ({ messages, onSend, onClose }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl h-[700px] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className="p-8 bg-[#1A237E] text-white flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-[#FFD600] p-3 rounded-2xl"><Headset className="text-[#1A237E] w-6 h-6" /></div>
            <div>
              <h3 className="text-xl font-black">লাইভ সাপোর্ট</h3>
              <div className="flex items-center gap-1.5 text-[10px] text-green-400 font-bold uppercase tracking-widest mt-1">
                <Circle className="w-2 h-2 fill-green-400" /> Admin is Online
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all"><X className="w-8 h-8" /></button>
        </div>

        {/* Chat Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-4 bg-slate-50 dark:bg-slate-950/50">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
               <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-10 h-10 text-[#1A237E] dark:text-[#FFD600]" />
               </div>
               <p className="text-slate-500 max-w-xs">অ্যাডমিনকে যেকোনো প্রশ্ন করুন। আমরা খুব দ্রুত আপনার উত্তর দিব।</p>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.isAdmin ? 'justify-start' : 'justify-end'}`}>
              <div className={`p-4 rounded-2xl max-w-[80%] shadow-sm ${
                m.isAdmin 
                  ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-bl-none' 
                  : 'bg-[#1A237E] text-white rounded-br-none'
              }`}>
                <p className="text-sm leading-relaxed">{m.text}</p>
                <p className={`text-[8px] mt-1 font-bold ${m.isAdmin ? 'text-slate-400' : 'text-blue-300'}`}>{m.timestamp}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="আপনার মেসেজ এখানে লিখুন..." 
              className="flex-1 px-6 py-4 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl outline-none focus:ring-2 focus:ring-[#1A237E] transition-all"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              className="px-8 bg-[#1A237E] text-[#FFD600] font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-2"
            >
              <Send className="w-5 h-5" /> পাঠান
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportChat;
