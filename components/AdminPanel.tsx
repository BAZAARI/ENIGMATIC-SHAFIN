
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Package, Users, Settings, LogOut, Plus, TrendingUp, ShoppingBag, Edit, Trash2, Lock, Rocket, 
  ExternalLink, Check, X as CloseIcon, ShieldAlert, ClipboardList, CheckCircle2, Bell, MessageSquare, DollarSign, Wrench, AlertCircle, ShieldCheck, Eye, ImageIcon
} from 'lucide-react';
import { PRODUCTS, BOOST_PLANS, VERIFY_PLANS } from '../constants';
import { BoostRequest, PostRequest, VerificationRequest, SupportMessage, AdminSettings } from '../types';

interface AdminPanelProps {
  onClose: () => void;
  boostRequests: BoostRequest[];
  postRequests: PostRequest[];
  verificationRequests: VerificationRequest[];
  supportMessages: SupportMessage[];
  settings: AdminSettings;
  adminEmails: string[];
  onUpdateSettings: (s: AdminSettings) => void;
  onAddAdminEmail: (email: string) => void;
  onUpdateBoost: (id: string, status: 'approved' | 'rejected') => void;
  onUpdatePost: (id: string, status: 'approved' | 'rejected') => void;
  onUpdateVerification: (id: string, status: 'approved' | 'rejected') => void;
  onAdminReply: (email: string, text: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  onClose, boostRequests, postRequests, verificationRequests, supportMessages, settings, adminEmails,
  onUpdateSettings, onAddAdminEmail, onUpdateBoost, onUpdatePost, onUpdateVerification, onAdminReply
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'posts' | 'boost' | 'verify' | 'support' | 'settings' | 'admins'>('dashboard');
  const [replyText, setReplyText] = useState('');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [showImageModal, setShowImageModal] = useState<string | null>(null);

  // Notifications logic
  const pendingPosts = postRequests.filter(r => r.status === 'pending').length;
  const pendingBoosts = boostRequests.filter(r => r.status === 'pending').length;
  const pendingVerifies = verificationRequests.filter(r => r.status === 'pending').length;
  const unreadMessages = supportMessages.filter(m => !m.isAdmin && !m.isRead).length;
  
  const totalPending = pendingPosts + pendingBoosts + pendingVerifies;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = loginEmail.toLowerCase().trim();
    if (adminEmails.includes(normalizedEmail) && password === 'SHAFIN@1a') {
      setIsAuthenticated(true);
    } else {
      alert('ভুল ইমেইল অথবা পাসওয়ার্ড!');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#0F172A] flex items-center justify-center">
        <div className="bg-slate-900 border border-white/5 p-12 rounded-[3rem] w-full max-w-md shadow-2xl text-center">
          <div className="w-20 h-20 bg-[#FFD600] rounded-3xl flex items-center justify-center mx-auto mb-6"><Lock className="text-[#1A237E] w-10 h-10" /></div>
          <h2 className="text-3xl font-black text-white mb-8">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="email" 
              placeholder="অ্যাডমিন ইমেইল" 
              className="w-full px-6 py-4 bg-slate-800 border-none rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#FFD600]" 
              value={loginEmail} 
              onChange={e => setLoginEmail(e.target.value)} 
              required
            />
            <input 
              type="password" 
              placeholder="সিক্রেট পাসওয়ার্ড" 
              className="w-full px-6 py-4 bg-slate-800 border-none rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#FFD600]" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required
            />
            <button className="w-full py-4 bg-[#FFD600] text-[#1A237E] font-black rounded-2xl shadow-xl">অ্যাক্সেস করুন</button>
          </form>
          <button onClick={onClose} className="mt-8 text-slate-500 hover:text-white text-sm font-bold">ফিরে যান</button>
        </div>
      </div>
    );
  }

  const uniqueUsers = Array.from(new Set(supportMessages.map(m => m.userEmail)));

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 border-r border-white/5 flex flex-col p-8 fixed h-full z-50">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-[#FFD600] p-2 rounded-xl"><ShoppingBag className="text-[#1A237E] w-5 h-5" /></div>
          <span className="text-xl font-black text-white">Admin Bazaari</span>
        </div>

