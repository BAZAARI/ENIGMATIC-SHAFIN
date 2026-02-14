
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Settings, LogOut, Rocket, 
  ClipboardList, MessageSquare, ShieldCheck, Check, X as CloseIcon, Lock, Send, Users as UsersIcon, Ban, ShieldAlert, CheckCircle2, Search, Menu, ChevronRight, Save, DollarSign, Image as ImageIcon, Zap
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
  mockUsers: User[];
  onUpdateUserStatus: (uid: string, action: 'unban' | 'ban_1' | 'ban_3' | 'ban_7' | 'ban_15' | 'ban_30' | 'ban_perm') => void;
  onUpdateSettings: (s: AdminSettings) => void;
  onAddAdminEmail: (email: string) => void;
  onUpdateBoost: (id: string, status: 'approved' | 'rejected') => void;
  onUpdatePost: (id: string, status: 'approved' | 'rejected') => void;
  onUpdateVerification: (id: string, status: 'approved' | 'rejected') => void;
  onAdminReply: (email: string, text: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  onClose, currentUser, language, boostRequests, postRequests, verificationRequests, supportMessages, settings, adminEmails, mockUsers,
  onUpdateUserStatus, onUpdateSettings, onAddAdminEmail, onUpdateBoost, onUpdatePost, onUpdateVerification, onAdminReply
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'posts' | 'boost' | 'support' | 'verifications' | 'settings'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [userSearch, setUserSearch] = useState('');
  
  // Settings local state
  const [localSettings, setLocalSettings] = useState<AdminSettings>(settings);

  useEffect(() => {
    const isAdmin = currentUser && adminEmails.map(e => e.toLowerCase()).includes(currentUser.email.toLowerCase());
    if (isAdmin) {
      setIsAuthenticated(true);
    }
  }, [currentUser, adminEmails]);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'SHAFIN@1a') {
      setIsAuthenticated(true);
    } else {
      alert('Wrong Admin Password!');
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, count: 0 },
    { id: 'users', label: 'Users', icon: <UsersIcon className="w-5 h-5" />, count: mockUsers.length },
    { id: 'posts', label: 'Ads', icon: <ClipboardList className="w-5 h-5" />, count: postRequests.filter(r => r.status === 'pending').length },
    { id: 'boost', label: 'Boosts', icon: <Rocket className="w-5 h-5" />, count: boostRequests.filter(r => r.status === 'pending').length },
    { id: 'verifications', label: 'Verify', icon: <ShieldCheck className="w-5 h-5" />, count: verificationRequests.filter(r => r.status === 'pending').length },
    { id: 'support', label: 'Inbox', icon: <MessageSquare className="w-5 h-5" />, count: supportMessages.filter(m => !m.isAdmin && !m.isRead).length },
    { id: 'settings', label: 'Config', icon: <Settings className="w-5 h-5" />, count: 0 },
  ];

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#070B14] flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-white/10 p-12 rounded-[3.5rem] w-full max-md shadow-2xl text-center">
          <div className="w-20 h-20 bg-[#FFD600]/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#FFD600]/20">
             <Lock className="text-[#FFD600] w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-white mb-8 italic uppercase tracking-tighter">Bazaari Admin Gateway</h2>
          <form onSubmit={handleManualLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Security Password" 
              className="w-full px-6 py-5 bg-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#FFD600] text-center font-black" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
            <button type="submit" className="w-full py-5 bg-[#FFD600] text-[#1A237E] font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all uppercase italic">Login to Panel</button>
          </form>
          <button onClick={onClose} className="mt-8 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white">Exit Gateway</button>
        </div>
      </div>
    );
  }

  const handleSendReply = (email: string) => {
    if (!replyText[email]?.trim()) return;
    onAdminReply(email, replyText[email]);
    setReplyText(prev => ({ ...prev, [email]: '' }));
  };

  const saveSettings = () => {
    onUpdateSettings(localSettings);
    alert('সব সেটিং এবং দাম সফলভাবে আপডেট করা হয়েছে!');
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-200 flex flex-col lg:flex-row overflow-hidden font-sans">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/80 z-[90] lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-[#0F172A] border-r border-white/5 flex flex-col p-8 z-[100] transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFD600] rounded-xl flex items-center justify-center font-black text-[#1A237E]">B</div>
            <span className="text-xl font-black text-white tracking-tighter italic uppercase">Admin Hub</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 p-2 hover:bg-white/5 rounded-full">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <nav className="space-y-2 flex-grow overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => { setActiveTab(item.id as any); setIsSidebarOpen(false); }} 
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all text-sm ${activeTab === item.id ? 'bg-[#1A237E] text-white shadow-xl scale-105' : 'text-slate-500 hover:bg-white/5'}`}
            >
              {item.icon} {item.label} 
              {item.count > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">{item.count}</span>}
            </button>
          ))}
        </nav>

        <button onClick={onClose} className="mt-auto flex items-center gap-4 px-6 py-4 text-red-500 font-bold hover:bg-red-500/10 rounded-2xl text-sm transition-all">
          <LogOut className="w-5 h-5" /> EXIT PANEL
        </button>
      </aside>

      <main className="flex-1 lg:ml-72 p-4 md:p-12 h-screen overflow-y-auto custom-scrollbar flex flex-col">
        {/* Mobile-Friendly Admin Header */}
        <header className="mb-6 flex flex-col gap-4 bg-[#070B14] sticky top-0 z-50 pt-4 pb-2 border-b border-white/5 lg:border-none">
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center gap-3">
                <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-[#FFD600] text-[#1A237E] rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all">
                  <Menu className="w-6 h-6" />
                </button>
                <h1 className="text-xl md:text-5xl font-black text-white uppercase tracking-tighter italic truncate">{activeTab}</h1>
              </div>
              <div className="hidden lg:block bg-[#1A237E]/20 px-6 py-3 rounded-2xl border border-[#1A237E]/40 text-[#FFD600] font-black text-xs uppercase italic">
                SERVER TIME: {new Date().toLocaleTimeString()}
              </div>
              <button onClick={onClose} className="lg:hidden p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all">
                <LogOut className="w-6 h-6" />
              </button>
            </div>
        </header>

        <div className="max-w-6xl mx-auto w-full pb-24">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-[#0F172A] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl group hover:border-[#FFD600]/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">Total Users</p>
                  <UsersIcon className="w-5 h-5 text-[#FFD600]" />
                </div>
                <h2 className="text-5xl font-black text-white">{mockUsers.length}</h2>
              </div>
              <div className="bg-[#0F172A] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl group hover:border-[#FFD600]/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">Pending Ads</p>
                  <ClipboardList className="w-5 h-5 text-[#FFD600]" />
                </div>
                <h2 className="text-5xl font-black text-[#FFD600]">{postRequests.filter(r => r.status === 'pending').length}</h2>
              </div>
              <div className="bg-[#0F172A] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl group hover:border-green-500/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">Verification Req</p>
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                </div>
                <h2 className="text-5xl font-black text-green-500">{verificationRequests.filter(r => r.status === 'pending').length}</h2>
              </div>
              <div className="bg-[#0F172A] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl group hover:border-blue-500/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">Unread Msgs</p>
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                </div>
                <h2 className="text-5xl font-black text-blue-500">{supportMessages.filter(m => !m.isAdmin && !m.isRead).length}</h2>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4">
              <div className="bg-[#0F172A] p-8 rounded-[3rem] border border-white/5 shadow-2xl">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                    <DollarSign className="text-[#FFD600] w-6 h-6" /> Marketplace Pricing Engine
                  </h3>
                  <button onClick={saveSettings} className="bg-[#FFD600] text-[#1A237E] px-8 py-3 rounded-2xl font-black flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl uppercase italic text-sm">
                    <Save className="w-5 h-5" /> Save Configuration
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                   {/* General Post Settings */}
                   <div className="space-y-6 p-8 bg-black/20 rounded-[2.5rem] border border-white/5">
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Daily Post Limits & Costs</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Free Posts Per Day</label>
                          <input 
                            type="number" 
                            className="w-full px-6 py-4 bg-slate-900 rounded-xl text-[#FFD600] font-black outline-none border border-white/10 focus:border-[#FFD600]"
                            value={localSettings.freePostLimit}
                            onChange={e => setLocalSettings({...localSettings, freePostLimit: parseInt(e.target.value) || 0})}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Extra Post Price (৳)</label>
                          <input 
                            type="number" 
                            className="w-full px-6 py-4 bg-slate-900 rounded-xl text-[#FFD600] font-black outline-none border border-white/10 focus:border-[#FFD600]"
                            value={localSettings.extraPostPrice}
                            onChange={e => setLocalSettings({...localSettings, extraPostPrice: parseInt(e.target.value) || 0})}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Extra Image Price (৳)</label>
                          <input 
                            type="number" 
                            className="w-full px-6 py-4 bg-slate-900 rounded-xl text-[#FFD600] font-black outline-none border border-white/10 focus:border-[#FFD600]"
                            value={localSettings.extraImagePrice}
                            onChange={e => setLocalSettings({...localSettings, extraImagePrice: parseInt(e.target.value) || 0})}
                          />
                        </div>
                      </div>
                   </div>

                   {/* Verification Pricing */}
                   <div className="space-y-6 p-8 bg-black/20 rounded-[2.5rem] border border-white/5">
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Verification Plan Pricing</h4>
                      <div className="space-y-4">
                        {localSettings.verifyPlans.map((plan, idx) => (
                          <div key={plan.id} className="flex items-center gap-4">
                            <span className="w-20 text-[10px] font-black text-slate-400 uppercase">{plan.duration}</span>
                            <div className="flex-1 relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">৳</span>
                              <input 
                                type="number" 
                                className="w-full pl-8 pr-4 py-4 bg-slate-900 rounded-xl text-white font-black outline-none border border-white/10"
                                value={plan.price}
                                onChange={e => {
                                  const newPlans = [...localSettings.verifyPlans];
                                  newPlans[idx].price = parseInt(e.target.value) || 0;
                                  setLocalSettings({...localSettings, verifyPlans: newPlans});
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>

                {/* Boost Pricing Table */}
                <div className="space-y-6 p-8 bg-black/20 rounded-[2.5rem] border border-white/5">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Rocket className="w-4 h-4" /> Boost Ad Plan Management
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {localSettings.boostPlans.map((plan, idx) => (
                      <div key={plan.id} className="bg-slate-900 p-6 rounded-2xl border border-white/10 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-black text-white italic uppercase tracking-tighter">{plan.days} Days</span>
                          <Zap className="text-[#FFD600] w-4 h-4" />
                        </div>
                        <div>
                          <label className="block text-[8px] font-black text-slate-500 uppercase mb-1 tracking-widest">Plan Price</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">৳</span>
                            <input 
                              type="number" 
                              className="w-full pl-6 pr-3 py-3 bg-black/40 rounded-lg text-[#FFD600] font-black outline-none border border-white/5"
                              value={plan.price}
                              onChange={e => {
                                const newPlans = [...localSettings.boostPlans];
                                newPlans[idx].price = parseInt(e.target.value) || 0;
                                setLocalSettings({...localSettings, boostPlans: newPlans});
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4">
               <div className="bg-[#0F172A] p-6 md:p-8 rounded-[3rem] border border-white/5">
                 <div className="relative mb-8">
                   <input 
                    type="text" 
                    placeholder="Search UID, Username or Email..." 
                    className="w-full pl-14 pr-6 py-5 bg-slate-900/50 rounded-2xl border border-white/10 text-white outline-none focus:ring-2 focus:ring-[#FFD600] font-bold"
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                   />
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                 </div>

                 <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                      <thead className="text-[10px] font-black uppercase text-slate-500 border-b border-white/5">
                        <tr>
                          <th className="px-4 py-4">UID</th>
                          <th className="px-4 py-4">Identity</th>
                          <th className="px-4 py-4">Ban Status</th>
                          <th className="px-4 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {mockUsers.filter(u => 
                          u.uid.includes(userSearch) || 
                          u.username.toLowerCase().includes(userSearch.toLowerCase()) || 
                          u.email.toLowerCase().includes(userSearch.toLowerCase())
                        ).map(user => {
                          const isBanned = user.isPermanentlyBanned || (user.banExpiresAt && Date.now() < user.banExpiresAt);
                          return (
                            <tr key={user.uid} className="hover:bg-white/5 transition-colors">
                              <td className="px-4 py-6 font-mono text-[#FFD600] text-sm">{user.uid}</td>
                              <td className="px-4 py-6">
                                <div className="flex flex-col">
                                  <span className="font-black text-white">@{user.username}</span>
                                  <span className="text-xs text-slate-500">{user.email}</span>
                                </div>
                              </td>
                              <td className="px-4 py-6">
                                {isBanned ? (
                                  <div className="flex items-center gap-2 text-red-500">
                                    <ShieldAlert className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Banned</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 text-green-500">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-6 text-right">
                                <div className="relative group/menu inline-block">
                                   <button className="px-4 py-2 bg-slate-800 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#1A237E] transition-all flex items-center gap-2 ml-auto">Actions <ChevronRight className="w-3 h-3" /></button>
                                   <div className="absolute right-0 top-full mt-2 w-56 bg-slate-800 border border-white/10 rounded-2xl shadow-2xl p-2 z-[200] opacity-0 group-hover/menu:opacity-100 pointer-events-none group-hover/menu:pointer-events-auto transition-all">
                                     {isBanned ? (
                                       <button onClick={() => onUpdateUserStatus(user.uid, 'unban')} className="w-full text-left px-4 py-3 hover:bg-green-500/10 text-green-500 text-xs font-bold rounded-xl flex items-center gap-3"><CheckCircle2 className="w-4 h-4" /> Unban Account</button>
                                     ) : (
                                       <>
                                         <button onClick={() => onUpdateUserStatus(user.uid, 'ban_1')} className="w-full text-left px-4 py-3 hover:bg-white/5 text-xs font-bold rounded-xl">Ban for 1 Day</button>
                                         <button onClick={() => onUpdateUserStatus(user.uid, 'ban_3')} className="w-full text-left px-4 py-3 hover:bg-white/5 text-xs font-bold rounded-xl">Ban for 3 Days</button>
                                         <button onClick={() => onUpdateUserStatus(user.uid, 'ban_7')} className="w-full text-left px-4 py-3 hover:bg-white/5 text-xs font-bold rounded-xl">Ban for 7 Days</button>
                                         <button onClick={() => onUpdateUserStatus(user.uid, 'ban_15')} className="w-full text-left px-4 py-3 hover:bg-white/5 text-xs font-bold rounded-xl">Ban for 15 Days</button>
                                         <button onClick={() => onUpdateUserStatus(user.uid, 'ban_30')} className="w-full text-left px-4 py-3 hover:bg-white/5 text-xs font-bold rounded-xl">Ban for 30 Days</button>
                                         <button onClick={() => onUpdateUserStatus(user.uid, 'ban_perm')} className="w-full text-left px-4 py-3 hover:bg-red-500/10 text-red-500 text-xs font-bold rounded-xl flex items-center gap-3 border-t border-white/5 mt-2"><Ban className="w-4 h-4" /> Permanent Ban</button>
                                       </>
                                     )}
                                   </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 flex flex-col h-[70vh]">
               {Array.from(new Set(supportMessages.filter(m => !m.isAdmin).map(m => m.userEmail))).length === 0 ? (
                 <div className="p-20 text-center bg-[#0F172A] rounded-[3rem] text-slate-500 border border-white/5 font-black uppercase italic">Inbox Empty</div>
               ) : (
                 <div className="grid lg:grid-cols-3 gap-8 flex-grow overflow-hidden">
                    <div className="bg-[#0F172A] border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
                       <div className="p-6 border-b border-white/5 font-black text-xs uppercase tracking-widest text-slate-500 flex justify-between items-center">
                         <span>Active Users</span>
                         <span className="bg-[#1A237E] text-white px-2 py-0.5 rounded-full">
                           {Array.from(new Set(supportMessages.filter(m => !m.isAdmin).map(m => m.userEmail))).length}
                         </span>
                       </div>
                       <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                         {Array.from(new Set(supportMessages.filter(m => !m.isAdmin).map(m => m.userEmail))).map(email => (
                           <button key={email} className="w-full p-4 bg-white/5 rounded-2xl text-left hover:bg-[#1A237E] transition-all group border border-transparent hover:border-white/10">
                             <p className="font-bold text-sm text-white group-hover:text-white truncate">{email}</p>
                             <p className="text-[10px] text-slate-500 group-hover:text-blue-200 uppercase tracking-widest mt-1">Status: Open</p>
                           </button>
                         ))}
                       </div>
                    </div>

                    <div className="lg:col-span-2 bg-[#0F172A] border border-white/5 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl">
                       <div className="p-6 border-b border-white/5 bg-black/20 flex justify-between items-center">
                          <span className="font-black uppercase tracking-tighter italic text-[#FFD600] flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Support Terminal</span>
                          <span className="text-[10px] text-slate-500 font-mono">E2EE ACTIVE</span>
                       </div>
                       
                       <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 custom-scrollbar bg-black/10">
                          {supportMessages.map(m => (
                            <div key={m.id} className={`flex ${m.isAdmin ? 'justify-end' : 'justify-start'}`}>
                               <div className={`p-4 md:p-5 rounded-2xl max-w-[95%] md:max-w-[80%] text-sm shadow-xl transition-all hover:scale-[1.01] ${m.isAdmin ? 'bg-[#1A237E] text-white rounded-br-none border border-white/10' : 'bg-slate-800 text-slate-200 rounded-bl-none border border-white/5'}`}>
                                 <p className="leading-relaxed">{m.text}</p>
                                 <div className="flex justify-between items-center mt-3 gap-6">
                                   <p className={`text-[8px] font-black uppercase tracking-widest ${m.isAdmin ? 'text-blue-300' : 'text-slate-500'}`}>{m.timestamp}</p>
                                   {!m.isAdmin && <p className="text-[8px] font-black text-slate-600 truncate max-w-[100px]">{m.userEmail}</p>}
                                 </div>
                               </div>
                            </div>
                          ))}
                       </div>

                       <div className="p-4 md:p-6 bg-slate-900/50 border-t border-white/5">
                          {(() => {
                            const firstEmail = supportMessages.filter(m => !m.isAdmin)[0]?.userEmail;
                            return (
                              <div className="flex gap-4">
                                <input 
                                  type="text" 
                                  placeholder="Type secure reply..." 
                                  className="flex-1 px-4 py-3 md:px-6 md:py-4 bg-slate-800 rounded-2xl text-white outline-none border border-white/10 focus:border-[#FFD600] font-medium"
                                  value={replyText[firstEmail] || ''}
                                  onChange={e => setReplyText({...replyText, [firstEmail]: e.target.value})}
                                  onKeyPress={e => e.key === 'Enter' && firstEmail && handleSendReply(firstEmail)}
                                />
                                <button 
                                  onClick={() => firstEmail && handleSendReply(firstEmail)}
                                  className="p-3 md:p-4 bg-[#FFD600] text-[#1A237E] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl"
                                >
                                  <Send className="w-5 h-5 md:w-6 md:h-6" />
                                </button>
                              </div>
                            );
                          })()}
                       </div>
                    </div>
                 </div>
               )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
