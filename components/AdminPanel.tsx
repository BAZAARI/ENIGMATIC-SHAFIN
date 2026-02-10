
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Settings, LogOut, Rocket, 
  ClipboardList, Bell, MessageSquare, Wrench, ShieldCheck, Check, X as CloseIcon, Eye, Lock, Mail, Trash2, Plus, UserPlus, UserCheck, Image as ImageIcon, Menu
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const navItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: <LayoutDashboard className="w-5 h-5" />, count: 0 },
    { id: 'posts', label: 'PENDING ADS', icon: <ClipboardList className="w-5 h-5" />, count: pendingPosts },
    { id: 'boost', label: 'BOOST LIST', icon: <Rocket className="w-5 h-5" />, count: pendingBoosts },
    { id: 'admins', label: 'ADMIN LIST', icon: <ShieldCheck className="w-5 h-5" />, count: 0 },
    { id: 'settings', label: 'CONFIGURATION', icon: <Settings className="w-5 h-5" />, count: 0 },
  ];

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#070B14] flex items-center justify-center p-4">
        <div className="bg-slate-900/50 backdrop-blur-3xl border border-white/10 p-8 md:p-14 rounded-[2.5rem] md:rounded-[3.5rem] w-full max-w-md shadow-2xl text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-8 tracking-tight italic uppercase">Admin Login</h2>
          <form onSubmit={handleManualLogin} className="space-y-4 md:space-y-5">
            <input type="email" placeholder="Admin Email" className="w-full px-6 py-4 md:py-5 bg-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#FFD600] text-sm md:text-base" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
            <input type="password" placeholder="Password" className="w-full px-6 py-4 md:py-5 bg-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#FFD600] text-sm md:text-base" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" className="w-full py-4 md:py-5 bg-[#FFD600] text-[#1A237E] font-black rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 text-sm md:text-base">ENTER PANEL</button>
          </form>
          <button onClick={onClose} className="mt-8 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">GO BACK</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-200 flex flex-col lg:flex-row overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden bg-[#0F172A] p-4 flex justify-between items-center border-b border-white/5 sticky top-0 z-[60]">
         <span className="text-lg font-black text-white italic">BAZAARI ADMIN</span>
         <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white/5 rounded-xl">
           {isSidebarOpen ? <CloseIcon /> : <Menu />}
         </button>
      </div>

      {/* Sidebar - Desktop and Mobile Overlay */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-[#0F172A] border-r border-white/5 flex flex-col p-8 z-[100] transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-12">
           <span className="text-xl font-black text-white tracking-tighter italic">ADMIN BAZAARI</span>
           <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400"><CloseIcon /></button>
        </div>

        <nav className="space-y-2 flex-grow">
          {navItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => { setActiveTab(item.id as any); setIsSidebarOpen(false); }} 
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all text-sm ${activeTab === item.id ? 'bg-[#1A237E] text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}
            >
              {item.icon} {item.label} 
              {item.count > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">{item.count}</span>}
            </button>
          ))}
        </nav>

        <button onClick={onClose} className="mt-auto flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-500/10 transition-all text-sm">
          <LogOut className="w-5 h-5" /> EXIT PANEL
        </button>
      </aside>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden"></div>}

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 p-6 md:p-12 overflow-y-auto h-screen custom-scrollbar">
        <header className="mb-10 md:mb-16">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-3 uppercase tracking-tighter">{activeTab}</h1>
            <p className="text-slate-500 font-medium text-sm md:text-base">Full marketplace control and monitoring.</p>
        </header>

        <div className="max-w-6xl mx-auto pb-20">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-[#0F172A] p-8 rounded-[2.5rem] border border-white/5 flex flex-col justify-between">
                <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-4">Total Ads</p>
                <h2 className="text-5xl font-black text-white">42</h2>
              </div>
              <div className="bg-[#0F172A] p-8 rounded-[2.5rem] border border-white/5 flex flex-col justify-between">
                <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-4">Pending Boosts</p>
                <h2 className="text-5xl font-black text-[#FFD600]">{pendingBoosts}</h2>
              </div>
              <div className="bg-[#0F172A] p-8 rounded-[2.5rem] border border-white/5 flex flex-col justify-between">
                <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-4">Support Messages</p>
                <h2 className="text-5xl font-black text-blue-500">{supportMessages.length}</h2>
              </div>
            </div>
          )}

          {activeTab === 'admins' && (
            <div className="space-y-8 md:space-y-10 animate-in fade-in duration-500">
              <div className="bg-[#0F172A] p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-white/5 shadow-2xl">
                <h3 className="text-xl md:text-2xl font-black text-white mb-6 md:mb-8 flex items-center gap-3"><UserPlus className="text-[#FFD600]" /> ADD NEW ADMIN</h3>
                <form onSubmit={handleAddAdmin} className="flex flex-col sm:flex-row gap-4">
                  <input type="email" placeholder="Email Address" className="flex-1 px-6 md:px-8 py-4 md:py-5 bg-slate-800 border border-white/5 rounded-2xl text-white outline-none focus:border-[#FFD600] text-sm" value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} required />
                  <button type="submit" className="px-8 md:px-10 py-4 md:py-5 bg-[#FFD600] text-[#1A237E] font-black rounded-2xl hover:scale-105 active:scale-95 transition-all text-sm">ADD NOW</button>
                </form>
              </div>
              
              <div className="bg-[#0F172A] rounded-[2.5rem] md:rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-6 md:p-8 border-b border-white/5">
                  <h3 className="text-xl md:text-2xl font-black text-white">ACTIVE ADMINS</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[500px]">
                    <thead className="bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <tr><th className="p-6 md:p-8">Admin Entity</th><th className="p-6 md:p-8">Status</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {adminEmails.map((email, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                          <td className="p-6 md:p-8 flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#1A237E] rounded-xl flex items-center justify-center text-[#FFD600] font-black">{email[0].toUpperCase()}</div>
                            <span className="text-white font-bold text-sm md:text-base">{email}</span>
                          </td>
                          <td className="p-6 md:p-8">
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
            <div className="space-y-8 md:space-y-12 animate-in slide-in-from-bottom-6 duration-500">
              <div className="bg-[#0F172A] p-6 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border border-white/5 shadow-2xl">
                 <h3 className="text-2xl md:text-3xl font-black text-white mb-8 md:mb-10 flex items-center gap-4"><Rocket className="text-blue-500" /> BOOST PLAN PRICING</h3>
                 <div className="grid gap-6">
                    {settings.boostPlans.map((plan) => (
                      <div key={plan.id} className="p-6 md:p-8 bg-[#1A2337] rounded-[2rem] md:rounded-[2.5rem] border border-white/5 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Duration (Days)</label>
                          <input type="number" className="w-full px-4 py-4 bg-slate-900 rounded-xl text-white outline-none font-black text-lg md:text-xl" value={plan.days} onChange={(e) => updateBoostPlan(plan.id, 'days', parseInt(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Price (৳)</label>
                          <input type="number" className="w-full px-4 py-4 bg-slate-900 rounded-xl text-[#FFD600] outline-none font-black text-lg md:text-xl" value={plan.price} onChange={(e) => updateBoostPlan(plan.id, 'price', parseInt(e.target.value))} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Plan Description</label>
                          <input type="text" className="w-full px-4 py-4 bg-slate-900 rounded-xl text-white outline-none text-sm" value={plan.description} onChange={(e) => updateBoostPlan(plan.id, 'description', e.target.value)} />
                        </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-[#0F172A] p-6 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border border-white/5 shadow-2xl">
                 <h3 className="text-2xl md:text-3xl font-black text-white mb-8 md:mb-10 flex items-center gap-4"><ImageIcon className="text-green-500" /> SYSTEM CHARGES</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
                   <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Free Post Limit</label>
                     <input type="number" className="w-full px-6 py-5 bg-[#1A2337] rounded-3xl text-white outline-none text-2xl font-black" value={settings.freePostLimit} onChange={e => onUpdateSettings({...settings, freePostLimit: parseInt(e.target.value)})} />
                   </div>
                   <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Extra Ad Charge (৳)</label>
                     <input type="number" className="w-full px-6 py-5 bg-[#1A2337] rounded-3xl text-white outline-none text-2xl font-black text-[#FFD600]" value={settings.extraPostPrice} onChange={e => onUpdateSettings({...settings, extraPostPrice: parseInt(e.target.value)})} />
                   </div>
                   <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Extra Img Charge (৳)</label>
                     <input type="number" className="w-full px-6 py-5 bg-[#1A2337] rounded-3xl text-white outline-none text-2xl font-black text-pink-500" value={settings.extraImagePrice} onChange={e => onUpdateSettings({...settings, extraImagePrice: parseInt(e.target.value)})} />
                   </div>
                 </div>
              </div>
            </div>
          )}
          
          {/* Default Content for other tabs */}
          {(activeTab === 'posts' || activeTab === 'boost') && (
            <div className="bg-[#0F172A] rounded-[2.5rem] md:rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl animate-in fade-in">
              <div className="p-8 text-center text-slate-500 italic">
                 {activeTab === 'posts' ? 'No pending ads at the moment.' : 'No active boost requests.'}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