        <nav className="space-y-2 flex-grow">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'dashboard' ? 'bg-[#1A237E] text-white' : 'text-slate-400 hover:bg-white/5'}`}>
            <LayoutDashboard className="w-5 h-5" /> ড্যাশবোর্ড
          </button>
          
          <button onClick={() => setActiveTab('posts')} className={`relative w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'posts' ? 'bg-[#1A237E] text-white' : 'text-slate-400 hover:bg-white/5'}`}>
            <ClipboardList className="w-5 h-5" /> পোস্ট 
            {pendingPosts > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">{pendingPosts}</span>}
          </button>
          
          <button onClick={() => setActiveTab('boost')} className={`relative w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'boost' ? 'bg-[#1A237E] text-white' : 'text-slate-400 hover:bg-white/5'}`}>
            <Rocket className="w-5 h-5" /> বুস্ট
            {pendingBoosts > 0 && <span className="ml-auto bg-yellow-500 text-[#1A237E] text-[10px] px-2 py-0.5 rounded-full">{pendingBoosts}</span>}
          </button>
          
          <button onClick={() => setActiveTab('support')} className={`relative w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'support' ? 'bg-[#1A237E] text-white' : 'text-slate-400 hover:bg-white/5'}`}>
            <MessageSquare className="w-5 h-5" /> সাপোর্ট চ্যাট
            {unreadMessages > 0 && <span className="ml-auto bg-purple-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-bounce">{unreadMessages}</span>}
          </button>

          <button onClick={() => setActiveTab('admins')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'admins' ? 'bg-[#1A237E] text-white' : 'text-slate-400 hover:bg-white/5'}`}>
            <ShieldCheck className="w-5 h-5" /> অ্যাডমিন লিস্ট
          </button>
          
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'settings' ? 'bg-[#1A237E] text-white' : 'text-slate-400 hover:bg-white/5'}`}>
            <Settings className="w-5 h-5" /> সেটিংস
          </button>
        </nav>

        <button onClick={onClose} className="mt-auto flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-400 hover:bg-red-500/10 transition-all"><LogOut className="w-5 h-5" /> লগআউট</button>
      </aside>

      {/* Content */}
      <main className="flex-1 ml-72 p-12">
        <header className="flex justify-between items-center mb-12">
          <div><h1 className="text-4xl font-black text-white capitalize">{activeTab === 'admins' ? 'অ্যাডমিন লিস্ট' : activeTab}</h1><p className="text-slate-500">আপনার মার্কেটপ্লেস পরিচালনা করুন।</p></div>
          <div className="flex items-center gap-6">
             {totalPending > 0 && (
               <div className="flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-xl border border-red-500/20 animate-pulse">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs font-bold">{totalPending} টি নতুন রিকোয়েস্ট আছে</span>
               </div>
             )}
             <div className="relative"><Bell className="w-8 h-8 text-slate-400" />{totalPending > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-black animate-bounce">{totalPending}</span>}</div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="bg-slate-900/50 p-8 rounded-[3rem] border border-white/5 text-center group hover:bg-[#1A237E]/20 transition-all cursor-pointer" onClick={() => setActiveTab('posts')}>
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">পেনডিং অ্যাড</p>
                <h2 className="text-4xl font-black text-blue-400">{pendingPosts}</h2>
              </div>
              <div className="bg-slate-900/50 p-8 rounded-[3rem] border border-white/5 text-center group hover:bg-[#1A237E]/20 transition-all cursor-pointer" onClick={() => setActiveTab('boost')}>
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">পেনডিং বুস্ট</p>
                <h2 className="text-4xl font-black text-yellow-400">{pendingBoosts}</h2>
              </div>
              <div className="bg-slate-900/50 p-8 rounded-[3rem] border border-white/5 text-center group hover:bg-[#1A237E]/20 transition-all cursor-pointer" onClick={() => setActiveTab('support')}>
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">নতুন চ্যাট</p>
                <h2 className="text-4xl font-black text-purple-400">{unreadMessages}</h2>
              </div>
              <div className="bg-slate-900/50 p-8 rounded-[3rem] border border-white/5 text-center">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">দৈনিক লিমিট</p>
                <h2 className="text-4xl font-black text-green-400">{settings.freePostLimit}</h2>
              </div>
            </div>

            <div className="bg-slate-900/50 p-10 rounded-[3rem] border border-white/5">
               <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3"><TrendingUp className="text-[#FFD600]" /> সাম্প্রতিক কার্যকলাপ</h3>
               <div className="space-y-4">
                 {postRequests.slice(0, 5).map(r => (
                   <div key={r.id} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                     <div className="flex items-center gap-4">
                       <img src={r.product.image} className="w-12 h-12 rounded-xl object-cover" />
                       <div>
                         <p className="font-bold text-white">{r.product.name}</p>
                         <p className="text-xs text-slate-500">{r.timestamp} • {r.product.vendor}</p>
                       </div>
                     </div>
                     <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                       r.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 
                       r.status === 'approved' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                     }`}>{r.status}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
           <div className="bg-slate-900/50 rounded-[3rem] border border-white/5 overflow-hidden">
             <div className="p-8 border-b border-white/5 flex justify-between items-center">
               <h3 className="text-xl font-bold">পেনডিং বিজ্ঞাপন সমূহ</h3>
               <span className="text-xs font-bold text-slate-500 uppercase">মোট পেনডিং: {pendingPosts}</span>
             </div>
             <table className="w-full text-left">
               <thead className="bg-white/5 text-xs font-bold text-slate-500 uppercase tracking-widest">
                 <tr className="border-b border-white/5">
                   <th className="p-8">পণ্য / সেলার</th>
                   <th className="p-8">পেমেন্ট উদ্দেশ্য (Reason)</th>
                   <th className="p-8">ট্রানজ্যাকশন আইডি</th>
                   <th className="p-8 text-right">অ্যাকশন</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {postRequests.filter(r => r.status === 'pending').map(r => (
                   <tr key={r.id} className="hover:bg-white/5 transition-colors">
                     <td className="p-8">
                        <div className="flex items-center gap-4">
                          <img src={r.product.image} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                          <div>
                            <p className="font-bold text-white leading-tight">{r.product.name}</p>
                            <p className="text-xs text-slate-500">বিক্রেতা: {r.product.vendor}</p>
                          </div>
                        </div>
                     </td>
                     <td className="p-8">
                       {r.isPaid ? (
                         <span className="px-3 py-1 bg-[#FFD600]/10 text-[#FFD600] rounded-lg text-[10px] font-black uppercase border border-[#FFD600]/20">
                            {r.paymentReason || "Premium Ad"}
                         </span>
                       ) : (
                         <span className="text-xs text-slate-500 font-bold uppercase">Free Post</span>
                       )}
                     </td>
                     <td className="p-8">
                        <p className="text-sm font-mono text-slate-300">{r.trxId || 'N/A'}</p>
                     </td>
                     <td className="p-8 text-right">
                       <div className="flex justify-end gap-2">
                         <button onClick={() => onUpdatePost(r.id, 'approved')} className="p-3 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all"><Check className="w-5 h-5" /></button>
                         <button onClick={() => onUpdatePost(r.id, 'rejected')} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><CloseIcon className="w-5 h-5" /></button>
                       </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
             {pendingPosts === 0 && (
               <div className="p-20 text-center text-slate-500 font-bold">কোন পেনডিং বিজ্ঞাপন নেই!</div>
             )}
           </div>
        )}

        {activeTab === 'boost' && (
           <div className="bg-slate-900/50 rounded-[3rem] border border-white/5 overflow-hidden">
             <div className="p-8 border-b border-white/5 flex justify-between items-center">
               <h3 className="text-xl font-bold">পেনডিং বুস্ট রিকোয়েস্ট</h3>
               <span className="text-xs font-bold text-slate-500 uppercase">মোট পেনডিং: {pendingBoosts}</span>
             </div>
             <table className="w-full text-left">
               <thead className="bg-white/5 text-xs font-bold text-slate-500 uppercase tracking-widest">
                 <tr className="border-b border-white/5">
                   <th className="p-8">পণ্য / ট্রানজ্যাকশন</th>
                   <th className="p-8">প্ল্যান / দিন</th>
                   <th className="p-8">স্ক্রিনশট</th>
                   <th className="p-8 text-right">অ্যাকশন</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {boostRequests.filter(r => r.status === 'pending').map(r => (
                   <tr key={r.id} className="hover:bg-white/5 transition-colors">
                     <td className="p-8">
                        <div className="flex flex-col gap-1">
                          <p className="font-bold text-white">Product ID: {r.productId}</p>
                          <p className="text-xs text-slate-500 font-mono">Trx: {r.trxId}</p>
                          <p className="text-xs text-slate-500">No: {r.senderNumber}</p>
                        </div>
                     </td>
                     <td className="p-8">
                       <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-[10px] font-black uppercase border border-blue-500/20">
                          {BOOST_PLANS.find(p => p.id === r.planId)?.days} Days
                       </span>
                     </td>
                     <td className="p-8">
                        <button onClick={() => setShowImageModal(r.screenshot)} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 text-xs">
                           <ImageIcon className="w-4 h-4" /> View SS
                        </button>
                     </td>
                     <td className="p-8 text-right">
                       <div className="flex justify-end gap-2">
                         <button onClick={() => onUpdateBoost(r.id, 'approved')} className="p-3 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all"><Check className="w-5 h-5" /></button>
                         <button onClick={() => onUpdateBoost(r.id, 'rejected')} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><CloseIcon className="w-5 h-5" /></button>
                       </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
             {pendingBoosts === 0 && (
               <div className="p-20 text-center text-slate-500 font-bold">কোন পেনডিং বুস্ট রিকোয়েস্ট নেই!</div>
             )}
           </div>
        )}

        {activeTab === 'admins' && (
          <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-slate-900/50 p-10 rounded-[3rem] border border-white/5 space-y-8">
               <h3 className="text-2xl font-black flex items-center gap-3"><Users className="text-[#FFD600]" /> অ্যাডমিন ম্যানেজমেন্ট</h3>
               
               <div className="space-y-4">
                 <label className="block text-xs font-bold text-slate-500 uppercase">নতুন অ্যাডমিন ইমেইল যোগ করুন</label>
                 <div className="flex gap-4">
                   <input 
                     type="email" 
                     placeholder="example@gmail.com" 
                     className="flex-1 px-6 py-4 bg-slate-800 rounded-2xl outline-none text-white border-2 border-transparent focus:border-[#FFD600]" 
                     value={newAdminEmail} 
                     onChange={e => setNewAdminEmail(e.target.value)}
                   />
                   <button 
                     onClick={() => {
                        if (newAdminEmail.trim() && newAdminEmail.includes('@')) {
                          onAddAdminEmail(newAdminEmail);
                          setNewAdminEmail('');
                          alert('অ্যাডমিন যোগ করা হয়েছে!');
                        } else {
                          alert('সঠিক ইমেইল দিন');
                        }
                     }}
                     className="px-8 py-4 bg-[#FFD600] text-[#1A237E] font-bold rounded-2xl"
                   >
                     যোগ করুন
                   </button>
                 </div>
                 <p className="text-[10px] text-slate-400 italic">* সকল অ্যাডমিনের পাসওয়ার্ড ডিফল্টভাবে 'SHAFIN@1a' থাকবে।</p>
               </div>

               <div className="space-y-4 pt-6 border-t border-white/5">
                 <h4 className="font-bold text-white mb-4">বর্তমান অ্যাডমিন লিস্ট</h4>
                 <div className="space-y-3">
                   {adminEmails.map(email => (
                     <div key={email} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="text-green-500 w-5 h-5" />
                          <span className="font-medium text-slate-300">{email}</span>
                        </div>
                        <span className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full uppercase font-black">Authorized</span>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="bg-slate-900/50 rounded-[3rem] border border-white/5 h-[600px] flex overflow-hidden">
            <div className="w-80 border-r border-white/5 overflow-y-auto bg-black/10">
              <div className="p-6 border-b border-white/5 font-black text-xs text-slate-500 uppercase tracking-widest">কনভারসেশন সমূহ</div>
              {uniqueUsers.map(email => {
                const unread = supportMessages.filter(m => m.userEmail === email && !m.isAdmin && !m.isRead).length;
                return (
                  <div key={email} onClick={() => setSelectedChat(email)} className={`p-6 cursor-pointer border-b border-white/5 transition-all relative ${selectedChat === email ? 'bg-[#1A237E]/40 border-l-4 border-l-[#FFD600]' : 'hover:bg-white/5'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-bold text-white truncate text-sm">{email}</p>
                      {unread > 0 && <span className="bg-[#FFD600] text-[#1A237E] text-[10px] px-2 py-0.5 rounded-full font-black">{unread}</span>}
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">{supportMessages.filter(m => m.userEmail === email).slice(-1)[0]?.text}</p>
                  </div>
                );
              })}
            </div>
            <div className="flex-1 flex flex-col p-8 bg-black/5">
              {selectedChat ? (
                <>
                  <div className="flex items-center gap-4 mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="w-10 h-10 bg-[#FFD600] rounded-full flex items-center justify-center font-black text-[#1A237E]">{selectedChat[0].toUpperCase()}</div>
                    <h3 className="font-bold text-white">{selectedChat}</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-4 mb-8 pr-4 custom-scrollbar">
                    {supportMessages.filter(m => m.userEmail === selectedChat).map(m => (
                      <div key={m.id} className={`flex ${m.isAdmin ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-4 rounded-[1.5rem] max-w-[80%] shadow-lg ${m.isAdmin ? 'bg-[#1A237E] text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none'}`}>
                          <p className="text-sm leading-relaxed">{m.text}</p>
                          <p className="text-[8px] mt-1 opacity-50 font-mono">{m.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <input type="text" placeholder="রিপ্লাই লিখুন..." className="flex-1 px-8 py-5 bg-slate-800 rounded-2xl outline-none text-white border-2 border-transparent focus:border-[#FFD600] transition-all" value={replyText} onChange={e => setReplyText(e.target.value)} onKeyPress={e => e.key === 'Enter' && replyText.trim() && (onAdminReply(selectedChat, replyText), setReplyText(''))} />
                    <button onClick={() => { if(replyText.trim()) { onAdminReply(selectedChat, replyText); setReplyText(''); } }} className="px-10 py-5 bg-[#FFD600] text-[#1A237E] font-black rounded-2xl hover:scale-105 transition-all shadow-xl">পাঠান</button>
                  </div>
                </>
              ) : <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4"><MessageSquare className="w-16 h-16 opacity-10" /><p className="font-bold">চ্যাট সিলেক্ট করুন</p></div>}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-xl space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-slate-900/50 p-12 rounded-[3rem] border border-white/5 space-y-8 shadow-2xl">
               <h3 className="text-2xl font-black flex items-center gap-3"><Wrench className="text-[#FFD600] w-8 h-8" /> মার্কেটপ্লেস সেটিংস</h3>
               <div className="space-y-6">
                 <div className="space-y-2">
                   <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">ফ্রি অ্যাড লিমিট (দৈনিক)</label>
                   <input type="number" className="w-full px-8 py-5 bg-slate-800 rounded-2xl outline-none text-white border-2 border-white/5 focus:border-[#FFD600] transition-all text-xl font-bold" value={settings.freePostLimit} onChange={e => onUpdateSettings({...settings, freePostLimit: parseInt(e.target.value)})} />
                 </div>
                 <div className="space-y-2">
                   <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">অতিরিক্ত অ্যাড চার্জ (৳)</label>
                   <input type="number" className="w-full px-8 py-5 bg-slate-800 rounded-2xl outline-none text-white border-2 border-white/5 focus:border-[#FFD600] transition-all text-xl font-bold" value={settings.extraPostPrice} onChange={e => onUpdateSettings({...settings, extraPostPrice: parseInt(e.target.value)})} />
                 </div>
                 <div className="space-y-2">
                   <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">ভেরিফিকেশন ফি (৳)</label>
                   <input type="number" className="w-full px-8 py-5 bg-slate-800 rounded-2xl outline-none text-white border-2 border-white/5 focus:border-[#FFD600] transition-all text-xl font-bold" value={settings.verificationPrice} onChange={e => onUpdateSettings({...settings, verificationPrice: parseInt(e.target.value)})} />
                 </div>
               </div>
               <div className="p-6 bg-[#1A237E]/20 rounded-[2rem] border border-[#1A237E]/30 text-xs text-blue-300 leading-relaxed font-bold">
                 * এখানে করা পরিবর্তনগুলো সাথে সাথে সকল ইউজারের ক্ষেত্রে প্রযোজ্য হবে। বিশেষ করে অ্যাড পোস্ট করার সময় নতুন রেট প্রদর্শিত হবে।
               </div>
            </div>
          </div>
        )}
      </main>

      {/* Image View Modal for Screenshots */}
      {showImageModal && (
        <div className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-10" onClick={() => setShowImageModal(null)}>
           <div className="relative max-w-4xl max-h-full">
              {/* Fixed: Using CloseIcon instead of X */}
              <button className="absolute -top-12 -right-4 text-white p-2 hover:bg-white/10 rounded-full"><CloseIcon className="w-8 h-8" /></button>
              <img src={showImageModal} className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain border border-white/10" alt="Screenshot Preview" />
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
