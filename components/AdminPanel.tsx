
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Settings, LogOut, Rocket, 
  ClipboardList, Bell, MessageSquare, Wrench, ShieldCheck, Check, X as CloseIcon, Eye, Lock, Mail, Trash2, Plus, UserPlus, UserCheck, Image as ImageIcon
} from 'lucide-react';
import { BoostRequest, PostRequest, VerificationRequest, SupportMessage, AdminSettings, User, Language, BoostPlan, VerifyPlan } from '../types.ts';

interface AdminPanelProps {
  onClose: () => void;
  currentUser: User | null;
  language: Language;
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
  onClose, currentUser, language, boostRequests, postRequests, verificationRequests, supportMessages, settings, adminEmails,
  onUpdateSettings, onAddAdminEmail, onUpdateBoost, onUpdatePost, onUpdateVerification, onAdminReply
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'posts' | 'boost' | 'support' | 'settings' | 'admins'>('dashboard');
  const [newAdminEmail, setNewAdminEmail] = useState('');

  useEffect(() => {
    if (currentUser && adminEmails.includes(currentUser.email.toLowerCase())) {
      setIsAuthenticated(true);
    }
  }, [currentUser, adminEmails]);

  const pendingPosts = postRequests.filter(r => r.status === 'pending').length;
  const pendingBoosts = boostRequests.filter(r => r.status === 'pending').length;

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmails.map(em => em.toLowerCase()).includes(loginEmail.toLowerCase()) && password === 'SHAFIN@1a') {
      setIsAuthenticated(true);
    } else {
      alert(language === 'bn' ? 'ভুল ইমেইল বা পাসওয়ার্ড!' : 'Invalid credentials!');
    }
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;
    onAddAdminEmail(newAdminEmail.toLowerCase());
    setNewAdminEmail('');
    alert('Admin added!');
  };

  const updateBoostPlan = (id: string, field: keyof BoostPlan, value: any) => {
    const newPlans = settings.boostPlans.map(p => p.id === id ? { ...p, [field]: value } : p);
    onUpdateSettings({ ...settings, boostPlans: newPlans });
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#070B14] flex items-center justify-center p-4">
        <div className="bg-slate-900/50 backdrop-blur-3xl border border-white/10 p-10 md:p-14 rounded-[3.5rem] w-full max-w-md shadow-2xl text-center relative z-10">
          <h2 className="text-3xl font-black text-white mb-8 tracking-tight italic">ADMIN LOGIN</h2>
          <form onSubmit={handleManualLogin} className="space-y-5">
            <input type="email" placeholder="Admin Email" className="w-full px-6 py-5 bg-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#FFD600]" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
            <input type="password" placeholder="Password" className="w-full px-6 py-5 bg-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#FFD600]" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" className="w-full py-5 bg-[#FFD600] text-[#1A237E] font-black rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95">ENTER PANEL</button>
          </form>
          <button onClick={onClose} className="mt-8 text-slate-500 text-xs font-black uppercase tracking-widest hover:text-white transition-colors">GO BACK</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-200 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0F172A] border-r border-white/5 flex flex-col p-8 fixed h-full z-50">
        <div className="flex items-center gap-3 mb-12">
           <span className="text-xl font-black text-white tracking-tighter italic">ADMIN BAZAARI</span>
        </div>

        <nav className="space-y-3 flex-grow">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'dashboard' ? 'bg-[#1A237E] text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
            <LayoutDashboard className="w-5 h-5" /> DASHBOARD
          </button>
          <button onClick={() => setActiveTab('posts')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'posts' ? 'bg-[#1A237E] text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
            <ClipboardList className="w-5 h-5" /> PENDING ADS {pendingPosts > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] px-2 rounded-full font-black">{pendingPosts}</span>}
          </button>
          <button onClick={() => setActiveTab('boost')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'boost' ? 'bg-[#1A237E] text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
            <Rocket className="w-5 h-5" /> BOOST LIST
          </button>
          <button onClick={() => setActiveTab('admins')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'admins' ? 'bg-[#1A237E] text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
            <ShieldCheck className="w-5 h-5" /> ADMIN LIST
          </button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'settings' ? 'bg-[#1A237E] text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
            <Settings className="w-5 h-5" /> CONFIGURATION
          </button>
        </nav>

        <button onClick={onClose} className="mt-auto flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-500/10 transition-all">
          <LogOut className="w-5 h-5" /> EXIT PANEL
        </button>
      </aside>

      <main className="flex-1 ml-72 p-12 overflow-y-auto h-screen custom-scrollbar">
        <header className="mb-16">
            <h1 className="text-6xl font-black text-white mb-3 uppercase tracking-tighter">{activeTab}</h1>
            <p className="text-slate-500 font-medium">Full marketplace control and monitoring.</p>
        </header>

        {activeTab === 'admins' && (
          <div className="max-w-4xl space-y-10 animate-in fade-in duration-500">
            <div className="bg-[#0F172A] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
              <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3"><UserPlus className="text-[#FFD600]" /> ADD NEW ADMIN</h3>
              <form onSubmit={handleAddAdmin} className="flex gap-4">
                <input type="email" placeholder="Email Address" className="flex-1 px-8 py-5 bg-slate-800 border border-white/5 rounded-2xl text-white outline-none focus:border-[#FFD600]" value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} required />
                <button type="submit" className="px-10 py-5 bg-[#FFD600] text-[#1A237E] font-black rounded-2xl hover:scale-105 active:scale-95 transition-all">ADD NOW</button>
              </form>
            </div>
            <div className="bg-[#0F172A] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-white/5">
                <h3 className="text-2xl font-black text-white">ACTIVE ADMINS</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <tr><th className="p-8">Admin Entity</th><th className="p-8">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {adminEmails.map((email, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="p-8 flex items-center gap-4">
                          <div className="w-10 h-10 bg-[#1A237E] rounded-xl flex items-center justify-center text-[#FFD600] font-black">{email[0].toUpperCase()}</div>
                          <span className="text-white font-bold">{email}</span>
                        </td>
                        <td className="p-8">
                           <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black rounded-full border border-green-500/20 flex items-center gap-1 w-fit">
                             <UserCheck className="w-3 h-3" /> VERIFIED ADMIN
                           </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-4xl space-y-12 pb-20 animate-in slide-in-from-bottom-6 duration-500">
            <div className="bg-[#0F172A] p-12 rounded-[3rem] border border-white/5 shadow-2xl">
               <h3 className="text-3xl font-black text-white mb-10 flex items-center gap-4"><Rocket className="text-blue-500" /> BOOST PLAN PRICING</h3>
               <div className="grid gap-6">
                  {settings.boostPlans.map((plan) => (
                    <div key={plan.id} className="p-8 bg-[#1A2337] rounded-[2.5rem] border border-white/5 grid md:grid-cols-4 gap-6 items-end">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Duration (Days)</label>
                        <input type="number" className="w-full px-4 py-4 bg-slate-900 rounded-xl text-white outline-none font-black text-xl" value={plan.days} onChange={(e) => updateBoostPlan(plan.id, 'days', parseInt(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Price (৳)</label>
                        <input type="number" className="w-full px-4 py-4 bg-slate-900 rounded-xl text-[#FFD600] outline-none font-black text-xl" value={plan.price} onChange={(e) => updateBoostPlan(plan.id, 'price', parseInt(e.target.value))} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Plan Description</label>
                        <input type="text" className="w-full px-4 py-4 bg-slate-900 rounded-xl text-white outline-none" value={plan.description} onChange={(e) => updateBoostPlan(plan.id, 'description', e.target.value)} />
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-[#0F172A] p-12 rounded-[3rem] border border-white/5 shadow-2xl">
               <h3 className="text-3xl font-black text-white mb-10 flex items-center gap-4"><ImageIcon className="text-green-500" /> SYSTEM CHARGES</h3>
               <div className="grid md:grid-cols-3 gap-8">
                 <div className="space-y-4">
                   <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Free Post Limit</label>
                   <input type="number" className="w-full px-8 py-6 bg-[#1A2337] rounded-3xl text-white outline-none text-3xl font-black" value={settings.freePostLimit} onChange={e => onUpdateSettings({...settings, freePostLimit: parseInt(e.target.value)})} />
                 </div>
                 <div className="space-y-4">
                   <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Extra Ad Charge (৳)</label>
                   <input type="number" className="w-full px-8 py-6 bg-[#1A2337] rounded-3xl text-white outline-none text-3xl font-black text-[#FFD600]" value={settings.extraPostPrice} onChange={e => onUpdateSettings({...settings, extraPostPrice: parseInt(e.target.value)})} />
                 </div>
                 <div className="space-y-4">
                   <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Extra Img Charge (৳)</label>
                   <input type="number" className="w-full px-8 py-6 bg-[#1A2337] rounded-3xl text-white outline-none text-3xl font-black text-pink-500" value={settings.extraImagePrice} onChange={e => onUpdateSettings({...settings, extraImagePrice: parseInt(e.target.value)})} />
                 </div>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
