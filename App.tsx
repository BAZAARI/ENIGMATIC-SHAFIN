
import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import AboutUs from './components/AboutUs.tsx';
import TrackOrder from './components/TrackOrder.tsx';
import Messenger from './components/Messenger.tsx';
import BoostPanel from './components/BoostPanel.tsx';
import Wallet from './components/Wallet.tsx';
import Contact from './components/Contact.tsx';
import PostAd from './components/PostAd.tsx';
import AIChat from './components/AIChat.tsx';
import SupportChat from './components/SupportChat.tsx';
import Verification from './components/Verification.tsx';
import ProductDetail from './components/ProductDetail.tsx';
import Cart from './components/Cart.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import Shop from './components/Shop.tsx';
import Checkout from './components/Checkout.tsx';
import Footer from './components/Footer.tsx';
import BottomNav from './components/BottomNav.tsx';
import { Page, User, Product, CartItem, BoostRequest, PostRequest, VerificationRequest, SupportMessage, AdminSettings, Language } from './types.ts';
import { CATEGORIES, PRODUCTS, BOOST_PLANS, VERIFY_PLANS } from './constants.tsx';
import { ArrowRight, Sparkles, X, UserPlus, ShieldCheck, CheckCircle, Headset, Users, UserCheck, MessageSquare, AlertCircle, Lock, Activity, Clock, ShieldEllipsis, RefreshCw, Send, Loader2, BellRing, Copy, Eye, MailCheck } from 'lucide-react';

const PERSISTENCE_KEY = 'bazaari_master_data_v4';
const LAUNCH_DATE = new Date('2026-02-14T00:00:00'); 

