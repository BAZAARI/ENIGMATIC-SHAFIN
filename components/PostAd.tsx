
import React, { useState, useRef } from 'react';
import { Camera, Sparkles, Plus, AlertCircle, LogIn, CheckCircle, X, Rocket, ShieldCheck, MapPin, Phone, CreditCard, Zap, ChevronRight, Loader2, Image as ImageIcon, Smartphone, Lock } from 'lucide-react';
import { PostRequest, Product, AdminSettings, Language } from '../types.ts';
import { CATEGORIES } from '../constants.tsx';
import { GoogleGenAI } from "@google/genai";

interface PostAdProps {
  isLoggedIn: boolean;
  isVerified: boolean;
  userName: string;
  userEmail?: string;
  postCountToday: number;
  settings: AdminSettings;
  language: Language;
  onPostSubmit: (request: PostRequest) => void;
  onBoostClick: (product: Product) => void;
  onLoginRequired: () => void;
}

const PostAd: React.FC<PostAdProps> = ({ isLoggedIn, isVerified, userName, userEmail, postCountToday, settings, language, onPostSubmit, onBoostClick, onLoginRequired }) => {
  const [description, setDescription] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState(language === 'bn' ? 'বাংলাদেশ' : 'Bangladesh');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Fashion');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [condition, setCondition] = useState<'New' | 'Used'>('New');
  const [images, setImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSubmittedProduct, setLastSubmittedProduct] = useState<Product | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showImageLimitModal, setShowImageLimitModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [trxId, setTrxId] = useState('');
  const [paymentType, setPaymentType] = useState<'daily_limit' | 'image_limit' | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLimitReached = postCountToday >= settings.freePostLimit;

  if (!isLoggedIn) {
    return (
      <div className="py-32 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-2xl text-center max-w-lg w-full border-2 border-slate-100 dark:border-slate-800 animate-in zoom-in">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="text-[#1A237E] dark:text-[#FFD600] w-10 h-10" />
          </div>
          <h3 className="text-3xl font-black text-[#1A237E] dark:text-white mb-4 uppercase italic tracking-tighter">
            {language === 'bn' ? 'লগইন প্রয়োজন' : 'Login Required'}
          </h3>
          <p className="text-slate-500 mb-8 font-medium">
            {language === 'bn' ? 'অ্যাড পোস্ট করতে হলে প্রথমে আপনার অ্যাকাউন্টে লগইন করতে হবে।' : 'To post an ad, you must login to your account first.'}
          </p>
          <button 
            onClick={onLoginRequired}
            className="w-full py-5 bg-[#1A237E] text-[#FFD600] font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all uppercase tracking-widest italic"
          >
            <LogIn className="w-6 h-6" /> {language === 'bn' ? 'লগইন করুন' : 'Login Now'}
          </button>
        </div>
      </div>
    );
  }

  const t = {
    title: language === 'bn' ? 'অ্যাড পোস্ট করুন' : 'Post Your Ad',
    subtitle: language === 'bn' ? 'আপনার পণ্যের সঠিক তথ্য দিন' : 'Provide correct info for your product',
    limit: language === 'bn' ? `ফ্রি লিমিট: ${postCountToday}/${settings.freePostLimit}` : `Free Limit: ${postCountToday}/${settings.freePostLimit}`,
    prodName: language === 'bn' ? 'পণ্যের নাম' : 'Product Name',
    price: language === 'bn' ? 'মূল্য (৳)' : 'Price (৳)',
    category: language === 'bn' ? 'ক্যাটাগরি' : 'Category',
    condition: language === 'bn' ? 'অবস্থা' : 'Condition',
    brand: language === 'bn' ? 'ব্র্যান্ড (ঐচ্ছিক)' : 'Brand (Optional)',
    model: language === 'bn' ? 'মডেল (ঐচ্ছিক)' : 'Model (Optional)',
    location: language === 'bn' ? 'লোকেশন' : 'Location',
    phone: language === 'bn' ? 'ফোন নম্বর' : 'Phone Number',
    images: language === 'bn' ? 'পণ্যের ছবি' : 'Product Images',
    desc: language === 'bn' ? 'বিস্তারিত বিবরণ' : 'Description',
    submitBtn: language === 'bn' ? 'বিজ্ঞাপনটি জমা দিন' : 'Submit Ad',
    paidBtn: language === 'bn' ? 'পেমেন্ট ও পাবলিশ' : 'Pay & Publish',
    successTitle: language === 'bn' ? 'বিজ্ঞাপন জমা হয়েছে!' : 'Ad Submitted!',
    successText: language === 'bn' ? 'অ্যাডমিন এটি যাচাই করার পর ২-৩ ঘণ্টার মধ্যে লাইভ হবে।' : 'Live in 2-3 hours after admin review.',
    payTitle: language === 'bn' ? 'পেমেন্ট গেটওয়ে' : 'Payment Gateway',
    paySub: language === 'bn' ? `চার্জ: ৳${paymentType === 'image_limit' ? settings.extraImagePrice : settings.extraPostPrice}` : `Charge: ৳${paymentType === 'image_limit' ? settings.extraImagePrice : settings.extraPostPrice}`,
    aiBtn: language === 'bn' ? 'AI দিয়ে লিখুন' : 'Write with AI',
    limitReached: language === 'bn' ? 'প্রতিদিনের লিমিট শেষ!' : 'Daily Limit Reached!',
    extraImgBtn: language === 'bn' ? '১০০ ছবি পর্যন্ত (+৳৫০)' : 'Add up to 100 photos (+৳50)',
    trxLabel: language === 'bn' ? 'ট্রানজ্যাকশন আইডি (TrxID)' : 'Transaction ID (TrxID)',
    boostBtn: language === 'bn' ? 'এই অ্যাডটি বুস্ট করুন' : 'Boost this Post',
    anotherBtn: language === 'bn' ? 'আরেকটি অ্যাড দিন' : 'Post Another Ad'
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const isPaidImages = showPayment && paymentType === 'image_limit';
      const currentMax = (isVerified || isPaidImages) ? 100 : 3;
      
      if (!isVerified && !isPaidImages && images.length + files.length > 3) {
        setShowImageLimitModal(true);
        return;
      }

      Array.from(files).forEach((file: File) => {
        if (images.length < 100) {
          const reader = new FileReader();
          reader.onloadend = () => setImages(prev => [...prev, reader.result as string].slice(0, 100));
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const generateAIDescription = async () => {
    if (!productName.trim()) {
      alert(language === 'bn' ? 'প্রথমে পণ্যের নাম লিখুন!' : 'Enter product name first!');
      return;
    }
    
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Write a professional and attractive product description in ${language === 'bn' ? 'Bengali' : 'English'} for a product named "${productName}". Category: ${category}. Concise and highlight quality.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      if (response.text) {
        setDescription(response.text.trim());
      }
    } catch (error) {
      alert(language === 'bn' ? 'AI ডেসক্রিপশন তৈরিতে সমস্যা হয়েছে।' : 'AI description failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFinalSubmit = () => {
    if (!productName || !price || images.length === 0) {
      alert(language === 'bn' ? 'দয়া করে সকল তথ্য ও ছবি প্রদান করুন।' : 'Please provide all info and images.');
      return;
    }

    const needsImagePayment = images.length > 3 && !isVerified;
    const needsDailyPayment = isLimitReached;

    if ((needsImagePayment || needsDailyPayment) && !trxId) {
      setPaymentType(needsImagePayment ? 'image_limit' : 'daily_limit');
      setShowPayment(true);
      return;
    }
    
    setIsProcessing(true);
    setTimeout(() => {
      const newProduct: Product = {
        id: Date.now(),
        name: productName,
        price: parseInt(price),
        originalPrice: parseInt(price) * 1.15,
        image: images[0],
        vendor: userName,
        vendorEmail: userEmail,
        category,
        rating: 5,
        reviews: 0,
        description,
        location,
        phone,
        condition
      };

      onPostSubmit({
        id: Math.random().toString(36).substr(2, 9),
        product: newProduct,
        status: 'pending',
        timestamp: new Date().toLocaleString(),
        isPaid: needsImagePayment || needsDailyPayment,
        trxId: trxId || undefined,
        paymentReason: needsImagePayment ? 'extra_images' : (needsDailyPayment ? 'extra_posts' : undefined)
      });

      setLastSubmittedProduct(newProduct);
      setIsProcessing(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="py-20 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-slate-800 p-12 rounded-[3rem] shadow-2xl text-center max-w-lg w-full border border-green-100 dark:border-slate-700 animate-in zoom-in">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-white w-10 h-10" />
          </div>
          <h3 className="text-3xl font-black text-[#1A237E] dark:text-white mb-4">{t.successTitle}</h3>
          <p className="text-slate-500 mb-8">{t.successText}</p>
          <div className="space-y-4">
             <button 
               onClick={() => lastSubmittedProduct && onBoostClick(lastSubmittedProduct)} 
               className="w-full py-5 bg-[#1A237E] text-[#FFD600] font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all"
             >
                <Rocket className="w-6 h-6" /> {t.boostBtn}
             </button>
             <button onClick={() => window.location.reload()} className="w-full py-4 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-white font-bold rounded-2xl">
               {t.anotherBtn}
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 max-w-4xl mx-auto px-4">
      {showImageLimitModal && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-10 shadow-2xl text-center border-4 border-[#FFD600] animate-in zoom-in">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="text-[#1A237E] w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-[#1A237E] dark:text-white mb-4">{language === 'bn' ? 'অতিরিক্ত ছবি প্রয়োজন?' : 'Need More Photos?'}</h3>
            <p className="text-slate-500 mb-8">
              {language === 'bn' ? `৩টির বেশি এবং ১০০টি পর্যন্ত ছবি দিতে ৳${settings.extraImagePrice} চার্জ প্রযোজ্য।` : `Upload up to 100 photos for a one-time ৳${settings.extraImagePrice} charge.`}
            </p>
            <div className="space-y-4">
              <button onClick={() => { setPaymentType('image_limit'); setShowPayment(true); setShowImageLimitModal(false); }} className="w-full py-4 bg-[#1A237E] text-[#FFD600] font-bold rounded-2xl">
                {language === 'bn' ? 'পেমেন্ট করুন' : 'Proceed to Payment'}
              </button>
              <button onClick={() => setShowImageLimitModal(false)} className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold rounded-2xl">{language === 'bn' ? '৩টিই থাক' : 'Keep 3 Photos'}</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="bg-[#1A237E] p-10 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black">{t.title}</h2>
            <p className="text-blue-100 opacity-70">{t.subtitle}</p>
          </div>
          {!isVerified && <div className="p-3 bg-white/10 rounded-xl text-xs font-bold border border-white/20">{t.limit}</div>}
        </div>

        {showPayment ? (
          <div className="p-10 space-y-8 animate-in slide-in-from-right-4">
             <div className="text-center mb-6">
                <h4 className="text-xl font-black text-[#1A237E] dark:text-white">{t.payTitle}</h4>
                <p className="text-[#FFD600] font-black text-2xl">{t.paySub}</p>
             </div>
             <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-2xl border border-pink-100 flex items-center justify-between">
                    <span className="font-bold text-pink-600">bKash (Per)</span>
                    <span className="font-black dark:text-white">01516-595597</span>
                  </div>
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 flex items-center justify-between">
                    <span className="font-bold text-orange-600">Nagad (Per)</span>
                    <span className="font-black dark:text-white">01516-595597</span>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 flex items-center justify-between">
                    <span className="font-bold text-purple-600 flex items-center gap-2"><Smartphone className="w-4 h-4" /> Rocket</span>
                    <span className="font-black dark:text-white">01516-595597-4</span>
                  </div>
                </div>
                <div className="space-y-4">
                   <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">{t.trxLabel}</label>
                   <input type="text" placeholder="Transaction ID" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border focus:border-[#1A237E] dark:text-white" value={trxId} onChange={e => setTrxId(e.target.value)} />
                   
                   <button onClick={handleFinalSubmit} disabled={isProcessing} className="w-full py-4 bg-[#1A237E] text-[#FFD600] font-black rounded-2xl flex items-center justify-center gap-2">
                     {isProcessing ? <Loader2 className="animate-spin" /> : <>{language === 'bn' ? 'পাবলিশ করুন' : 'Verify & Publish'} <ChevronRight /></>}
                   </button>
                   <button onClick={() => setShowPayment(false)} className="w-full py-2 text-slate-400 text-xs font-bold">বাতিল করুন</button>
                </div>
             </div>
          </div>
        ) : (
          <div className="p-10 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">{t.prodName}</label>
                <input type="text" placeholder="Product Name" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl outline-none" value={productName} onChange={e => setProductName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">{t.price}</label>
                <input type="number" placeholder="৳" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl outline-none" value={price} onChange={e => setPrice(e.target.value)} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase">{t.images} ({images.length}/{(isVerified || (showPayment && paymentType === 'image_limit')) ? 100 : 3})</label>
                {images.length >= 3 && !isVerified && !showPayment && (
                  <button onClick={() => setShowImageLimitModal(true)} className="text-[10px] font-black text-[#1A237E] bg-[#FFD600] px-3 py-1 rounded-full animate-pulse">{t.extraImgBtn}</button>
                )}
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {images.map((img, i) => (
                  <div key={i} className="relative w-28 h-28 rounded-2xl overflow-hidden border shrink-0 shadow-md">
                    <img src={img} className="w-full h-full object-cover" />
                    <button onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"><X className="w-3 h-3" /></button>
                  </div>
                ))}
                {(images.length < ((isVerified || (showPayment && paymentType === 'image_limit')) ? 100 : 3)) && (
                  <div onClick={() => fileInputRef.current?.click()} className="w-28 h-28 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#1A237E] text-slate-400 shrink-0 bg-slate-50 dark:bg-slate-800">
                    <Camera /><span className="text-[10px] mt-1 font-bold">{language === 'bn' ? 'ছবি দিন' : 'Add Photo'}</span>
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleImageUpload} />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase">{t.desc}</label>
                <button onClick={generateAIDescription} className="text-[10px] font-black text-[#1A237E] bg-[#FFD600] px-4 py-2 rounded-full hover:shadow-md transition-all">
                  <Sparkles className="w-3 h-3 mr-2" /> {isGenerating ? "..." : t.aiBtn}
                </button>
              </div>
              <textarea rows={4} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl outline-none resize-none border focus:border-[#1A237E] dark:border-slate-700" value={description} onChange={e => setDescription(e.target.value)}></textarea>
            </div>

            <button onClick={handleFinalSubmit} className="w-full py-6 bg-[#1A237E] text-[#FFD600] font-black rounded-3xl shadow-2xl hover:scale-[1.01] transition-all text-xl">
              {isLimitReached || (images.length > 3 && !isVerified) ? t.paidBtn : t.submitBtn}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostAd;
