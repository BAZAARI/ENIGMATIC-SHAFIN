
import React, { useState } from 'react';
import { Send, Phone, Video, MoreVertical, Circle } from 'lucide-react';
import { Message, Language } from '../types';

interface MessengerProps {
  language: Language;
}

const Messenger: React.FC<MessengerProps> = ({ language }) => {
  const t = {
    title: language === 'bn' ? 'মেসেজ' : 'Messages',
    online: language === 'bn' ? 'অনলাইনে আছে' : 'Online',
    placeholder: language === 'bn' ? 'আপনার মেসেজ লিখুন...' : 'Write your message...',
    msg1: language === 'bn' ? 'আসসালামু আলাইকুম, পাঞ্জাবিটা কি স্টকে আছে?' : 'As-salamu alaykum, is the Panjabi in stock?',
    msg2: language === 'bn' ? 'ওয়ালাইকুম আসসালাম। জ্বী স্যার, সব সাইজ স্টকে আছে।' : 'Wa alaykum as-salam. Yes sir, all sizes are in stock.',
  };

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'Rahim', text: t.msg1, time: '10:30 AM', isMe: false },
    { id: 2, sender: 'Me', text: t.msg2, time: '10:32 AM', isMe: true },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage = { id: Date.now(), sender: 'Me', text: input, time: 'Now', isMe: true };
    setMessages([...messages, newMessage]);
    setInput('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 h-[700px] flex gap-4">
      {/* Sidebar */}
      <div className="w-1/3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hidden md:block">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-[#1A237E] dark:text-white">{t.title}</h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-slate-800 rounded-2xl cursor-pointer">
            <div className="relative">
              <img src="https://i.pravatar.cc/150?u=rahim" className="w-12 h-12 rounded-full" alt="" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
            </div>
            <div>
              <h4 className="font-bold text-[#1A237E] dark:text-white">Rahim Ahmed</h4>
              <p className="text-xs text-slate-500">{t.online}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
          <div className="flex items-center gap-4">
            <img src="https://i.pravatar.cc/150?u=rahim" className="w-10 h-10 rounded-full" alt="" />
            <div>
              <h3 className="font-bold text-[#1A237E] dark:text-white">Rahim Ahmed</h3>
              <div className="flex items-center text-[10px] text-green-500 font-bold uppercase tracking-wider">
                <Circle className="w-2 h-2 fill-green-500 mr-1" /> {t.online}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button className="hover:text-[#1A237E]"><Phone className="w-5 h-5" /></button>
            <button className="hover:text-[#1A237E]"><Video className="w-5 h-5" /></button>
            <button className="hover:text-[#1A237E]"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${
                m.isMe ? 'bg-[#1A237E] text-white rounded-br-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-bl-none'
              }`}>
                <p>{m.text}</p>
                <p className={`text-[10px] mt-1 ${m.isMe ? 'text-blue-200' : 'text-slate-400'}`}>{m.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder={t.placeholder} 
              className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 dark:text-white border-none rounded-full focus:ring-2 focus:ring-[#1A237E] outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button 
              onClick={sendMessage}
              className="p-3 bg-[#1A237E] text-white rounded-full hover:bg-opacity-90 transition-all shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messenger;
