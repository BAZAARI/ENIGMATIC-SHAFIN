
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'আসসালামু আলাইকুম! আমি Bazaari AI। আপনাকে কীভাবে সাহায্য করতে পারি?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: "You are a helpful customer support AI for Bazaari, a premium lifestyle marketplace in Bangladesh. Answer in Bengali. Keep answers concise and professional."
        }
      });
      setMessages(prev => [...prev, { role: 'bot', text: response.text || 'দুঃখিত, আমি বুঝতে পারিনি।' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'সার্ভারে সমস্যা হচ্ছে, অনুগ্রহ করে কিছুক্ষণ পর চেষ্টা করুন।' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 h-[600px] flex flex-col">
      <div className="bg-white dark:bg-slate-800 rounded-[40px] shadow-2xl flex-1 flex flex-col overflow-hidden border border-slate-100 dark:border-slate-700">
        <div className="p-6 bg-[#1A237E] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#FFD600] p-2 rounded-xl">
              <Sparkles className="w-5 h-5 text-[#1A237E]" />
            </div>
            <div>
              <h3 className="font-bold">Bazaari Smart AI</h3>
              <p className="text-[10px] text-blue-200 uppercase tracking-widest">২৪/৭ অনলাইন সহায়তা</p>
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl flex gap-3 ${
                m.role === 'user' ? 'bg-[#1A237E] text-white rounded-br-none' : 'bg-slate-100 dark:bg-slate-700 dark:text-white rounded-bl-none'
              }`}>
                {m.role === 'bot' && <Bot className="w-5 h-5 shrink-0 mt-1" />}
                <p className="text-sm leading-relaxed">{m.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-2xl flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs">এআই লিখছে...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="যেকোনো কিছু জিজ্ঞাসা করুন..." 
              className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-900 dark:text-white rounded-full outline-none focus:ring-2 focus:ring-[#1A237E]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              className="p-3 bg-[#1A237E] text-[#FFD600] rounded-full hover:scale-105 transition-all shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
