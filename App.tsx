
import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import ProductCard from './components/ProductCard.tsx';
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
import { Page, User, Product, CartItem, BoostRequest, PostRequest, VerificationRequest, SupportMessage, AdminSettings, BoostPlan, VerifyPlan } from './types.ts';
import { CATEGORIES, PRODUCTS, BOOST_PLANS, VERIFY_PLANS } from './constants.tsx';
import { ArrowRight, ShoppingBag, MessageCircle, Plus, ShieldCheck, Sparkles, X, LogIn, UserPlus, Lock, Mail, User as UserIcon, Info, Key, Zap, Rocket, Headset, MessageSquare, CheckCircle, AtSign } from 'lucide-react';

const INITIAL_MOCK_USERS = [
  { identity: 'bazaarihelp@gmail.com', password: 'SHAFIN@1a', name: 'Bazaari Admin', username: 'bazaari_admin' }
];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adminClickCount, setAdminClickCount] = useState(0);
  const adminClickTimer = useRef<any>(null);
  
  const [preSelectedBoostProduct, setPreSelectedBoostProduct] = useState<Product | null>(null);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  const [adminEmails, setAdminEmails] = useState<string[]>(['bazaarihelp@gmail.com']);

  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    freePostLimit: 3,
    extraPostPrice: 50,
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
  const [authUsername, setAuthUsername] = useState('');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authIdentity.trim() || !authPassword.trim()) return;

    if (isSignup) {
      const cleanUsername = authUsername.toLowerCase().replace(/\s/g, '_');
      const newUser = { 
        identity: authIdentity, 
        password: authPassword, 
        name: authName || 'নতুন মেম্বার', 
        username: cleanUsername
      };
      setMockUsers(prev => [...prev, newUser]);
      setCurrentUser({ 
        name: newUser.name, 
        username: newUser.username,
        email: newUser.identity, 
        isVerified: false, 
        postCountToday: 0 
      });
    } else {
      const foundUser = mockUsers.find(u => u.identity.toLowerCase() === authIdentity.toLowerCase() && u.password === authPassword);
      if (foundUser) {
        const isAdmin = adminEmails.includes(foundUser.identity.toLowerCase());
        setCurrentUser({ 
          name: foundUser.name, 
          username: foundUser.username,
          email: foundUser.identity, 
          isVerified: isAdmin, 
          postCountToday: 0 
        });
      } else {
        alert('ভুল তথ্য!');
        return;
      }
    }
    setShowLoginModal(false);
  };

  const addToCart = (p: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === p.id);
      if (existing) {
        return prev.map(item => item.product.id === p.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product: p, quantity: 1 }];
    });
  };

  const handleSendSupportMessage = (text: string) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }
    const newMessage: SupportMessage = {
      id: Math.random().toString(36).substr(2, 9),
      userEmail: currentUser.email,
      userName: currentUser.username || currentUser.name,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAdmin: false,
      isRead: false
    };
    setSupportMessages(prev => [...prev, newMessage]);
  };

  const handleAdminReply = (userEmail: string, text: string) => {
    const reply: SupportMessage = {
      id: Math.random().toString(36).substr(2, 9),
      userEmail: userEmail,
      userName: 'Official Admin',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAdmin: true,
      isRead: true
    };
    setSupportMessages(prev => [...prev, reply]);
  };

  const handlePostApproval = (id: string, status: 'approved' | 'rejected') => {
    const request = postRequests.find(r => r.id === id);
    if (!request) return;

    setPostRequests(prev => prev.map(r => r.id === id ? {...r, status} : r));

    if (status === 'approved') {
      setApprovedProducts(prev => [request.product, ...prev]);
    }
  };

  const handleBoostApproval = (id: string, status: 'approved' | 'rejected') => {
    const request = boostRequests.find(r => r.id === id);
    if (!request) return;

    setBoostRequests(prev => prev.map(r => r.id === id ? {...r, status} : r));

    if (status === 'approved' && request.productId) {
      setApprovedProducts(prev => prev.map(p => p.id === request.productId ? {...p, isFeatured: true} : p));
    }
  };

  const handleLogoClick = () => {
    if (adminClickTimer.current) clearTimeout(adminClickTimer.current);
    const nextCount = adminClickCount + 1;
    setAdminClickCount(nextCount);
    if (nextCount === 5) {
      setCurrentPage(Page.Admin);
      setAdminClickCount(0);
      return;
    }
    adminClickTimer.current = setTimeout(() => {
      setAdminClickCount(0);
    }, 2000);
  };

  const renderContent = () => {
    if (showOrderSuccess) {
      return (
        <div className="py-32 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
           <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-2xl">
              <CheckCircle className="text-white w-12 h-12" />
           </div>
           <h2 className="text-4xl font-black text-[#1A237E] dark:text-white mb-4">অর্ডার সফল হয়েছে!</h2>
           <button onClick={() => { setShowOrderSuccess(false); setCurrentPage(Page.Home); }} className="px-12 py-5 bg-[#1A237E] text-[#FFD600] font-black rounded-2xl shadow-xl">হোম পেজে ফিরে যান</button>
        </div>
      );
    }

    switch (currentPage) {
      case Page.Admin: 
        return <AdminPanel 
          onClose={() => setCurrentPage(Page.Home)} 
          boostRequests={boostRequests}
          postRequests={postRequests}
          verificationRequests={verificationRequests}
          supportMessages={supportMessages}
          settings={adminSettings}
          adminEmails={adminEmails}
          onUpdateSettings={setAdminSettings}
          onAddAdminEmail={(email) => setAdminEmails(prev => Array.from(new Set([...prev, email.toLowerCase()])))}
          onUpdateBoost={handleBoostApproval}
          onUpdatePost={handlePostApproval}
          onUpdateVerification={(id, status) => null}
          onAdminReply={handleAdminReply}
        />;
      case Page.Shop:
        return <Shop products={approvedProducts} addToCart={addToCart} onProductClick={(p) => { setSelectedProduct(p); setCurrentPage(Page.ProductDetail); }} />;
      case Page.Cart:
        return <Cart items={cart} setItems={setCart} setCurrentPage={setCurrentPage} />;
      case Page.Checkout:
        return <Checkout items={cart} total={cart.reduce((acc, i) => acc + i.product.price * i.quantity, 0)} onBack={() => setCurrentPage(Page.Cart)} onOrderComplete={() => { setCart([]); setShowOrderSuccess(true); }} />;
      case Page.PostAd: 
        return <PostAd isLoggedIn={!!currentUser} isVerified={currentUser?.isVerified || false} userName={currentUser?.username || currentUser?.name || ''} postCountToday={currentUser?.postCountToday || 0} settings={adminSettings} onPostSubmit={(r) => setPostRequests(prev => [r, ...prev])} onBoostClick={(p) => { setPreSelectedBoostProduct(p); setCurrentPage(Page.Boost); }} />;
      case Page.ProductDetail:
        return selectedProduct ? <ProductDetail product={selectedProduct} addToCart={addToCart} /> : null;
      case Page.SupportChat:
        return <SupportChat messages={supportMessages.filter(m => m.userEmail === currentUser?.email)} onSend={handleSendSupportMessage} onClose={() => setCurrentPage(Page.Home)} />;
      case Page.Boost: return <BoostPanel onBoostSubmit={(r) => setBoostRequests(prev => [r, ...prev])} initialProduct={preSelectedBoostProduct} userProducts={approvedProducts} />;
      case Page.Verification: return <Verification userEmail={currentUser?.email || ''} onVerifySubmit={(r) => setVerificationRequests(prev => [r, ...prev])} />;
      case Page.Wallet: return <Wallet user={currentUser} onUserUpdate={setCurrentUser} />;
      case Page.TrackOrder: return <TrackOrder />;
      case Page.AIChat: return <AIChat />;
      case Page.Messenger: return <Messenger />;
      default:
        return (
          <>
            <Hero setCurrentPage={setCurrentPage} setSelectedProduct={setSelectedProduct} boostedProducts={approvedProducts.filter(p => p.isFeatured)} />
            <section className="py-20 bg-slate-50 dark:bg-slate-950">
              <div className="max-w-7xl mx-auto px-4">
                 <div className="flex justify-between items-center mb-12">
                   <h2 className="text-3xl font-black dark:text-white">জনপ্রিয় ক্যাটাগরি</h2>
                   <button onClick={() => setCurrentPage(Page.Shop)} className="flex items-center gap-2 text-[#1A237E] dark:text-[#FFD600] font-bold">সব দেখুন <ArrowRight className="w-4 h-4" /></button>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                   {CATEGORIES.map(cat => (
                     <div key={cat.id} onClick={() => setCurrentPage(Page.Shop)} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] text-center border border-slate-100 dark:border-slate-800 hover:scale-105 transition-all cursor-pointer shadow-sm group">
                        <div className="text-4xl mb-4 transform group-hover:scale-125 transition-transform">{cat.icon}</div>
                        <span className="font-bold dark:text-white">{cat.name}</span>
                     </div>
                   ))}
                 </div>
              </div>
            </section>
            <AboutUs />
          </>
        );
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 pb-20 lg:pb-0 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {currentPage !== Page.Admin && (
        <Navbar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
          cartCount={cart.length}
          user={currentUser}
          onLoginClick={() => { setIsSignup(false); setShowLoginModal(true); }}
          onSignupClick={() => { setIsSignup(true); setShowLoginModal(true); }}
          onLogoClick={handleLogoClick}
        />
      )}
      <main className="flex-grow">{renderContent()}</main>
      {currentPage !== Page.Admin && <Footer setCurrentPage={setCurrentPage} onAdminClick={() => {}} />}
      {currentPage !== Page.Admin && <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} cartCount={cart.length} />}

      {showLoginModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative animate-in zoom-in duration-300 border-4 border-[#1A237E]">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-red-500 transition-colors"><X className="w-8 h-8" /></button>
            <div className="text-center mb-10">
              <h3 className="text-3xl font-black text-[#1A237E] dark:text-white">{isSignup ? 'নতুন অ্যাকাউন্ট' : 'লগইন করুন'}</h3>
            </div>
            <form onSubmit={handleAuthSubmit} className="space-y-6">
              {isSignup && <input type="text" placeholder="পুরো নাম" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none" value={authName} onChange={e => setAuthName(e.target.value)} required />}
              <input type="email" placeholder="ইমেইল" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none" value={authIdentity} onChange={e => setAuthIdentity(e.target.value)} required />
              <input type="password" placeholder="পাসওয়ার্ড" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required />
              <button type="submit" className="w-full py-5 bg-[#1A237E] text-[#FFD600] font-black rounded-2xl shadow-xl">{isSignup ? 'সাইনআপ' : 'লগইন'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
