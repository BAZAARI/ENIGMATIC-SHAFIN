
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
import { ArrowRight, Sparkles, X, UserPlus, ShieldCheck, CheckCircle, Headset, Users, UserCheck, MessageSquare, AlertCircle, Lock, Activity, Clock, ShieldEllipsis, RefreshCw, Send, Loader2, BellRing, Copy, Eye } from 'lucide-react';

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
  
  // Auth Form State
  const [authIdentity, setAuthIdentity] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authUsername, setAuthUsername] = useState('');

  // OTP Verification States
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

  // Handle OTP Timer
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
    setOtpTimer(30);
    
    // Show on-screen notification instead of just alert
    setNotification({
      msg: `BAZAARI OTP: ${otp} (Simulated Email to ${email})`,
      type: 'info'
    });
    
    // Keep it for 10 seconds
    setTimeout(() => setNotification(null), 10000);
    
    // Backup alert
    console.log("OTP Sent:", otp);
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
        alert(language === 'bn' ? 'ভুল তথ্য!' : 'Invalid credentials');
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
        setNotification({ msg: 'Success! Welcome to Bazaari.', type: 'success' });
        setTimeout(() => setNotification(null), 3000);
        setAuthIdentity(''); setAuthPassword(''); setAuthName(''); setAuthUsername('');
      }, 1500);
    } else {