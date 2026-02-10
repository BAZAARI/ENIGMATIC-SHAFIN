
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import AboutUs from './components/AboutUs';
import TrackOrder from './components/TrackOrder';
import Messenger from './components/Messenger';
import BoostPanel from './components/BoostPanel';
import Wallet from './components/Wallet';
import Contact from './components/Contact';
import PostAd from './components/PostAd';
import AIChat from './components/AIChat';
import SupportChat from './components/SupportChat';
import Verification from './components/Verification';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import AdminPanel from './components/AdminPanel';
import { Page, User, Product, CartItem, BoostRequest, PostRequest, VerificationRequest, SupportMessage, AdminSettings, BoostPlan, VerifyPlan } from './types';
import { CATEGORIES, PRODUCTS, BOOST_PLANS, VERIFY_PLANS } from './constants';
import { ArrowRight, ShoppingBag, MessageCircle, Plus, ShieldCheck, Sparkles, X, LogIn, UserPlus, Lock, Mail, User as UserIcon, Info, Key, Zap, Rocket, Headset, MessageSquare } from 'lucide-react';

const INITIAL_MOCK_USERS = [
  { identity: 'enigmaticshafin@gmail.com', password: 'SHAFIN@1a', name: 'Shafin (Admin)' }
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
  const [preSelectedBoostProduct, setPreSelectedBoostProduct] = useState<Product | null>(null);

  // Authorized Admin Emails
  const [adminEmails, setAdminEmails] = useState<string[]>(['enigmaticshafin@gmail.com']);

  // Global Admin Settings (Including all plans)
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    freePostLimit: 3,
    extraPostPrice: 50,
    boostPlans: [...BOOST_PLANS],
    verifyPlans: [...VERIFY_PLANS]
  });

  // Admin approval states
  const [mockUsers, setMockUsers] = useState(INITIAL_MOCK_USERS);
  const [boostRequests, setBoostRequests] = useState<BoostRequest[]>([]);
  const [postRequests, setPostRequests] = useState<PostRequest[]>([]);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [approvedProducts, setApprovedProducts] = useState<Product[]>(PRODUCTS);

  // Auth States
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

  const handleAdminTrigger = () => {
    const nextCount = adminClickCount + 1;
    setAdminClickCount(nextCount);
    if (nextCount === 5) {
      setCurrentPage(Page.Admin);
      setAdminClickCount(0);
    }
    setTimeout(() => setAdminClickCount(0), 5000);
  };

  const autofillAdmin = () => {
    setAuthIdentity('enigmaticshafin@gmail.com');
    setAuthPassword('SHAFIN@1a');
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authIdentity.trim() || !authPassword.trim()) return;

    if (isSignup) {
      const newUser = { identity: authIdentity, password: authPassword, name: authName || 'নতুন মেম্বার' };
      setMockUsers(prev => [...prev, newUser]);
      setCurrentUser({ name: newUser.name, email: newUser.identity, isVerified: false, postCountToday: 0 });
    } else {
      const foundUser = mockUsers.find(u => u.identity.toLowerCase() === authIdentity.toLowerCase() && u.password === authPassword);
      if (foundUser) {
        const isAdmin = adminEmails.includes(foundUser.identity.toLowerCase());
        setCurrentUser({ name: foundUser.name, email: foundUser.identity, isVerified: isAdmin, postCountToday: 0 });
      } else {
        alert('ভুল তথ্য!');
        return;
      }
    }
    setShowLoginModal(false);
  };

  const handlePostSubmit = (request: PostRequest) => {
    setPostRequests(prev => [request, ...prev]);
    if (currentUser) {
      setCurrentUser({ ...currentUser, postCountToday: currentUser.postCountToday + 1 });
    }
  };

  const handleSendMessage = (text: string) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }
    const msg: SupportMessage = {
      id: Math.random().toString(36).substr(2, 9),
      userEmail: currentUser.email,
      userName: currentUser.name,
      text,
      timestamp: new Date().toLocaleTimeString(),
      isAdmin: false,
      isRead: false
    };
    setSupportMessages(prev => [...prev, msg]);
  };

  const handleAdminReply = (userEmail: string, text: string) => {
    const msg: SupportMessage = {
      id: Math.random().toString(36).substr(2, 9),
      userEmail,
      userName: 'Admin',
      text,
      timestamp: new Date().toLocaleTimeString(),
      isAdmin: true,
      isRead: true
    };
    setSupportMessages(prev => [...prev, msg]);
  };

  const approvePost = (id: string) => {
    const post = postRequests.find(r => r.id === id);
    if (post) {
      setApprovedProducts(prev => [post.product, ...prev]);
      setPostRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    }
  };

  const renderContent = () => {
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
          onUpdateBoost={(id, status) => setBoostRequests(prev => prev.map(r => r.id === id ? {...r, status} : r))}
          onUpdatePost={(id, status) => status === 'approved' ? approvePost(id) : setPostRequests(prev => prev.map(r => r.id === id ? {...r, status} : r))}
          onUpdateVerification={(id, status) => status === 'approved' ? setVerificationRequests(prev => prev.map(r => r.id === id ? {...r, status} : r)) : null}
          onAdminReply={handleAdminReply}
        />;
      case Page.PostAd: 
        return <PostAd 
          isLoggedIn={!!currentUser} 
          isVerified={currentUser?.isVerified || false} 
          userName={currentUser?.name || ''} 
          postCountToday={currentUser?.postCountToday || 0}
          settings={adminSettings}
          onPostSubmit={handlePostSubmit} 
          onBoostClick={(p) => { setPreSelectedBoostProduct(p); setCurrentPage(Page.Boost); }} 
        />;
      case Page.SupportChat:
        return <SupportChat 
          messages={supportMessages.filter(m => m.userEmail === currentUser?.email)} 
          onSend={handleSendMessage} 
          onClose={() => setCurrentPage(Page.Home)}
        />;
      case Page.TrackOrder: return <TrackOrder />;
      case Page.About: return <AboutUs />;
      case Page.Boost: return <BoostPanel onBoostSubmit={(r) => setBoostRequests(prev => [r, ...prev])} initialProduct={preSelectedBoostProduct} userProducts={approvedProducts} plans={adminSettings.boostPlans} />;
      case Page.Verification: return <Verification userEmail={currentUser?.email || ''} onVerifySubmit={(r) => setVerificationRequests(prev => [r, ...prev])} plans={adminSettings.verifyPlans} />;
      case Page.ProductDetail: return selectedProduct ? <ProductDetail product={selectedProduct} addToCart={(p) => setCart(prev => [...prev, {product: p, quantity: 1}])} /> : <Hero setCurrentPage={setCurrentPage} setSelectedProduct={setSelectedProduct} boostedProducts={approvedProducts.filter(p => p.isFeatured)} />;
      case Page.Shop:
        return (
          <div className="py-20 max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-[#1A237E] dark:text-[#FFD600] mb-12">মার্কেটপ্লেস</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {approvedProducts.map((p) => (
                <ProductCard key={p.id} product={p} addToCart={(p) => {}} onClick={() => { setSelectedProduct(p); setCurrentPage(Page.ProductDetail); }} />
              ))}
            </div>