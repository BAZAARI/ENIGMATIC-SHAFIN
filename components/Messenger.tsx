
import React, { useState } from 'react';
import { Send, Phone, Video, MoreVertical, Circle } from 'lucide-react';
import { Message } from '../types';

const Messenger: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'Rahim', text: 'আসসালামু আলাইকুম, পাঞ্জাবিটা কি স্টকে আছে?', time: '10:30 AM', isMe: false },
    { id: 2, sender: 'Me', text: 'ওয়ালাইকুম আসসালাম। জ্বী স্যার, সব সাইজ স্টকে আছে।', time: '10:32 AM', isMe: true },
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
      <div className="w-1/3 bg-white border border-slate-200 rounded-3xl overflow-hidden hidden md:block">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-[#1A237E]">মেসেজ</h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl cursor-pointer">
            <div className="relative">
              <img src="https://i.pravatar.cc/150?u=rahim" className="w-12 h-12 rounded-full" alt="" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h4 className="font-bold text-[#1A237E]">Rahim Ahmed</h4>
              <p className="text-xs text-slate-500">অনলাইনে আছে</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white border border-slate-200 rounded-3xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-4">
            <img src="https://i.pravatar.cc/150?u=rahim" className="w-10 h-10 rounded-full" alt="" />
            <div>
              <h3 className="font-bold text-[#1A237E]">Rahim Ahmed</h3>
              <div className="flex items-center text-[10px] text-green-500 font-bold uppercase tracking-wider">
                <Circle className="w-2 h-2 fill-green-500 mr-1" /> Online
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
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${
                m.isMe ? 'bg-[#1A237E] text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none'
              }`}>
                <p>{m.text}</p>
                <p className={`text-[10px] mt-1 ${m.isMe ? 'text-blue-200' : 'text-slate-400'}`}>{m.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="আপনার মেসেজ লিখুন..." 
              className="flex-1 px-6 py-3 bg-slate-100 border-none rounded-full focus:ring-2 focus:ring-[#1A237E]"
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
