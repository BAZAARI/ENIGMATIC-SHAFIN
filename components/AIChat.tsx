
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Lock, ChevronRight, X } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface AIChatProps {
  onNavigateToAdmin?: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ onNavigateToAdmin }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string, showAdminLink?: boolean}[]>([
    { role: 'bot', text: 'আসসালামু আলাইকুম! আমি Bazaari AI। আপনাকে কীভাবে সাহায্য করতে পারি?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
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
          systemInstruction: `You are a helpful customer support AI for Bazaari, a premium lifestyle marketplace in Bangladesh. 
          Answer in Bengali (Bangla). Keep answers concise, premium, and professional.
          If the user asks about the Admin Panel or Login, guide them to the Admin Portal link. 
          The website URL is not needed, just talk about the platform features like buy, sell, and verify.`,
          temperature: 0.7,
        }
      });
      
      const botText = response.text || 'দুঃখিত, আমি এই মুহূর্তে রেসপন্স করতে পারছি না।';
      const showAdminLink = /admin|অ্যাডমিন|লগইন|login/i.test(userMsg) || /portal|প্যানেল/i.test(botText);

      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: botText,
        showAdminLink: showAdminLink
      }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: 'দুঃখিত, কানেকশনে সমস্যা হচ্ছে। অনুগ্রহ করে আপনার ইন্টারনেট চেক করুন বা কিছুক্ষণ পর চেষ্টা করুন।' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 h-[600px] flex flex-col animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-800 rounded-[40px] shadow-2xl flex-1 flex flex-col overflow-hidden border border-slate-100 dark:border-slate-700 relative">
        <div className="p-6 bg-[#1A237E] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#FFD600] p-2 rounded-xl">
              <Sparkles className="w-5 h-5 text-[#1A237E]" />
            </div>
            <div>
              <h3 className="font-black uppercase tracking-tighter italic">Bazaari Intelligence</h3>
              <p className="text-[10px] text-blue-200 uppercase tracking-widest font-black">Powered by Gemini</p>
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50">
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2`}>
              <div className={`max-w-[85%] p-4 rounded-2xl flex gap-3 shadow-md ${
                m.role === 'user' ? 'bg-[#1A237E] text-white rounded-br-none' : 'bg-white dark:bg-slate-700 dark:text-white rounded-bl-none'
              }`}>
                {m.role === 'bot' && <Bot className="w-5 h-5 shrink-0 mt-1 text-[#FFD600]" />}
                <p className="text-sm leading-relaxed font-medium">{m.text}</p>
              </div>
              
              {m.showAdminLink && onNavigateToAdmin && (
                <button 
                  onClick={onNavigateToAdmin}
                  className="mt-3 flex items-center gap-2 px-6 py-3 bg-[#FFD600] text-[#1A237E] font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all text-xs uppercase italic tracking-tighter border-2 border-[#1A237E]"
                >
                  <Lock className="w-4 h-4" /> 
                  <span>Admin Portal-এ যান</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-700 p-4 rounded-2xl flex items-center gap-2 shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin text-[#1A237E]" />
                <span className="text-xs font-bold text-slate-500 italic">Bazaari thinking...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="যেকোনো প্রশ্ন করুন..." 
              className="flex-1 px-6 py-4 bg-slate-100 dark:bg-slate-900 dark:text-white rounded-2xl outline-none focus:ring-2 focus:ring-[#1A237E] transition-all font-medium"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className="p-4 bg-[#1A237E] text-[#FFD600] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