const App: React.FC = () => {
  const [uptime, setUptime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [notification, setNotification] = useState<{msg: string, type: 'info' | 'success'} | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = Math.max(0, now.getTime() - LAUNCH_DATE.getTime());
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setUptime({ days: d, hours: h, mins: m, secs: s });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const loadInitialData = () => {
    const saved = localStorage.getItem(PERSISTENCE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      users: [
        { uid: '000001', username: 'shafinadmin', name: 'Shafin Admin', email: 'enigmaticshafin@gmail.com', password: 'SHAFIN@1a', isVerified: true, postCountToday: 0 },
        { uid: '000002', username: 'bazaarihelp', name: 'Bazaari Help', email: 'bazaarihelp@gmail.com', password: 'SHAFIN@1a', isVerified: true, postCountToday: 0 }
      ],
      boostRequests: [],
      postRequests: [],
      verificationRequests: [],
      supportMessages: [],
      approvedProducts: PRODUCTS,
      adminEmails: ['bazaarihelp@gmail.com', 'enigmaticshafin@gmail.com']
    };
  };

  const initialData = loadInitialData();

  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('dark_mode') === 'true');
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('lang') as Language) || 'bn');
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bazaari_active_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [mockUsers, setMockUsers] = useState<User[]>(initialData.users);
  const [boostRequests, setBoostRequests] = useState<BoostRequest[]>(initialData.boostRequests);
  const [postRequests, setPostRequests] = useState<PostRequest[]>(initialData.postRequests);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>(initialData.verificationRequests);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>(initialData.supportMessages);
  const [approvedProducts, setApprovedProducts] = useState<Product[]>(initialData.approvedProducts);
  const [adminEmails, setAdminEmails] = useState<string[]>(initialData.adminEmails);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  
  const [authIdentity, setAuthIdentity] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authUsername, setAuthUsername] = useState('');

  const [showOTPModal, setShowOTPModal] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [userOTP, setUserOTP] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(0);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [isOTPVerifying, setIsOTPVerifying] = useState(false);

  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    freePostLimit: 3,
    extraPostPrice: 100,
    extraImagePrice: 50,
    boostPlans: [...BOOST_PLANS],
    verifyPlans: [...VERIFY_PLANS]
  });

  useEffect(() => {
    const data = { users: mockUsers, boostRequests, postRequests, verificationRequests, supportMessages, approvedProducts, adminEmails };
    localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(data));
  }, [mockUsers, boostRequests, postRequests, verificationRequests, supportMessages, approvedProducts, adminEmails]);

  useEffect(() => {
    localStorage.setItem('bazaari_active_user', currentUser ? JSON.stringify(currentUser) : '');
    localStorage.setItem('dark_mode', isDarkMode.toString());
    localStorage.setItem('lang', language);
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [currentUser, isDarkMode, language]);

  useEffect(() => {
    let interval: any;
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const sendSimulatedOTP = (email: string) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(otp);
    setOtpTimer(60); // Extended timer for better UX
    
    setNotification({
      msg: `[GMAIL SIMULATION] To: ${email} | 6-Digit Code: ${otp}`,
      type: 'info'
    });
    
    setTimeout(() => setNotification(null), 12000);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      if (!/^[a-z0-9]+$/i.test(authUsername)) {
        alert(language === 'bn' ? 'ইউজারনেমে শুধু ছোট হাতের অক্ষর এবং সংখ্যা ব্যবহার করুন।' : 'Use only lowercase letters and numbers in username.');
        return;
      }
      if (mockUsers.some(u => u.username.toLowerCase() === authUsername.toLowerCase())) {
        alert(language === 'bn' ? 'এই ইউজারনেমটি ইতিমধ্যে ব্যবহৃত হয়েছে।' : 'Username already taken.');
        return;
      }
      
      const nextUid = (mockUsers.length + 1).toString().padStart(6, '0');
      const newUser: User = {
        uid: nextUid,
        username: authUsername.toLowerCase(),
        password: authPassword,
        name: authName,
        email: authIdentity.toLowerCase(),
        isVerified: false,
        postCountToday: 0
      };
      setPendingUser(newUser);
      sendSimulatedOTP(newUser.email);
    } else {
      const user = mockUsers.find(u => 
        (u.email.toLowerCase() === authIdentity.toLowerCase() || u.username.toLowerCase() === authIdentity.toLowerCase()) && 
        u.password === authPassword
      );

      if (user) {
        if (user.isPermanentlyBanned) {
          alert(language === 'bn' ? 'আপনার অ্যাকাউন্টটি স্থায়ীভাবে ব্যান করা হয়েছে।' : 'Account permanently banned.');
          return;
        }
        setPendingUser(user);
        sendSimulatedOTP(user.email);
      } else {
        alert(language === 'bn' ? 'ভুল তথ্য! সঠিক ইমেইল/ইউজারনেম ও পাসওয়ার্ড দিন।' : 'Invalid credentials. Please check your email/username and password.');
        return;
      }
    }
    setShowLoginModal(false);
    setShowOTPModal(true);
    setUserOTP(['', '', '', '', '', '']);
  };

  const verifyOTP = () => {
    const enteredOTP = userOTP.join('');
    if (enteredOTP === generatedOTP) {
      setIsOTPVerifying(true);
      setTimeout(() => {
        if (isSignup && pendingUser) {
          setMockUsers(prev => [...prev, pendingUser]);
        }
        setCurrentUser(pendingUser);
        setShowOTPModal(false);
        setIsOTPVerifying(false);
        setPendingUser(null);
        setNotification({ msg: language === 'bn' ? 'ভেরিফিকেশন সফল হয়েছে! স্বাগতম।' : 'Verification Successful! Welcome to Bazaari.', type: 'success' });
        setTimeout(() => setNotification(null), 3000);
        setAuthIdentity(''); setAuthPassword(''); setAuthName(''); setAuthUsername('');
      }, 1500);
    } else {
      alert(language === 'bn' ? 'ভুল ওটিপি কোড! অনুগ্রহ করে আপনার জিমেইল ইনবক্স চেক করুন।' : 'Invalid OTP Code! Please check your Gmail inbox again.');
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOTP = [...userOTP];
    newOTP[index] = value;
    setUserOTP(newOTP);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleUpdateUserStatus = (uid: string, action: string) => {
    setMockUsers(prev => prev.map(u => {
      if (u.uid !== uid) return u;
      let banExpiresAt = null;
      let isPermanentlyBanned = false;
      if (action === 'ban_1') banExpiresAt = Date.now() + 1 * 24 * 60 * 60 * 1000;
      else if (action === 'ban_3') banExpiresAt = Date.now() + 3 * 24 * 60 * 60 * 1000;
      else if (action === 'ban_7') banExpiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
      else if (action === 'ban_15') banExpiresAt = Date.now() + 15 * 24 * 60 * 60 * 1000;
      else if (action === 'ban_30') banExpiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
      else if (action === 'ban_perm') isPermanentlyBanned = true;

      const updated = { ...u, banExpiresAt, isPermanentlyBanned };
      if (currentUser && currentUser.uid === uid && action !== 'unban') setCurrentUser(null);
      return updated;
    }));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage(Page.Home);
    setNotification({ msg: language === 'bn' ? 'সফলভাবে লগ আউট হয়েছে।' : 'Logged out successfully.', type: 'info' });
    setTimeout(() => setNotification(null), 3000);
  };

  const navigateTo = (page: Page) => {
    const protectedPages = [Page.PostAd, Page.Boost, Page.Verification, Page.Wallet, Page.Cart, Page.Messenger, Page.AIChat, Page.SupportChat];
    if (protectedPages.includes(page) && !currentUser) {
      setShowLoginModal(true);
      return;
    }
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 pb-20 lg:pb-0 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {notification && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[300] w-full max-w-sm px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-top duration-300 ${notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-[#1A237E] text-[#FFD600] border border-[#FFD600]/30'}`}>
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
             {notification.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <BellRing className="w-6 h-6 animate-swing" />}
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Bazaari Identity System</p>
            <p className="font-bold text-sm">{notification.msg}</p>
          </div>
          <button onClick={() => setNotification(null)} className="p-1 hover:bg-white/10 rounded-lg"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Live Runtime Counter Bar */}
      <div className="bg-[#1A237E] text-white py-2 px-4 border-b border-[#FFD600]/30 shadow-2xl relative z-[100] flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse pointer-events-none"></div>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#FFD600] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FFD600]">Bazaari Official Live Status:</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
             <span className="text-sm md:text-lg font-black font-mono leading-none tracking-tighter">{uptime.days.toString().padStart(3, '0')}</span>
             <span className="text-[8px] font-bold uppercase opacity-60">Days</span>
          </div>
          <span className="font-black text-[#FFD600] mb-2">:</span>
          <div className="flex flex-col items-center">
             <span className="text-sm md:text-lg font-black font-mono leading-none tracking-tighter">{uptime.hours.toString().padStart(2, '0')}</span>
             <span className="text-[8px] font-bold uppercase opacity-60">Hours</span>
          </div>
          <span className="font-black text-[#FFD600] mb-2">:</span>
          <div className="flex flex-col items-center">
             <span className="text-sm md:text-lg font-black font-mono leading-none tracking-tighter">{uptime.mins.toString().padStart(2, '0')}</span>
             <span className="text-[8px] font-bold uppercase opacity-60">Mins</span>
          </div>
          <span className="font-black text-[#FFD600] mb-2 text-xs animate-ping">:</span>
          <div className="flex flex-col items-center">
             <span className="text-sm md:text-lg font-black font-mono leading-none tracking-tighter text-[#FFD600]">{uptime.secs.toString().padStart(2, '0')}</span>
             <span className="text-[8px] font-bold uppercase opacity-60">Secs</span>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-1.5 ml-4 px-3 py-0.5 bg-green-500/10 rounded-full border border-green-500/20">
           <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
           <span className="text-[8px] font-black uppercase text-green-400">Systems Operational</span>
        </div>
      </div>

      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={navigateTo} 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        language={language} 
        setLanguage={setLanguage} 
        cartCount={cart.length} 
        user={currentUser} 
        onLoginClick={() => { setIsSignup(false); setShowLoginModal(true); }} 
        onSignupClick={() => { setIsSignup(true); setShowLoginModal(true); }} 
        onLogout={handleLogout}
      />
      
      <main className="flex-grow">
        {currentPage === Page.AdminLogin ? (
          <div className="fixed inset-0 z-[200] bg-[#070B14] flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-white/10 p-12 rounded-[3.5rem] w-full max-w-md shadow-2xl text-center">
              <div className="w-20 h-20 bg-[#FFD600]/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <Lock className="text-[#FFD600] w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-white mb-8 italic uppercase text-center">Admin Access</h2>
              <form onSubmit={(e) => { e.preventDefault(); if(authPassword === 'SHAFIN@1a') setCurrentPage(Page.Admin); else alert('Access Denied'); }} className="space-y-4">
                <input type="password" placeholder="Enter Security Key" className="w-full px-6 py-5 bg-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#FFD600] text-center font-black" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required />
                <button type="submit" className="w-full py-5 bg-[#FFD600] text-[#1A237E] font-black rounded-2xl shadow-xl hover:scale-105 transition-all uppercase">Open Dashboard</button>
              </form>
              <button onClick={() => setCurrentPage(Page.Home)} className="mt-8 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white">Back to Home</button>
            </div>
          </div>
        ) : currentPage === Page.Admin ? (
          <AdminPanel 
            onClose={() => setCurrentPage(Page.Home)} 
            currentUser={currentUser} 
            language={language} 
            boostRequests={boostRequests} 
            postRequests={postRequests} 
            verificationRequests={verificationRequests} 
            supportMessages={supportMessages} 
            settings={adminSettings} 
            adminEmails={adminEmails} 
            mockUsers={mockUsers}
            onUpdateUserStatus={handleUpdateUserStatus}
            onUpdateSettings={setAdminSettings} 
            onAddAdminEmail={(email) => setAdminEmails(prev => Array.from(new Set([...prev, email.toLowerCase()])))} 
            onUpdateBoost={(id, status) => setBoostRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r))} 
            onUpdatePost={(id, status) => setPostRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r))} 
            onUpdateVerification={(id, status) => setVerificationRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r))} 
            onAdminReply={(email, text) => {
               const newMessage = { id: Date.now().toString(), userEmail: email, userName: 'Admin', text, timestamp: new Date().toLocaleTimeString(), isAdmin: true, isRead: false };
               setSupportMessages(prev => [...prev, newMessage]);
            }} 
          />
        ) : currentPage === Page.AIChat ? (
          <AIChat onNavigateToAdmin={() => setCurrentPage(Page.AdminLogin)} />
        ) : currentPage === Page.Wallet ? (
          <Wallet user={currentUser} onUserUpdate={(u) => { setCurrentUser(u); setMockUsers(prev => prev.map(m => m.uid === u.uid ? u : m)); }} language={language} onVerifySubmit={(req) => setVerificationRequests(prev => [req, ...prev])} onLogout={handleLogout} />
        ) : (
          <>
            {currentPage === Page.Home && <Hero language={language} setCurrentPage={navigateTo} setSelectedProduct={setSelectedProduct} boostedProducts={approvedProducts.filter(p => p.isFeatured)} />}
            {currentPage === Page.Shop && <Shop language={language} products={approvedProducts} adminEmails={adminEmails} addToCart={(p) => setCart(prev => [...prev, {product: p, quantity: 1}])} onProductClick={(p) => { setSelectedProduct(p); setCurrentPage(Page.ProductDetail); }} />}
            {currentPage === Page.PostAd && <PostAd language={language} isLoggedIn={!!currentUser} isVerified={currentUser?.isVerified || false} userName={currentUser?.name || ''} userEmail={currentUser?.email} postCountToday={currentUser?.postCountToday || 0} settings={adminSettings} onPostSubmit={(r) => setPostRequests(prev => [r, ...prev])} onBoostClick={(p) => navigateTo(Page.Boost)} onLoginRequired={() => setShowLoginModal(true)} />}
            {currentPage === Page.SupportChat && <SupportChat messages={supportMessages.filter(m => m.userEmail === currentUser?.email)} onSend={(text) => setSupportMessages(prev => [...prev, { id: Date.now().toString(), userEmail: currentUser!.email, userName: currentUser!.name, text, timestamp: new Date().toLocaleTimeString(), isAdmin: false, isRead: false }])} onClose={() => setCurrentPage(Page.Home)} />}
            {currentPage === Page.ProductDetail && selectedProduct && <ProductDetail product={selectedProduct} addToCart={(p) => setCart(prev => [...prev, {product: p, quantity: 1}])} onLoginRequired={() => setShowLoginModal(true)} adminEmails={adminEmails} />}
            {currentPage === Page.Cart && <Cart items={cart} setItems={setCart} setCurrentPage={navigateTo} language={language} />}
            {currentPage === Page.Home && (
              <section className="py-20 bg-slate-50 dark:bg-slate-950">
                <div className="max-w-7xl mx-auto px-4 text-center">
                  <h2 className="text-3xl font-black mb-12 dark:text-white uppercase italic tracking-tighter">জনপ্রিয় ক্যাটাগরি</h2>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                    {CATEGORIES.map(cat => (
                      <div key={cat.id} onClick={() => navigateTo(Page.Shop)} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm cursor-pointer hover:scale-105 transition-all border border-slate-100 dark:border-slate-800 group">
                          <div className="text-4xl mb-4 group-hover:animate-bounce">{cat.icon}</div>
                          <span className="font-black dark:text-white uppercase tracking-tighter text-xs">{cat.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
            {currentPage === Page.Home && <AboutUs language={language} />}
          </>
        )}
      </main>

      <button onClick={() => navigateTo(Page.AIChat)} className="fixed bottom-24 right-6 lg:bottom-10 lg:right-10 z-[80] w-16 h-16 bg-[#1A237E] text-[#FFD600] rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-4 border-white dark:border-slate-800 animate-glow group">
        <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform" />
      </button>

      <Footer language={language} setCurrentPage={navigateTo} onAdminClick={() => setCurrentPage(Page.AdminLogin)} />
      <BottomNav language={language} currentPage={currentPage} setCurrentPage={navigateTo} cartCount={cart.length} />

      {/* Auth Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-10 border-4 border-[#1A237E] relative animate-in zoom-in">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-red-500 transition-colors"><X className="w-8 h-8" /></button>
            <div className="text-center mb-8">
               <h3 className="text-3xl font-black text-[#1A237E] dark:text-white uppercase italic tracking-tighter">{isSignup ? 'Signup' : 'Welcome Back'}</h3>
            </div>
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isSignup && <input type="text" placeholder="Full Name" className="w-full px-6 py-4 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl outline-none font-bold border-2 border-transparent focus:border-[#1A237E]" value={authName} onChange={e => setAuthName(e.target.value)} required />}
              {isSignup && <input type="text" placeholder="Username (abcd...z0..9)" className="w-full px-6 py-4 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl outline-none font-bold border-2 border-transparent focus:border-[#1A237E]" value={authUsername} onChange={e => setAuthUsername(e.target.value)} required />}
              <input type="text" placeholder={isSignup ? "Email Address (Gmail)" : "Email or Username"} className="w-full px-6 py-4 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl outline-none font-bold border-2 border-transparent focus:border-[#1A237E]" value={authIdentity} onChange={e => setAuthIdentity(e.target.value)} required />
              <input type="password" placeholder="Password" className="w-full px-6 py-4 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl outline-none font-bold border-2 border-transparent focus:border-[#1A237E]" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required />
              <button type="submit" className="w-full py-5 bg-[#1A237E] text-[#FFD600] font-black rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 text-lg uppercase">{isSignup ? 'Join Now' : 'Login'}</button>
            </form>
            <div className="mt-8 text-center">
               <button onClick={() => setIsSignup(!isSignup)} className="text-sm font-bold text-slate-500 hover:text-[#1A237E] transition-colors">
                 {isSignup ? 'Already have an account? Login' : "Don't have an account? Create one"}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced OTP Verification Modal with 6-Digit Support */}
      {showOTPModal && (
        <div className="fixed inset-0 z-[150] bg-[#070B14]/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-slate-900 border-4 border-[#FFD600] p-10 md:p-14 rounded-[4rem] w-full max-w-lg shadow-[0_0_50px_rgba(255,214,0,0.3)] text-center relative overflow-hidden animate-in zoom-in">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#FFD600] to-transparent animate-pulse"></div>
             
             <div className="w-24 h-24 bg-[#FFD600]/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-[#FFD600]/20 rotate-3">
                <MailCheck className="text-[#FFD600] w-12 h-12" />
             </div>

             <h2 className="text-3xl font-black text-white mb-2 italic uppercase tracking-tighter">Email Verification</h2>
             <p className="text-slate-400 text-sm mb-10 font-medium px-4">
               {language === 'bn' 
                ? 'আপনার জিমেইল ইনবক্সে একটি ৬ ডিজিটের ভেরিফিকেশন কোড পাঠানো হয়েছে।' 
                : 'A 6-digit verification code has been sent to your Gmail inbox.'}
               <br />
               <span className="text-[#FFD600] font-black">{pendingUser?.email}</span>
             </p>

             <div className="flex justify-between gap-2 mb-10">
                {userOTP.map((digit, idx) => (
                  <input 
                    key={idx}
                    id={`otp-${idx}`}
                    type="number"
                    maxLength={1}
                    className="w-12 h-16 md:w-16 md:h-20 bg-slate-800 border-2 border-white/5 rounded-2xl text-white text-3xl font-black text-center outline-none focus:border-[#FFD600] focus:ring-4 focus:ring-[#FFD600]/10 transition-all"
                    value={digit}
                    onChange={e => handleOTPChange(idx, e.target.value)}
                  />
                ))}
             </div>

             <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <AlertCircle className="text-[#FFD600] w-5 h-5" />
                   <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Debug Mode Code:</span>
                </div>
                <span className="font-mono font-black text-[#FFD600] text-xl tracking-widest">{generatedOTP}</span>
                <button onClick={() => navigator.clipboard.writeText(generatedOTP)} className="p-2 hover:bg-white/10 rounded-lg text-white"><Copy className="w-4 h-4" /></button>
             </div>

             <button 
               onClick={verifyOTP}
               disabled={userOTP.some(d => !d) || isOTPVerifying}
               className="w-full py-5 bg-[#FFD600] text-[#1A237E] font-black rounded-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all text-xl uppercase italic flex items-center justify-center gap-3 disabled:opacity-50"
             >
               {isOTPVerifying ? <Loader2 className="animate-spin" /> : <><ShieldCheck className="w-6 h-6" /> Confirm & Activate</>}
             </button>

             <div className="mt-8 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                   <Clock className="w-4 h-4" /> 
                   {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Code expired'}
                </div>
                
                <button 
                  onClick={() => pendingUser && sendSimulatedOTP(pendingUser.email)}
                  disabled={otpTimer > 0}
                  className="text-[#FFD600] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 ${otpTimer === 0 ? 'animate-spin' : ''}`} /> Resend to Gmail
                </button>
             </div>

             <button 
               onClick={() => { setShowOTPModal(false); setPendingUser(null); }}
               className="mt-10 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
             >
               Cancel & Go Back
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
