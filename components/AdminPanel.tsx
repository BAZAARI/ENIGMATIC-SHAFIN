
import React, { useState } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Settings, LogOut, Rocket, 
  ClipboardList, Bell, MessageSquare, Wrench, ShieldCheck, Check, X as CloseIcon, Eye
} from 'lucide-react';
import { BoostRequest, PostRequest, VerificationRequest, SupportMessage, AdminSettings } from '../types.ts';

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

  const pendingPosts = postRequests.filter(r => r.status === 'pending').length;
  const pendingBoosts = boostRequests.filter(r => r.status === 'pending').length;
  const unreadMessages = supportMessages.filter(m => !m.isAdmin && !m.isRead).length;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmails.includes(loginEmail.toLowerCase()) && password === 'SHAFIN@1a') {
      setIsAuthenticated(true);
    } else {
      alert('ভুল তথ্য!');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#0F172A] flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-white/5 p-12 rounded-[3rem] w-full max-w-md shadow-2xl text-center">
          <h2 className="text-3xl font-black text-white mb-8">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="ইমেইল" className="w-full px-6 py-4 bg-slate-800 rounded-2xl text-white outline-none" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
            <input type="password" placeholder="পাসওয়ার্ড" className="w-full px-6 py-4 bg-slate-800 rounded-2xl text-white outline-none" value={password} onChange={e => setPassword(e.target.value)} />
            <button className="w-full py-4 bg-[#FFD600] text-[#1A237E] font-black rounded-2xl">প্রবেশ করুন</button>
          </form>
          <button onClick={onClose} className="mt-4 text-slate-500 text-sm">ফিরে যান</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-200 flex">
      {/* Sidebar - Matches Screenshot */}
      <aside className="w-72 bg-[#0F172A] border-r border-white/5 flex flex-col p-8 fixed h-full z-50">
        <div className="flex items-center gap-3 mb-12">
          <div className="relative flex items-center justify-center mr-3 scale-75">
            <div className="bg-[#1A237E] w-12 h-12 rounded-xl rotate-3 absolute"></div>
            <div className="bg-[#FFD600] w-12 h-12 rounded-xl -rotate-3 border-2 border-[#1A237E] flex items-center justify-center relative z-10">
              <span className="text-[#1A237E] font-black text-2xl italic">B</span>
            </div>
          </div>
          <span className="text-xl font-black text-white tracking-tighter">ADMIN BAZAARI</span>
        </div>

        <nav className="space-y-3 flex-grow">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'dashboard' ? 'bg-[#1A237E] text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
            <LayoutDashboard className="w-5 h-5" /> ড্যাশবোর্ড
          </button>
          <button onClick={() => setActiveTab('posts')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'posts' ? 'bg-[#1A237E] text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
            <ClipboardList className="w-5 h-5" /> পোস্ট {pendingPosts > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] px-2 rounded-full">{pendingPosts}</span>}
          </button>
          <button onClick={() => setActiveTab('boost')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'boost' ? 'bg-[#1A237E] text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
            <Rocket className="w-5 h-5" /> বুস্ট {pendingBoosts > 0 && <span className="ml-auto bg-yellow-500 text-[#1A237E] text-[10px] px-2 rounded-full font-black">{pendingBoosts}</span>}
          </button>
          <button onClick={() => setActiveTab('support')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'support' ? 'bg-[#1A237E] text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
            <MessageSquare className="w-5 h-5" /> সাপোর্ট চ্যাট {unreadMessages > 0 && <span className="ml-auto bg-purple-500 text-white text-[10px] px-2 rounded-full">{unreadMessages}</span>}
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

      {/* Main Content Area */}
      <main className="flex-1 ml-72 p-12">
        <header className="flex justify-between items-start mb-16">
          <div>
            <h1 className="text-6xl font-black text-white mb-3 capitalize">{activeTab}</h1>
            <p className="text-slate-500 font-medium text-lg">আপনার মার্কেটপ্লেস পরিচালনা করুন।</p>
          </div>
          <div className="p-3 bg-slate-900 rounded-2xl border border-white/5">
            <Bell className="w-6 h-6 text-slate-400" />
          </div>
        </header>

        {activeTab === 'posts' && (
          <div className="bg-[#0F172A] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-2xl font-black text-white">পেনডিং অ্যাড রিকোয়েস্ট ({pendingPosts})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <tr>
                    <th className="p-8">পণ্যের তথ্য</th>
                    <th className="p-8">সেলার</th>
                    <th className="p-8">স্ট্যাটাস</th>
                    <th className="p-8 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {postRequests.filter(r => r.status === 'pending').map(r => (
                    <tr key={r.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-8">
                        <div className="flex items-center gap-4">
                          <img src={r.product.image} className="w-14 h-14 rounded-2xl object-cover border border-white/10" alt="" />
                          <div>
                            <p className="font-bold text-white text-lg">{r.product.name}</p>
                            <p className="text-sm text-[#FFD600] font-black">৳{r.product.price}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-8">
                        <p className="font-bold text-slate-300">{r.product.vendor}</p>
                        <p className="text-xs text-slate-500">{r.product.location}</p>
                      </td>
                      <td className="p-8">
                         <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-[10px] font-black rounded-full border border-yellow-500/20">PENDING</span>
                         {r.isPaid && <p className="text-[8px] text-green-500 mt-1 font-black">PAID AD</p>}
                      </td>
                      <td className="p-8 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => onUpdatePost(r.id, 'approved')} className="p-4 bg-green-500/10 text-green-500 rounded-2xl hover:bg-green-500 hover:text-white transition-all"><Check className="w-5 h-5" /></button>
                          <button onClick={() => onUpdatePost(r.id, 'rejected')} className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><CloseIcon className="w-5 h-5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pendingPosts === 0 && (
                    <tr><td colSpan={4} className="p-20 text-center text-slate-500 font-bold">বর্তমানে কোনো পেনডিং পোস্ট নেই।</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-[#0F172A] p-12 rounded-[3rem] border border-white/5 space-y-12 shadow-2xl relative overflow-hidden">
               <div className="flex items-center gap-6 mb-4">
                  <Wrench className="text-[#FFD600] w-12 h-12" />
                  <h3 className="text-4xl font-black text-white">মার্কেটপ্লেস সেটিংস</h3>
               </div>
               
               <div className="space-y-10">
                 <div className="space-y-4">
                   <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest">ফ্রি অ্যাড লিমিট (দৈনিক)</label>
                   <input 
                    type="number" 
                    className="w-full px-8 py-7 bg-[#1A2337] rounded-3xl outline-none text-white border-none transition-all text-3xl font-black" 
                    value={settings.freePostLimit} 
                    onChange={e => onUpdateSettings({...settings, freePostLimit: parseInt(e.target.value)})} 
                   />
                 </div>
                 
                 <div className="space-y-4">
                   <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest">অতিরিক্ত অ্যাড চার্জ (৳)</label>
                   <input 
                    type="number" 
                    className="w-full px-8 py-7 bg-[#1A2337] rounded-3xl outline-none text-white border-none transition-all text-3xl font-black" 
                    value={settings.extraPostPrice} 
                    onChange={e => onUpdateSettings({...settings, extraPostPrice: parseInt(e.target.value)})} 
                   />
                 </div>
                 
                 <div className="space-y-4">
                   <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest">ভেরিফিকেশন ফি (৳)</label>
                   <input 
                    type="text" 
                    className="w-full px-8 py-7 bg-[#1A2337] rounded-3xl outline-none text-white border-none transition-all text-3xl font-black" 
                    value={settings.verificationPrice || 150} 
                    onChange={e => onUpdateSettings({...settings, verificationPrice: parseInt(e.target.value) || 150})} 
                   />
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* Dashboard Placeholder */}
        {activeTab === 'dashboard' && (
           <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-900/50 p-10 rounded-[3rem] border border-white/5 text-center">
                 <p className="text-slate-500 font-bold uppercase text-xs mb-4">মোট পেনডিং পোস্ট</p>
                 <h2 className="text-5xl font-black text-blue-400">{pendingPosts}</h2>
              </div>
              <div className="bg-slate-900/50 p-10 rounded-[3rem] border border-white/5 text-center">
                 <p className="text-slate-500 font-bold uppercase text-xs mb-4">মোট পেনডিং বুস্ট</p>
                 <h2 className="text-5xl font-black text-yellow-400">{pendingBoosts}</h2>
              </div>
              <div className="bg-slate-900/50 p-10 rounded-[3rem] border border-white/5 text-center">
                 <p className="text-slate-500 font-bold uppercase text-xs mb-4">নতুন মেসেজ</p>
                 <h2 className="text-5xl font-black text-purple-400">{unreadMessages}</h2>
              </div>
           </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
