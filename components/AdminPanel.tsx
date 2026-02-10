
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Settings, LogOut, Rocket, 
  ClipboardList, Bell, MessageSquare, Wrench, ShieldCheck, Check, X as CloseIcon, Eye, Lock, Mail, Trash2, Plus, UserPlus, UserCheck, Image as ImageIcon, Menu, Send, Clock, Users as UsersIcon, Ban, ShieldAlert, CheckCircle2
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
  const [loginEmail, setLoginEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'posts' | 'boost' | 'support' | 'settings' | 'admins' | 'verifications' | 'users'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  useEffect(() => {
    if (currentUser && adminEmails.includes(currentUser.email.toLowerCase())) {
      setIsAuthenticated(true);
    }
  }, [currentUser, adminEmails]);

  const navItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: <LayoutDashboard className="w-5 h-5" />, count: 0 },
    { id: 'users', label: 'USERS', icon: <UsersIcon className="w-5 h-5" />, count: mockUsers.length },
    { id: 'posts', label: 'PENDING ADS', icon: <ClipboardList className="w-5 h-5" />, count: postRequests.filter(r => r.status === 'pending').length },
    { id: 'boost', label: 'BOOST LIST', icon: <Rocket className="w-5 h-5" />, count: boostRequests.filter(r => r.status === 'pending').length },
    { id: 'verifications', label: 'NID VERIFY', icon: <ShieldCheck className="w-5 h-5" />, count: verificationRequests.filter(r => r.status === 'pending').length },
    { id: 'support', label: 'SUPPORT INBOX', icon: <MessageSquare className="w-5 h-5" />, count: supportMessages.filter(m => !m.isAdmin && !m.isRead).length },
    { id: 'settings', label: 'CONFIGURATION', icon: <Settings className="w-5 h-5" />, count: 0 },
  ];

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#070B14] flex items-center justify-center p-4">
        <div className="bg-slate-900/50 backdrop-blur-3xl border border-white/10 p-12 rounded-[3.5rem] w-full max-w-md shadow-2xl text-center">
          <h2 className="text-3xl font-black text-white mb-8 tracking-tight italic uppercase">Admin Area</h2>
          <form onSubmit={(e) => { e.preventDefault(); if(password === 'SHAFIN@1a') setIsAuthenticated(true); else alert('Wrong password'); }} className="space-y-4">
            <input type="password" placeholder="Password" className="w-full px-6 py-5 bg-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#FFD600]" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" className="w-full py-5 bg-[#FFD600] text-[#1A237E] font-black rounded-2xl shadow-xl">ENTER PANEL</button>
          </form>
          <button onClick={onClose} className="mt-8 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white">GO BACK</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-200 flex flex-col lg:flex-row overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-[#0F172A] border-r border-white/5 flex flex-col p-8 z-[100] transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <nav className="space-y-2 flex-grow overflow-y-auto">
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
        <button onClick={onClose} className="mt-auto flex items-center gap-4 px-6 py-4 text-red-500 font-bold hover:bg-red-500/10 rounded-2xl text-sm">
          <LogOut className="w-5 h-5" /> EXIT PANEL
        </button>
      </aside>

      <main className="flex-1 lg:ml-72 p-6 md:p-12 overflow-y-auto h-screen">
        <header className="mb-10">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 uppercase tracking-tighter italic">{activeTab.replace('_', ' ')}</h1>
        </header>

        <div className="max-w-6xl mx-auto pb-20">
          {activeTab === 'users' && (
            <div className="space-y-6">
               <div className="bg-[#0F172A] rounded-[2rem] border border-white/5 overflow-hidden">
                 <table className="w-full text-left">
                   <thead className="bg-black/20 text-[10px] font-black uppercase tracking-widest text-slate-500">
                     <tr>
                       <th className="px-6 py-4">UID</th>
                       <th className="px-6 py-4">User Details</th>
                       <th className="px-6 py-4">Status</th>
                       <th className="px-6 py-4 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                     {mockUsers.map(user => {
                       const isBanned = user.isPermanentlyBanned || (user.banExpiresAt && Date.now() < user.banExpiresAt);
                       return (
                        <tr key={user.uid} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-mono text-[#FFD600] text-sm">{user.uid}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-white">@{user.username}</span>
                              <span className="text-xs text-slate-500">{user.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {isBanned ? (
                              <span className="px-3 py-1 bg-red-500/20 text-red-500 text-[10px] font-black rounded-full border border-red-500/20">BANNED</span>
                            ) : (
                              <span className="px-3 py-1 bg-green-500/20 text-green-500 text-[10px] font-black rounded-full border border-green-500/20">ACTIVE</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                             <div className="relative group/menu inline-block">
                               <button className="p-2 bg-slate-800 rounded-xl hover:bg-[#1A237E] transition-all">
                                 <Settings className="w-4 h-4" />
                               </button>
                               <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-white/10 rounded-2xl shadow-2xl p-2 z-[200] opacity-0 group-hover/menu:opacity-100 pointer-events-none group-hover/menu:pointer-events-auto transition-all">
                                 {isBanned ? (
                                   <button onClick={() => onUpdateUserStatus(user.uid, 'unban')} className="w-full text-left px-4 py-2 hover:bg-green-500/20 text-green-500 text-xs font-bold rounded-xl flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Unban User</button>
                                 ) : (
                                   <>
                                     <button onClick={() => onUpdateUserStatus(user.uid, 'ban_1')} className="w-full text-left px-4 py-2 hover:bg-white/5 text-xs font-bold rounded-xl">Ban for 1 Day</button>
                                     <button onClick={() => onUpdateUserStatus(user.uid, 'ban_7')} className="w-full text-left px-4 py-2 hover:bg-white/5 text-xs font-bold rounded-xl">Ban for 7 Days</button>
                                     <button onClick={() => onUpdateUserStatus(user.uid, 'ban_perm')} className="w-full text-left px-4 py-2 hover:bg-red-500/20 text-red-500 text-xs font-bold rounded-xl flex items-center gap-2"><Ban className="w-4 h-4" /> Permanent Ban</button>
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
          )}

          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#0F172A] p-8 rounded-[2.5rem] border border-white/5">
                <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-4">Total Users</p>
                <h2 className="text-5xl font-black text-white">{mockUsers.length}</h2>
              </div>
              <div className="bg-[#0F172A] p-8 rounded-[2.5rem] border border-white/5">
                <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-4">Pending Ads</p>
                <h2 className="text-5xl font-black text-[#FFD600]">{postRequests.filter(r => r.status === 'pending').length}</h2>
              </div>
              <div className="bg-[#0F172A] p-8 rounded-[2.5rem] border border-white/5">
                <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-4">Banned Accounts</p>
                <h2 className="text-5xl font-black text-red-500">
                  {mockUsers.filter(u => u.isPermanentlyBanned || (u.banExpiresAt && Date.now() < u.banExpiresAt)).length}
                </h2>
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="space-y-6">
              {Array.from(new Set(supportMessages.filter(m => !m.isAdmin).map(m => m.userEmail))).map(email => (
                <div key={email} className="bg-[#0F172A] p-8 rounded-[3rem] border border-white/5">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-[#1A237E] rounded-full flex items-center justify-center text-[#FFD600] font-black">{email[0].toUpperCase()}</div>
                    <h4 className="font-bold text-white">{email}</h4>
                  </div>
                  <div className="space-y-4 max-h-48 overflow-y-auto p-4 bg-black/20 rounded-2xl mb-6">
                    {supportMessages.filter(m => m.userEmail === email).map(m => (
                      <div key={m.id} className={`flex ${m.isAdmin ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-4 rounded-xl max-w-[80%] text-sm ${m.isAdmin ? 'bg-[#1A237E]' : 'bg-slate-800'}`}>{m.text}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <input type="text" placeholder="Reply..." className="flex-1 bg-slate-800 rounded-2xl p-4 outline-none border border-white/5" value={replyText[email] || ''} onChange={e => setReplyText({...replyText, [email]: e.target.value})} />
                    <button onClick={() => { onAdminReply(email, replyText[email]); setReplyText({...replyText, [email]: ''}); }} className="p-4 bg-[#FFD600] text-[#1A237E] rounded-2xl"><Send /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
