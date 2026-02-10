
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
import { ArrowRight, Sparkles, X, UserPlus, ShieldCheck, CheckCircle, Headset, Users, UserCheck, MessageSquare, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'bazaari_persistent_data_v2';

const App: React.FC = () => {
  // Load from LocalStorage or default
  const getInitialData = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      users: [
        { uid: '000000', username: 'shafinadmin', name: 'Shafin Admin', email: 'enigmaticshafin@gmail.com', password: 'SHAFIN@1a', isVerified: true, postCountToday: 0 },
        { uid: '000001', username: 'bazaarihelp', name: 'Bazaari Help', email: 'bazaarihelp@gmail.com', password: 'SHAFIN@1a', isVerified: true, postCountToday: 0 }
      ],
      boostRequests: [],
      postRequests: [],
      verificationRequests: [],
      supportMessages: [],
      approvedProducts: PRODUCTS,
      adminEmails: ['bazaarihelp@gmail.com', 'enigmaticshafin@gmail.com']
    };
  };

  const initialData = getInitialData();

  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<Language>('bn');
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const user = localStorage.getItem('bazaari_current_user');
    return user ? JSON.parse(user) : null;
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [showToLetSelector, setShowToLetSelector] = useState(false);
  const [toLetFilter, setToLetFilter] = useState<'Bachelor' | 'Family' | null>(null);
  const adminClickCount = useRef(0);
  const adminClickTimer = useRef<any>(null);

  // Persistence States
  const [mockUsers, setMockUsers] = useState<User[]>(initialData.users);
  const [boostRequests, setBoostRequests] = useState<BoostRequest[]>(initialData.boostRequests);
  const [postRequests, setPostRequests] = useState<PostRequest[]>(initialData.postRequests);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>(initialData.verificationRequests);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>(initialData.supportMessages);
  const [approvedProducts, setApprovedProducts] = useState<Product[]>(initialData.approvedProducts);
  const [adminEmails, setAdminEmails] = useState<string[]>(initialData.adminEmails);

  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    freePostLimit: 3,
    extraPostPrice: 100,
    extraImagePrice: 50,
    boostPlans: [...BOOST_PLANS],
    verifyPlans: [...VERIFY_PLANS]
  });

  // Auth States
  const [authIdentity, setAuthIdentity] = useState(''); // Email or Username
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authUsername, setAuthUsername] = useState('');

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    const dataToSave = {
      users: mockUsers,
      boostRequests,
      postRequests,
      verificationRequests,
      supportMessages,
      approvedProducts,
      adminEmails
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [mockUsers, boostRequests, postRequests, verificationRequests, supportMessages, approvedProducts, adminEmails]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bazaari_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('bazaari_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      // Validate username: only alphanumeric
      if (!/^[a-z0-9]+$/i.test(authUsername)) {
        alert(language === 'bn' ? 'ইউজারনেম শুধুমাত্র অক্ষর এবং সংখ্যা হতে পারবে (Space বা চিহ্ন ছাড়া)।' : 'Username can only contain letters and numbers (no spaces/symbols).');
        return;
      }
      // Check uniqueness
      if (mockUsers.some(u => u.username.toLowerCase() === authUsername.toLowerCase())) {
        alert(language === 'bn' ? 'এই ইউজারনেমটি ইতিমধ্যে ব্যবহৃত হয়েছে।' : 'Username already taken.');
        return;
      }
      if (mockUsers.some(u => u.email.toLowerCase() === authIdentity.toLowerCase())) {
        alert(language === 'bn' ? 'এই ইমেইলটি ইতিমধ্যে ব্যবহৃত হয়েছে।' : 'Email already taken.');
        return;
      }

      const nextUid = (mockUsers.length).toString().padStart(6, '0');
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
      // Fix: Removed non-existent 'identity' property check and only rely on email/username for authentication
      const user = mockUsers.find(u => 
        (u.email.toLowerCase() === authIdentity.toLowerCase() ||
         u.username.toLowerCase() === authIdentity.toLowerCase()) && 
        u.password === authPassword
      );

      if (user) {
        // Check Ban
        const now = Date.now();
        if (user.isPermanentlyBanned) {
          alert(language === 'bn' ? 'আপনার অ্যাকাউন্টটি স্থায়ীভাবে ব্যান করা হয়েছে।' : 'Your account has been permanently banned.');
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
    setAuthIdentity('');
    setAuthPassword('');
    setAuthName('');
    setAuthUsername('');
  };

  const handleUpdateUserStatus = (uid: string, action: 'unban' | 'ban_1' | 'ban_3' | 'ban_7' | 'ban_15' | 'ban_30' | 'ban_perm') => {
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
      // If banning the current user, log them out
      if (currentUser && currentUser.uid === uid) {
         setCurrentUser(null);
      }
      return updated;
    }));
  };

  const handleLogoClick = () => {
    if (adminClickTimer.current) clearTimeout(adminClickTimer.current);
    adminClickCount.current++;
    if (adminClickCount.current >= 5) {
      setCurrentPage(Page.Admin);
      adminClickCount.current = 0;
    } else {
      adminClickTimer.current = setTimeout(() => adminClickCount.current = 0, 2000);
    }
  };

  const navigateTo = (page: Page) => {
    const protectedPages = [
      Page.PostAd, Page.Boost, Page.Verification, Page.Wallet, 
      Page.Cart, Page.Checkout, Page.Messenger, Page.AIChat, Page.SupportChat
    ];
    if (protectedPages.includes(page) && !currentUser) {
      setShowLoginModal(true);
      return;
    }
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    if (showOrderSuccess) {
      return (
        <div className="py-32 flex flex-col items-center justify-center text-center animate-in zoom-in">
           <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8"><CheckCircle className="text-white w-12 h-12" /></div>
           <h2 className="text-4xl font-black text-[#1A237E] dark:text-white mb-4">অর্ডার সফল হয়েছে!</h2>
           <button onClick={() => { setShowOrderSuccess(false); setCurrentPage(Page.Home); }} className="px-12 py-5 bg-[#1A237E] text-[#FFD600] font-black rounded-2xl shadow-xl">হোম পেজে ফিরে যান</button>
        </div>
      );
    }

    switch (currentPage) {
      case Page.Admin: 
        return <AdminPanel 
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
            const newMessage: SupportMessage = { id: Date.now().toString(), userEmail: email, userName: 'Admin', text, timestamp: new Date().toLocaleTimeString(), isAdmin: true, isRead: false };
            setSupportMessages(prev => [...prev, newMessage]);
          }} 
        />;
      case Page.PostAd: 
        return <PostAd language={language} isLoggedIn={!!currentUser} isVerified={currentUser?.isVerified || false} userName={currentUser?.name || ''} userEmail={currentUser?.email} postCountToday={currentUser?.postCountToday || 0} settings={adminSettings} onPostSubmit={(r) => { setPostRequests(prev => [r, ...prev]); if(r.status === 'approved') setApprovedProducts(prev => [r.product, ...prev]); }} onBoostClick={(p) => navigateTo(Page.Boost)} onLoginRequired={() => setShowLoginModal(true)} />;
      case Page.Wallet: 
        return <Wallet 
          user={currentUser} 
          onUserUpdate={(u) => { setCurrentUser(u); setMockUsers(prev => prev.map(m => m.uid === u.uid ? u : m)); }} 
          language={language} 
          onVerifySubmit={(req) => setVerificationRequests(prev => [req, ...prev])}
          onLogout={() => setCurrentUser(null)}
        />;
      case Page.Shop: return <Shop language={language} products={approvedProducts} adminEmails={adminEmails} addToCart={(p) => setCart(prev => [...prev, {product: p, quantity: 1}])} initialToLetType={toLetFilter} onProductClick={setSelectedProduct} />;
      case Page.AIChat: return <AIChat onNavigateToAdmin={() => setCurrentPage(Page.Admin)} />;
      case Page.SupportChat: return <SupportChat messages={supportMessages.filter(m => m.userEmail === currentUser?.email)} onSend={(text) => setSupportMessages(prev => [...prev, { id: Date.now().toString(), userEmail: currentUser!.email, userName: currentUser!.name, text, timestamp: new Date().toLocaleTimeString(), isAdmin: false, isRead: false }])} onClose={() => setCurrentPage(Page.Home)} />;
      default:
        return (
          <>
            <Hero language={language} setCurrentPage={navigateTo} setSelectedProduct={setSelectedProduct} boostedProducts={approvedProducts.filter(p => p.isFeatured)} />
            {/* Standard Homepage Categories & Content */}
          </>
        );
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 pb-20 lg:pb-0 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar currentPage={currentPage} setCurrentPage={navigateTo} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} language={language} setLanguage={setLanguage} cartCount={cart.length} user={currentUser} onLoginClick={() => { setIsSignup(false); setShowLoginModal(true); }} onSignupClick={() => { setIsSignup(true); setShowLoginModal(true); }} onLogoClick={handleLogoClick} />
      
      <main className="flex-grow">{renderContent()}</main>

      {/* Floating AI Button */}
      <button onClick={() => navigateTo(Page.AIChat)} className="fixed bottom-24 right-6 lg:bottom-10 lg:right-10 z-[80] w-16 h-16 bg-[#1A237E] text-[#FFD600] rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-4 border-white dark:border-slate-800 animate-glow group">
        <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform" />
      </button>

      {/* Auth Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-md rounded-[3rem] p-10 border-4 border-[#1A237E] relative animate-in zoom-in">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-red-500 transition-colors"><X className="w-8 h-8" /></button>
            <div className="text-center mb-8">
               <h3 className="text-3xl font-black text-[#1A237E] dark:text-white uppercase italic tracking-tighter">{isSignup ? 'Signup' : 'Welcome Back'}</h3>
            </div>
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isSignup && <input type="text" placeholder="Full Name" className="w-full px-6 py-4 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl outline-none font-bold border-2 border-transparent focus:border-[#1A237E]" value={authName} onChange={e => setAuthName(e.target.value)} required />}
              {isSignup && <input type="text" placeholder="Username (Alphanumeric only)" className="w-full px-6 py-4 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl outline-none font-bold border-2 border-transparent focus:border-[#1A237E]" value={authUsername} onChange={e => setAuthUsername(e.target.value)} required />}
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

      <Footer language={language} setCurrentPage={navigateTo} onAdminClick={() => setCurrentPage(Page.Admin)} />
      <BottomNav language={language} currentPage={currentPage} setCurrentPage={navigateTo} cartCount={cart.length} />
    </div>
  );
};

export default App;
