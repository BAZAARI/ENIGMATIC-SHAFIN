
import React, { useState, useRef } from 'react';
import { Camera, Sparkles, Plus, AlertCircle, LogIn, CheckCircle, X, Rocket, ShieldCheck, MapPin, Phone, CreditCard, Zap, ChevronRight, Loader2, Image as ImageIcon } from 'lucide-react';
import { PostRequest, Product, AdminSettings } from '../types.ts';
import { CATEGORIES } from '../constants.tsx';
import { GoogleGenAI } from "@google/genai";

interface PostAdProps {
  isLoggedIn: boolean;
  isVerified: boolean;
  userName: string;
  postCountToday: number;
  settings: AdminSettings;
  onPostSubmit: (request: PostRequest) => void;
  onBoostClick: (product: Product) => void;
}

const PostAd: React.FC<PostAdProps> = ({ isLoggedIn, isVerified, userName, postCountToday, settings, onPostSubmit, onBoostClick }) => {
  const [description, setDescription] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('বাংলাদেশ');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Fashion');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [condition, setCondition] = useState<'New' | 'Used'>('New');
  const [images, setImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showImageLimitModal, setShowImageLimitModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [trxId, setTrxId] = useState('');
  const [paymentType, setPaymentType] = useState<'daily_limit' | 'image_limit' | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLimitReached = postCountToday >= settings.freePostLimit;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const remainingSlots = (isVerified || (showPayment && paymentType === 'image_limit')) ? 10 : 3;
      
      if (!isVerified && !showPayment && images.length + files.length > 3) {
        setShowImageLimitModal(true);
        return;
      }

      Array.from(files).forEach((file: File) => {
        if (images.length < remainingSlots) {
          const reader = new FileReader();
          reader.onloadend = () => setImages(prev => [...prev, reader.result as string].slice(0, remainingSlots));
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const generateAIDescription = async () => {
    if (!productName.trim()) {
      alert('প্রথমে পণ্যের নাম লিখুন!');
      return;
    }
    
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Write a professional and attractive product description in Bengali for a product named "${productName}". 
      Category: ${category}. 
      Brand: ${brand || 'Not specified'}. 
      Model: ${model || 'Not specified'}. 
      The description should highlight premium quality and be suitable for a lifestyle marketplace in Bangladesh. Keep it concise (around 50-80 words).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      if (response.text) {
        setDescription(response.text.trim());
      }
    } catch (error) {
      console.error("AI Generation failed:", error);
      alert('AI ডেসক্রিপশন তৈরিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFinalSubmit = () => {
    if ((isLimitReached || showPayment) && !trxId) {
      alert('পেমেন্ট ট্রানজ্যাকশন আইডি দিন!');
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
        category,
        rating: 5,
        reviews: 0,
        description: `${description}\n\nব্র্যান্ড: ${brand}\nমডেল: ${model}`,
        location,
        phone,
        condition
      };

      let reason = undefined;
      if (isLimitReached) reason = "Daily Post Limit reached";
      if (paymentType === 'image_limit') reason = "Extra Images (10 photos)";

      onPostSubmit({
        id: Math.random().toString(36).substr(2, 9),
        product: newProduct,
        status: 'pending',
        timestamp: new Date().toLocaleString(),
        isPaid: isLimitReached || showPayment,
        trxId: (isLimitReached || showPayment) ? trxId : undefined,
        paymentReason: reason
      });

      setIsProcessing(false);
      setIsSubmitted(true);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="py-20 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-slate-800 p-12 rounded-[3rem] shadow-2xl text-center max-w-lg w-full border border-green-100 animate-in zoom-in">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-white w-10 h-10" />
          </div>
          <h3 className="text-3xl font-black text-[#1A237E] dark:text-white mb-4">বিজ্ঞাপন জমা হয়েছে!</h3>
          <p className="text-slate-500 mb-8">অ্যাডমিন এটি যাচাই করার পর ২-৩ ঘণ্টার মধ্যে লাইভ হবে।</p>
          <button onClick={() => window.location.reload()} className="w-full py-4 bg-[#1A237E] text-white font-bold rounded-2xl">আরেকটি অ্যাড দিন</button>
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
            <h3 className="text-2xl font-black text-[#1A237E] dark:text-white mb-4">অতিরিক্ত ছবি যোগ করুন!</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">
              ৩টির বেশি ছবি যোগ করতে হলে আপনাকে ৳{settings.extraPostPrice} পেমেন্ট করতে হবে। এই পেমেন্টে আপনি ১০টি পর্যন্ত ছবি দিতে পারবেন এবং আপনার অ্যাডটি "Premium" হিসেবে গণ্য হবে।
            </p>
            <div className="space-y-4">
              <button 
                onClick={() => { setShowPayment(true); setPaymentType('image_limit'); setShowImageLimitModal(false); }} 
                className="w-full py-4 bg-[#1A237E] text-[#FFD600] font-bold rounded-2xl"
              >
                পেমেন্ট করে ছবি দিন
              </button>
              <button 
                onClick={() => setShowImageLimitModal(false)} 
                className="w-full py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl"
              >
                ৩টি ছবিই থাক
              </button>
            </div>
          </div>
        </div>
      )}

      {isLimitReached && !showPayment && (
        <div className="mb-8 p-8 bg-yellow-50 border-2 border-yellow-200 rounded-[2.5rem] flex items-center gap-6 animate-in slide-in-from-top-4">
          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shrink-0">
            <Rocket className="text-white w-8 h-8" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-[#1A237E]">প্রতিদিনের লিমিট শেষ!</h4>
            <p className="text-slate-600">আপনি ইতিমধ্যে ৩টি ফ্রি অ্যাড দিয়েছেন। অতিরিক্ত অ্যাড দিতে ৳{settings.extraPostPrice} পেমেন্ট করতে হবে।</p>
          </div>
          <button onClick={() => { setShowPayment(true); setPaymentType('daily_limit'); }} className="ml-auto px-6 py-3 bg-[#1A237E] text-[#FFD600] font-bold rounded-xl">পেমেন্ট করুন</button>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="bg-[#1A237E] p-10 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black">অ্যাড পোস্ট করুন</h2>
            <p className="text-blue-100 opacity-70">আপনার পণ্যের সঠিক তথ্য দিন</p>
          </div>
          {!isVerified && <div className="p-3 bg-white/10 rounded-xl text-xs font-bold border border-white/20">ফ্রি লিমিট: {postCountToday}/{settings.freePostLimit}</div>}
        </div>

        {showPayment ? (
          <div className="p-10 space-y-8 animate-in slide-in-from-right-4">
             <div className="text-center mb-6">
                <h4 className="text-xl font-black text-[#1A237E]">প্রিমিয়াম পেমেন্ট - {paymentType === 'image_limit' ? 'অতিরিক্ত ছবি' : 'পোস্ট লিমিট'}</h4>
                <p className="text-slate-500">নিচের নাম্বারে ৳{settings.extraPostPrice} সেন্ড মানি করুন</p>
             </div>
             <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="p-6 bg-pink-50 rounded-2xl border border-pink-100">
                    <p className="font-bold text-pink-600 mb-2">bKash (Personal)</p>
                    <p className="text-2xl font-black text-[#1A237E]">01516-595597</p>
                  </div>
                  <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100">
                    <p className="font-bold text-orange-600 mb-2">Nagad (Personal)</p>
                    <p className="text-2xl font-black text-[#1A237E]">01516-595597</p>
                  </div>
                </div>
                <div className="space-y-4">
                   <label className="block text-sm font-bold text-slate-700">Transaction ID (TrxID)</label>
                   <input type="text" placeholder="যেমন: AH78JK90" className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none border focus:border-[#1A237E]" value={trxId} onChange={e => setTrxId(e.target.value)} />
                   
                   <div className="pt-4">
                     <label className="block text-sm font-bold text-slate-700 mb-2">এখন ছবি যোগ করুন (১০টি পর্যন্ত)</label>
                     <div className="flex gap-2 overflow-x-auto pb-2">
                        {images.map((img, i) => (
                          <img key={i} src={img} className="w-12 h-12 rounded-lg object-cover border" />
                        ))}
                        <button onClick={() => fileInputRef.current?.click()} className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center"><Plus className="w-4 h-4" /></button>
                     </div>
                   </div>

                   <button onClick={handleFinalSubmit} disabled={isProcessing} className="w-full py-4 bg-[#1A237E] text-[#FFD600] font-black rounded-2xl flex items-center justify-center gap-2">
                     {isProcessing ? <Loader2 className="animate-spin" /> : <>পাবলিশ করুন <ChevronRight /></>}
                   </button>
                </div>
             </div>
          </div>
        ) : (
          <div className="p-10 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">পণ্যের নাম</label>
                <input type="text" placeholder="যেমন: আইফোন ১৫ প্রো" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none" value={productName} onChange={e => setProductName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">মূল্য (৳)</label>
                <input type="number" placeholder="৳" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none" value={price} onChange={e => setPrice(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">ক্যাটাগরি</label>
                <select className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none" value={category} onChange={e => setCategory(e.target.value)}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">অবস্থা</label>
                <div className="flex gap-4">
                  <button onClick={() => setCondition('New')} className={`flex-1 py-4 rounded-2xl font-bold transition-all ${condition === 'New' ? 'bg-[#1A237E] text-white' : 'bg-slate-50 text-slate-400'}`}>New</button>
                  <button onClick={() => setCondition('Used')} className={`flex-1 py-4 rounded-2xl font-bold transition-all ${condition === 'Used' ? 'bg-[#1A237E] text-white' : 'bg-slate-50 text-slate-400'}`}>Used</button>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">ব্র্যান্ড (ঐচ্ছিক)</label>
                <input type="text" placeholder="যেমন: Apple, Samsung" className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none" value={brand} onChange={e => setBrand(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">মডেল (ঐচ্ছিক)</label>
                <input type="text" placeholder="যেমন: Galaxy S24" className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none" value={model} onChange={e => setModel(e.target.value)} />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">লোকেশন</label>
                <div className="relative"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="যেমন: বাংলাদেশ" className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl outline-none" value={location} onChange={e => setLocation(e.target.value)} /></div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">ফোন নম্বর</label>
                <div className="relative"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="০১৫১৬৫৯৫..." className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl outline-none" value={phone} onChange={e => setPhone(e.target.value)} /></div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase">পণ্যের ছবি ({images.length}/{(isVerified || showPayment) ? 10 : 3})</label>
                {images.length >= 3 && !isVerified && !showPayment && (
                  <button onClick={() => setShowImageLimitModal(true)} className="text-[10px] font-black text-[#1A237E] bg-[#FFD600] px-3 py-1 rounded-full animate-pulse">আরও ছবি দিন (+পেইড)</button>
                )}
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {images.map((img, i) => (
                  <div key={i} className="relative w-28 h-28 rounded-2xl overflow-hidden border shrink-0 shadow-md">
                    <img src={img} className="w-full h-full object-cover" />
                    <button onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"><X className="w-3 h-3" /></button>
                  </div>
                ))}
                {(images.length < ((isVerified || showPayment) ? 10 : 3)) && (
                  <div onClick={() => fileInputRef.current?.click()} className="w-28 h-28 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#1A237E] text-slate-400 shrink-0 bg-slate-50">
                    <Camera /><span className="text-[10px] mt-1 font-bold">ছবি যোগ করুন</span>
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleImageUpload} />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase">বিস্তারিত বিবরণ</label>
                <button 
                  onClick={generateAIDescription}
                  className="flex items-center text-[10px] font-black text-[#1A237E] bg-[#FFD600] px-4 py-2 rounded-full hover:shadow-md transition-all"
                >
                  <Sparkles className="w-3 h-3 mr-2" /> {isGenerating ? "তৈরি হচ্ছে..." : "AI দিয়ে লিখুন"}
                </button>
              </div>
              <textarea rows={4} placeholder="পণ্য সম্পর্কে বিস্তারিত লিখুন..." className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none resize-none border focus:border-[#1A237E]" value={description} onChange={e => setDescription(e.target.value)}></textarea>
            </div>

            <button 
              onClick={isLimitReached ? () => setShowPayment(true) : handleFinalSubmit} 
              className="w-full py-6 bg-[#1A237E] text-[#FFD600] font-black rounded-3xl shadow-2xl hover:scale-[1.01] transition-all text-xl"
            >
              {isLimitReached ? 'পেমেন্ট ও পাবলিশ' : 'বিজ্ঞাপনটি জমা দিন'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostAd;
