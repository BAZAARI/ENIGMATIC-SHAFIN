
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
import { ArrowRight, Sparkles, X, UserPlus, ShieldCheck, CheckCircle, Headset, Users, UserCheck, MessageSquare, AlertCircle, Lock } from 'lucide-react';

const PERSISTENCE_KEY = 'bazaari_master_data_v4';

const App: React.FC = () => {
  // Load everything from LocalStorage
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
  
  // Auth Form State
  const [authIdentity, setAuthIdentity] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authUsername, setAuthUsername] = useState('');

  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    freePostLimit: 3,
    extraPostPrice: 100,
    extraImagePrice: 50,
    boostPlans: [...BOOST_PLANS],
    verifyPlans: [...VERIFY_PLANS]
  });

  // Persist data on every change
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

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      if (!/^[a-z0-9]+$/i.test(authUsername)) {
        alert(language === 'bn' ? 'ইউজারনেমে শুধু ছোট হাতের অক্ষর এবং সংখ্যা ব্যবহার করুন (কোনো স্পেস বা চিহ্ন ছাড়া)।' : 'Use only lowercase letters and numbers in username (no spaces/symbols).');
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

      setMockUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      setIsSignup(false);
    } else {
      const user = mockUsers.find(u => 
        (u.email.toLowerCase() === authIdentity.toLowerCase() || u.username.toLowerCase() === authIdentity.toLowerCase()) && 
        u.password === authPassword
      );

      if (user) {
        const now = Date.now();
        if (user.isPermanentlyBanned) {
          alert(language === 'bn' ? 'আপনার অ্যাকাউন্টটি স্থায়ীভাবে ব্যান করা হয়েছে।' : 'Account permanently banned.');
          return;
        }
        if (user.banExpiresAt && now < user.banExpiresAt) {
          const timeLeft = Math.ceil((user.banExpiresAt - now) / (1000 * 60 * 60 * 24));
          alert(language === 'bn' ? `আপনার অ্যাকাউন্টটি ব্যান করা হয়েছে। মেয়াদ শেষ হতে ${timeLeft} দিন বাকি।` : `Account banned. ${timeLeft} days remaining.`);
          return;
        }
        setCurrentUser(user);
      } else {
        alert(language === 'bn' ? 'ভুল তথ্য!' : 'Invalid credentials');
        return;
      }
    }
    setShowLoginModal(false);
    setAuthIdentity(''); setAuthPassword(''); setAuthName(''); setAuthUsername('');
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
      <Navbar currentPage={currentPage} setCurrentPage={navigateTo} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} language={language} setLanguage={setLanguage} cartCount={cart.length} user={currentUser} onLoginClick={() => { setIsSignup(false); setShowLoginModal(true); }} onSignupClick={() => { setIsSignup(true); setShowLoginModal(true); }} />
      
      <main className="flex-grow">
        {currentPage === Page.AdminLogin ? (
          <div className="fixed inset-0 z-[200] bg-[#070B14] flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-white/10 p-12 rounded-[3.5rem] w-full max-w-md shadow-2xl text-center">
              <div className="w-20 h-20 bg-[#FFD600]/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <Lock className="text-[#FFD600] w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-white mb-8 italic uppercase">Admin Access</h2>
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
          <Wallet user={currentUser} onUserUpdate={(u) => { setCurrentUser(u); setMockUsers(prev => prev.map(m => m.uid === u.uid ? u : m)); }} language={language} onVerifySubmit={(req) => setVerificationRequests(prev => [req, ...prev])} onLogout={() => setCurrentUser(null)} />
        ) : (
          // Standard Content Mapping
          <>
            {currentPage === Page.Home && <Hero language={language} setCurrentPage={navigateTo} setSelectedProduct={setSelectedProduct} boostedProducts={approvedProducts.filter(p => p.isFeatured)} />}
            {currentPage === Page.Shop && <Shop language={language} products={approvedProducts} adminEmails={adminEmails} addToCart={(p) => setCart(prev => [...prev, {product: p, quantity: 1}])} onProductClick={(p) => { setSelectedProduct(p); setCurrentPage(Page.ProductDetail); }} />}
            {currentPage === Page.PostAd && <PostAd language={language} isLoggedIn={!!currentUser} isVerified={currentUser?.isVerified || false} userName={currentUser?.name || ''} userEmail={currentUser?.email} postCountToday={currentUser?.postCountToday || 0} settings={adminSettings} onPostSubmit={(r) => setPostRequests(prev => [r, ...prev])} onBoostClick={(p) => navigateTo(Page.Boost)} onLoginRequired={() => setShowLoginModal(true)} />}
            {currentPage === Page.SupportChat && <SupportChat messages={supportMessages.filter(m => m.userEmail === currentUser?.email)} onSend={(text) => setSupportMessages(prev => [...prev, { id: Date.now().toString(), userEmail: currentUser!.email, userName: currentUser!.name, text, timestamp: new Date().toLocaleTimeString(), isAdmin: false, isRead: false }])} onClose={() => setCurrentPage(Page.Home)} />}
            {currentPage === Page.ProductDetail && selectedProduct && <ProductDetail product={selectedProduct} addToCart={(p) => setCart(prev => [...prev, {product: p, quantity: 1}])} onLoginRequired={() => setShowLoginModal(true)} adminEmails={adminEmails} />}
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
              <input type="text" placeholder={isSignup ? "Email Address" : "Email or Username"} className="w-full px-6 py-4 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl outline-none font-bold border-2 border-transparent focus:border-[#1A237E]" value={authIdentity} onChange={e => setAuthIdentity(e.target.value)} required />
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
    </div>
  );
};

export default App;
