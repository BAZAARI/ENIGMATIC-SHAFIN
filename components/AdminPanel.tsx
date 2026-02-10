
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'posts' | 'boost' | 'support' | 'settings' | 'admins'>('dashboard');
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
    <div className="min-h-screen bg-[#070B14] text-slate-200 flex">
      {/* Sidebar - Matches Screenshot */}
      <aside className="w-72 bg-[#0F172A] border-r border-white/5 flex flex-col p-8 fixed h-full z-50">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-[#FFD600] p-2 rounded-lg"><ShoppingBag className="text-[#1A237E] w-5 h-5" /></div>
          <span className="text-xl font-black text-white">Admin Bazaari</span>
        </div>

        <nav className="space-y-3 flex-grow">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'dashboard' ? 'bg-[#1A237E] text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
            <LayoutDashboard className="w-5 h-5" /> ড্যাশবোর্ড
          </button>
          
          <button onClick={() => setActiveTab('posts')} className={`relative w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'posts' ? 'bg-[#1A237E] text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
            <ClipboardList className="w-5 h-5" /> পোস্ট 
            {pendingPosts > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{pendingPosts}</span>}
          </button>
          
          <button onClick={() => setActiveTab('boost')} className={`relative w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'boost' ? 'bg-[#1A237E] text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
            <Rocket className="w-5 h-5" /> বুস্ট
            {pendingBoosts > 0 && <span className="ml-auto bg-yellow-500 text-[#1A237E] text-[10px] px-2 py-0.5 rounded-full">{pendingBoosts}</span>}
          </button>
          
          <button onClick={() => setActiveTab('support')} className={`relative w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'support' ? 'bg-[#1A237E] text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
            <MessageSquare className="w-5 h-5" /> সাপোর্ট চ্যাট
            {unreadMessages > 0 && <span className="ml-auto bg-purple-500 text-white text-[10px] px-2 py-0.5 rounded-full">{unreadMessages}</span>}
          </button>

          <button onClick={() => setActiveTab('admins')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'admins' ? 'bg-[#1A237E] text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
            <ShieldCheck className="w-5 h-5" /> অ্যাডমিন লিস্ট
          </button>
          
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'settings' ? 'bg-[#1A237E] text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
            <Settings className="w-5 h-5" /> সেটিংস
          </button>
        </nav>

        <button onClick={onClose} className="mt-auto flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-500/10 transition-all">
          <LogOut className="w-5 h-5" /> লগআউট
        </button>
      </aside>

      {/* Content Area */}
      <main className="flex-1 ml-72 p-12">
        <header className="flex justify-between items-start mb-16">
          <div>
            <h1 className="text-5xl font-black text-white mb-2 capitalize">{activeTab === 'settings' ? 'Settings' : activeTab}</h1>
            <p className="text-slate-500 font-medium">আপনার মার্কেটপ্লেস পরিচালনা করুন।</p>
          </div>
          <div className="flex items-center gap-6">
             <div className="relative p-2 bg-slate-900 rounded-xl border border-white/5">
                <Bell className="w-6 h-6 text-slate-400" />
                {totalPending > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] flex items-center justify-center rounded-full font-black animate-bounce">{totalPending}</span>}
             </div>
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
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-[#0F172A] p-10 rounded-[2.5rem] border border-white/5 space-y-8 shadow-2xl">
               <div className="flex items-center gap-4 mb-10">
                  <div className="bg-transparent p-2">
                    <Wrench className="text-[#FFD600] w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-black text-white">মার্কেটপ্লেস সেটিংস</h3>
               </div>
               
               <div className="space-y-8">
                 <div className="space-y-3">
                   <label className="block text-sm font-bold text-slate-400">ফ্রি অ্যাড লিমিট (দৈনিক)</label>
                   <input 
                    type="number" 
                    className="w-full px-8 py-6 bg-[#1A2337] rounded-2xl outline-none text-white border-none transition-all text-2xl font-black" 
                    value={settings.freePostLimit} 
                    onChange={e => onUpdateSettings({...settings, freePostLimit: parseInt(e.target.value)})} 
                   />
                 </div>
                 
                 <div className="space-y-3">
                   <label className="block text-sm font-bold text-slate-400">অতিরিক্ত অ্যাড চার্জ (৳)</label>
                   <input 
                    type="number" 
                    className="w-full px-8 py-6 bg-[#1A2337] rounded-2xl outline-none text-white border-none transition-all text-2xl font-black" 
                    value={settings.extraPostPrice} 
                    onChange={e => onUpdateSettings({...settings, extraPostPrice: parseInt(e.target.value)})} 
                   />
                 </div>
                 
                 <div className="space-y-3">
                   <label className="block text-sm font-bold text-slate-400">ভেরিফিকেশন ফি (৳)</label>
                   <input 
                    type="text" 
                    className="w-full px-8 py-6 bg-[#1A2337] rounded-2xl outline-none text-white border-none transition-all text-2xl font-black truncate" 
                    value={settings.verificationPrice || 150} 
                    onChange={e => onUpdateSettings({...settings, verificationPrice: parseInt(e.target.value) || 150})} 
                   />
                 </div>
               </div>

               <div className="p-6 bg-blue-500/5 rounded-2xl border border-blue-500/10 text-xs text-blue-400/80 leading-relaxed font-bold">
                 * এখানে করা পরিবর্তনগুলো সাথে সাথে সকল ইউজারের ক্ষেত্রে প্রযোজ্য হবে।
               </div>
            </div>
          </div>
        )}

        {/* Existing Tabs with minor style tweaks for consistency */}
        {activeTab === 'posts' && (
           <div className="bg-slate-900/50 rounded-[3rem] border border-white/5 overflow-hidden">
             <table className="w-full text-left">
               <thead className="bg-white/5 text-xs font-bold text-slate-500 uppercase tracking-widest">
                 <tr className="border-b border-white/5">
                   <th className="p-8">পণ্য / সেলার</th>
                   <th className="p-8">পেমেন্ট উদ্দেশ্য</th>
                   <th className="p-8 text-right">অ্যাকশন</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {postRequests.filter(r => r.status === 'pending').map(r => (
                   <tr key={r.id} className="hover:bg-white/5 transition-colors">
                     <td className="p-8">
                        <div className="flex items-center gap-4">
                          <img src={r.product.image} className="w-12 h-12 rounded-xl object-cover" />
                          <div><p className="font-bold text-white">{r.product.name}</p><p className="text-xs text-slate-500">{r.product.vendor}</p></div>
                        </div>
                     </td>
                     <td className="p-8"><span className="text-xs text-slate-500 font-bold">{r.paymentReason || "Standard"}</span></td>
                     <td className="p-8 text-right flex justify-end gap-2">
                       <button onClick={() => onUpdatePost(r.id, 'approved')} className="p-3 bg-green-500/10 text-green-500 rounded-xl"><Check className="w-5 h-5" /></button>
                       <button onClick={() => onUpdatePost(r.id, 'rejected')} className="p-3 bg-red-500/10 text-red-500 rounded-xl"><CloseIcon className="w-5 h-5" /></button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        )}

        {activeTab === 'admins' && (
          <div className="max-w-2xl bg-[#0F172A] p-10 rounded-[2.5rem] border border-white/5 space-y-8">
            <h3 className="text-3xl font-black text-white">অ্যাডমিন ম্যানেজমেন্ট</h3>
            <div className="flex gap-4">
              <input type="email" placeholder="ইমেইল দিন" className="flex-1 px-6 py-4 bg-[#1A2337] rounded-2xl outline-none text-white" value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} />
              <button onClick={() => onAddAdminEmail(newAdminEmail)} className="px-8 py-4 bg-[#FFD600] text-[#1A237E] font-bold rounded-2xl">যোগ করুন</button>
            </div>
            <div className="space-y-4">
              {adminEmails.map(email => (
                <div key={email} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="font-medium text-slate-300">{email}</span>
                  <ShieldCheck className="text-green-500 w-5 h-5" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Support Chat with consistent styling */}
        {activeTab === 'support' && (
          <div className="bg-[#0F172A] rounded-[2.5rem] border border-white/5 h-[600px] flex overflow-hidden shadow-2xl">
            <div className="w-80 border-r border-white/5 overflow-y-auto bg-black/20">
              <div className="p-6 border-b border-white/5 font-black text-xs text-slate-500 uppercase tracking-widest">Conversations</div>
              {uniqueUsers.map(email => (
                <div key={email} onClick={() => setSelectedChat(email)} className={`p-6 cursor-pointer border-b border-white/5 transition-all ${selectedChat === email ? 'bg-[#1A237E]/40 border-l-4 border-l-[#FFD600]' : 'hover:bg-white/5'}`}>
                  <p className="font-bold text-white truncate text-sm">{email}</p>
                </div>
              ))}
            </div>
            <div className="flex-1 flex flex-col p-8">
              {selectedChat ? (
                <>
                  <div className="flex-1 overflow-y-auto space-y-4 mb-8">
                    {supportMessages.filter(m => m.userEmail === selectedChat).map(m => (
                      <div key={m.id} className={`flex ${m.isAdmin ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-4 rounded-2xl max-w-[80%] ${m.isAdmin ? 'bg-[#1A237E] text-white' : 'bg-slate-800 text-slate-200'}`}>
                          <p className="text-sm">{m.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <input type="text" className="flex-1 px-6 py-4 bg-[#1A2337] rounded-2xl outline-none text-white" value={replyText} onChange={e => setReplyText(e.target.value)} />
                    <button onClick={() => {onAdminReply(selectedChat, replyText); setReplyText('');}} className="px-8 py-4 bg-[#FFD600] text-[#1A237E] font-black rounded-2xl">পাঠান</button>
                  </div>
                </>
              ) : <div className="flex-1 flex items-center justify-center text-slate-500 font-bold">একটি চ্যাট বেছে নিন</div>}
            </div>
          </div>
        )}
      </main>

      {/* Screenshot Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-10" onClick={() => setShowImageModal(null)}>
           <div className="relative max-w-4xl max-h-full">
              <button className="absolute -top-12 -right-4 text-white p-2 hover:bg-white/10 rounded-full"><CloseIcon className="w-8 h-8" /></button>
              <img src={showImageModal} className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain border border-white/10" alt="Preview" />
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
