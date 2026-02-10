
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
import { ArrowRight, Sparkles, X, UserPlus, ShieldCheck, CheckCircle, Headset } from 'lucide-react';

const INITIAL_MOCK_USERS = [
  { identity: 'bazaarihelp@gmail.com', password: 'SHAFIN@1a', name: 'Bazaari Help' },
  { identity: 'enigmaticshafin@gmail.com', password: 'SHAFIN@1a', name: 'Shafin Admin' }
];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<Language>('bn');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adminEmails, setAdminEmails] = useState<string[]>(['bazaarihelp@gmail.com', 'enigmaticshafin@gmail.com']);
  const [preSelectedBoostProduct, setPreSelectedBoostProduct] = useState<Product | null>(null);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [adminClickCount, setAdminClickCount] = useState(0);
  const adminClickTimer = useRef<any>(null);

  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    freePostLimit: 3,
    extraPostPrice: 100,
    extraImagePrice: 50,
    boostPlans: [...BOOST_PLANS],
    verifyPlans: [...VERIFY_PLANS]
  });

  const [mockUsers, setMockUsers] = useState(INITIAL_MOCK_USERS);
  const [boostRequests, setBoostRequests] = useState<BoostRequest[]>([]);
  const [postRequests, setPostRequests] = useState<PostRequest[]>([]);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [approvedProducts, setApprovedProducts] = useState<Product[]>(PRODUCTS);

  const [authIdentity, setAuthIdentity] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Protected navigation logic
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

  const handleLogoClick = () => {
    setAdminClickCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        setCurrentPage(Page.Admin);
        return 0;
      }
      return newCount;
    });

    if (adminClickTimer.current) clearTimeout(adminClickTimer.current);
    adminClickTimer.current = setTimeout(() => {
      setAdminClickCount(0);
    }, 3000);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authIdentity.trim() || !authPassword.trim()) return;

    if (isSignup) {
      const newUser = { identity: authIdentity, password: authPassword, name: authName || 'New Member' };
      setMockUsers(prev => [...prev, newUser]);
      setCurrentUser({ name: newUser.name, email: newUser.identity, isVerified: false, postCountToday: 0 });
    } else {
      const foundUser = mockUsers.find(u => u.identity.toLowerCase() === authIdentity.toLowerCase() && u.password === authPassword);
      if (foundUser) {
        const isAdmin = adminEmails.map(e => e.toLowerCase()).includes(foundUser.identity.toLowerCase());
        setCurrentUser({ name: foundUser.name, email: foundUser.identity, isVerified: isAdmin, postCountToday: 0 });
      } else {
        alert(language === 'bn' ? 'ভুল ইমেইল বা পাসওয়ার্ড!' : 'Invalid credentials!');
        return;
      }
    }
    setShowLoginModal(false);
  };

  const addToCart = (p: Product) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.product.id === p.id);
      if (existing) return prev.map(item => item.product.id === p.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { product: p, quantity: 1 }];
    });
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
        return <AdminPanel onClose={() => setCurrentPage(Page.Home)} currentUser={currentUser} language={language} boostRequests={boostRequests} postRequests={postRequests} verificationRequests={verificationRequests} supportMessages={supportMessages} settings={adminSettings} adminEmails={adminEmails} onUpdateSettings={setAdminSettings} onAddAdminEmail={(email) => setAdminEmails(prev => Array.from(new Set([...prev, email.toLowerCase()])))} onUpdateBoost={(id, status) => null} onUpdatePost={(id, status) => null} onUpdateVerification={(id, status) => null} onAdminReply={(email, text) => null} />;
      case Page.Shop:
        return <Shop language={language} products={approvedProducts} adminEmails={adminEmails} addToCart={addToCart} onProductClick={(p) => { setSelectedProduct(p); setCurrentPage(Page.ProductDetail); }} />;
      case Page.PostAd: 
        return <PostAd language={language} isLoggedIn={!!currentUser} isVerified={currentUser?.isVerified || false} userName={currentUser?.name || ''} userEmail={currentUser?.email} postCountToday={currentUser?.postCountToday || 0} settings={adminSettings} onPostSubmit={(r) => setPostRequests(prev => [r, ...prev])} onBoostClick={(p) => { setPreSelectedBoostProduct(p); navigateTo(Page.Boost); }} onLoginRequired={() => setShowLoginModal(true)} />;
      case Page.Boost: 
        return <BoostPanel language={language} onBoostSubmit={(r) => setBoostRequests(prev => [r, ...prev])} initialProduct={preSelectedBoostProduct} userProducts={approvedProducts} plans={adminSettings.boostPlans} />;
      case Page.Verification: 
        return <Verification language={language} userEmail={currentUser?.email || ''} onVerifySubmit={(r) => setVerificationRequests(prev => [r, ...prev])} plans={adminSettings.verifyPlans} />;
      case Page.ProductDetail:
        return selectedProduct ? <ProductDetail product={selectedProduct} addToCart={addToCart} adminEmails={adminEmails} onLoginRequired={() => setShowLoginModal(true)} /> : null;
      case Page.Cart:
        return <Cart language={language} items={cart} setItems={setCart} setCurrentPage={navigateTo} />;
      case Page.Wallet: return <Wallet user={currentUser} onUserUpdate={setCurrentUser} language={language} />;
      case Page.AIChat: return <AIChat />;
      case Page.SupportChat: return <SupportChat messages={supportMessages} onSend={(txt) => {}} onClose={() => setCurrentPage(Page.Home)} />;
      default:
        return (
          <>
            <Hero language={language} setCurrentPage={navigateTo} setSelectedProduct={setSelectedProduct} boostedProducts={approvedProducts.filter(p => p.isFeatured)} />
            <section className="py-20 bg-slate-50 dark:bg-slate-950">
              <div className="max-w-7xl mx-auto px-4 text-center">
                 <h2 className="text-3xl font-black mb-12 dark:text-white">জনপ্রিয় ক্যাটাগরি</h2>
                 <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                   {CATEGORIES.map(cat => (
                     <div key={cat.id} onClick={() => navigateTo(Page.Shop)} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm cursor-pointer hover:scale-105 transition-all border border-slate-100 dark:border-slate-800">
                        <div className="text-4xl mb-4">{cat.icon}</div>
                        <span className="font-black dark:text-white uppercase tracking-tighter">{cat.name}</span>
                     </div>
                   ))}
                 </div>
              </div>
            </section>
            <AboutUs language={language} />
          </>
        );
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 pb-20 lg:pb-0 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar currentPage={currentPage} setCurrentPage={navigateTo} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} language={language} setLanguage={setLanguage} cartCount={cart.length} user={currentUser} onLoginClick={() => { setIsSignup(false); setShowLoginModal(true); }} onSignupClick={() => { setIsSignup(true); setShowLoginModal(true); }} onLogoClick={handleLogoClick} />
      <main className="flex-grow">{renderContent()}</main>
      <Footer language={language} setCurrentPage={navigateTo} onAdminClick={() => {}} />
      <BottomNav language={language} currentPage={currentPage} setCurrentPage={navigateTo} cartCount={cart.length} />
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-10 border-4 border-[#1A237E] relative animate-in zoom-in">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-red-500 transition-colors"><X className="w-8 h-8" /></button>
            <div className="text-center mb-8">
               <div className="bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                 <UserPlus className="text-[#1A237E] dark:text-[#FFD600] w-8 h-8" />
               </div>
               <h3 className="text-3xl font-black text-[#1A237E] dark:text-white uppercase italic tracking-tighter">{isSignup ? 'Create Account' : 'Welcome Back'}</h3>
               <p className="text-slate-500 text-sm mt-2">{language === 'bn' ? 'অ্যাড পোস্ট বা কেনাকাটা করতে লগইন করুন' : 'Login to post ads or buy products'}</p>
            </div>
            <form onSubmit={handleAuthSubmit} className="space-y-6">
              {isSignup && <input type="text" placeholder="Full Name" className="w-full px-6 py-5 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl outline-none font-bold border-2 border-transparent focus:border-[#1A237E]" value={authName} onChange={e => setAuthName(e.target.value)} />}
              <input type="email" placeholder="Email Address" className="w-full px-6 py-5 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl outline-none font-bold border-2 border-transparent focus:border-[#1A237E]" value={authIdentity} onChange={e => setAuthIdentity(e.target.value)} required />
              <input type="password" placeholder="Password" className="w-full px-6 py-5 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl outline-none font-bold border-2 border-transparent focus:border-[#1A237E]" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required />
              <button type="submit" className="w-full py-5 bg-[#1A237E] text-[#FFD600] font-black rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 text-lg uppercase">{isSignup ? 'Signup' : 'Login'}</button>
            </form>
            <div className="mt-8 text-center">
               <button onClick={() => setIsSignup(!isSignup)} className="text-sm font-bold text-slate-500 hover:text-[#1A237E] transition-colors">
                 {isSignup ? (language === 'bn' ? 'অ্যাকাউন্ট আছে? লগইন করুন' : 'Already have an account? Login') : (language === 'bn' ? 'অ্যাকাউন্ট নেই? নতুন খুলুন' : "Don't have an account? Create one")}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
