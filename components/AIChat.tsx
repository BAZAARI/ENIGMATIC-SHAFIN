
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Lock, ChevronRight, X, Circle, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface AIChatProps {
  onNavigateToAdmin?: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ onNavigateToAdmin }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string, showAdminLink?: boolean}[]>([
    { role: 'bot', text: 'আসসালামু আলাইকুম! আমি Bazaari Intelligence AI। আপনাকে কীভাবে সাহায্য করতে পারি?' }
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
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      // Create a fresh instance for each request as per best practices
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: userMsg }] }],
        config: {
          systemInstruction: "You are the official AI assistant of Bazaari, a premium multi-vendor lifestyle marketplace in Bangladesh. Your tone is professional, sophisticated, and helpful. Answer in Bengali (Bangla). If users ask about admin access, guiding them to the 'Admin Portal' is correct. Avoid technical jargon. Keep responses under 100 words unless necessary.",
          temperature: 0.8,
        },
      });
      
      const botText = response.text || 'দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না। আবার চেষ্টা করুন।';
      const showAdminLink = /admin|অ্যাডমিন|লগইন|login|portal/i.test(userMsg + botText);

      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: botText,
        showAdminLink: showAdminLink
      }]);
    } catch (error) {
      console.error("Bazaari AI Network Error:", error);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: 'সিস্টেমে সাময়িক ত্রুটি দেখা দিয়েছে। আপনার ইন্টারনেট চেক করে পুনরায় মেসেজ পাঠান।' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 h-[600px] flex flex-col animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-800 rounded-[40px] shadow-2xl flex-1 flex flex-col overflow-hidden border border-slate-100 dark:border-slate-700 relative">
        
        {/* AI Chat Header */}
        <div className="p-6 bg-[#1A237E] text-white flex items-center justify-between shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse pointer-events-none"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="relative flex items-center justify-center scale-90">
              <div className="bg-white/10 w-12 h-12 rounded-xl rotate-3 absolute"></div>
              <div className="bg-[#FFD600] w-12 h-12 rounded-xl -rotate-3 border-2 border-[#1A237E] flex items-center justify-center relative z-10 shadow-lg">
                <span className="text-[#1A237E] font-black text-2xl italic">B</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-black uppercase tracking-tighter italic leading-none">Bazaari Intelligence</h3>
              <div className="flex items-center gap-1.5 text-[9px] text-green-400 font-black uppercase tracking-widest mt-1.5">
                <Circle className="w-2 h-2 fill-green-400 animate-pulse" /> 
                <span>AI Core Active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-10">
             <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 backdrop-blur-sm">
               <Sparkles className="w-5 h-5 text-[#FFD600]" />
             </div>
          </div>
        </div>

        {/* Messages Container */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50/50 dark:bg-slate-950/40">
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2`}>
              <div className={`max-w-[85%] p-5 rounded-3xl flex gap-3 shadow-sm transition-all hover:scale-[1.01] ${
                m.role === 'user' 
                  ? 'bg-[#1A237E] text-white rounded-br-none border border-white/5 shadow-blue-900/20' 
                  : 'bg-white dark:bg-slate-700 dark:text-white rounded-bl-none border border-slate-100 dark:border-slate-600'
              }`}>
                {m.role === 'bot' && <div className="p-1 bg-blue-50 dark:bg-slate-800 rounded-lg shrink-0 h-fit"><Bot className="w-5 h-5 text-[#1A237E] dark:text-[#FFD600]" /></div>}
                <p className="text-sm leading-relaxed font-medium">{m.text}</p>
              </div>
              
              {m.showAdminLink && onNavigateToAdmin && (
                <button 
                  onClick={onNavigateToAdmin}
                  className="mt-4 flex items-center gap-3 px-8 py-4 bg-[#FFD600] text-[#1A237E] font-black rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all text-sm uppercase italic tracking-tighter border-2 border-[#1A237E] group"
                >
                  <Lock className="w-4 h-4 group-hover:rotate-12 transition-transform" /> 
                  <span>Admin Portal-এ যান</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl flex items-center gap-3 shadow-md border border-slate-100 dark:border-slate-700">
                <Loader2 className="w-5 h-5 animate-spin text-[#1A237E] dark:text-[#FFD600]" />
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest italic animate-pulse">Bazaari thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900">
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="আপনার প্রশ্ন এখানে লিখুন..." 
              className="flex-1 px-6 py-5 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-[2rem] outline-none border-2 border-transparent focus:border-[#1A237E] transition-all font-bold placeholder:text-slate-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className="p-5 bg-[#1A237E] text-[#FFD600] rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-50 group"
            >
              <Send className="w-7 h-7 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
