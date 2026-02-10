
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Sparkles, Plus, AlertCircle, LogIn, CheckCircle, X, Rocket, ShieldCheck, MapPin, Phone, CreditCard, Zap, ChevronRight, Loader2, Image as ImageIcon, Smartphone, Lock, ChevronDown, Users, UserCheck, Home } from 'lucide-react';
import { PostRequest, Product, AdminSettings, Language } from '../types.ts';
import { CATEGORIES } from '../constants.tsx';
import { GoogleGenAI } from "@google/genai";

// Comprehensive Hierarchical Location Data for Bangladesh
const BD_LOCATIONS: Record<string, Record<string, string[]>> = {
  "Dhaka": {
    "Dhaka": ["Dhanmondi", "Gulshan", "Mirpur", "Uttara", "Badda", "Motijheel", "Savar", "Keraniganj", "Ashulia", "Tongi", "Demra", "Khilgaon", "Mohammadpur", "Tejgaon"],
    "Gazipur": ["Gazipur Sadar", "Sreepur", "Kaliakair", "Kapasia", "Kaliganj"],
    "Narayanganj": ["Narayanganj Sadar", "Fatullah", "Siddhirganj", "Rupganj", "Araihazar", "Sonargaon"],
    "Tangail": ["Tangail Sadar", "Madhupur", "Gopalpur", "Sakhipur", "Mirzapur", "Bhuapur", "Kalihati", "Ghatail"],
    "Faridpur": ["Faridpur Sadar", "Bhanga", "Boalmari", "Nagarkanda", "Sadarpur", "Alfadanga"],
    "Manikganj": ["Manikganj Sadar", "Singair", "Shivalaya", "Saturia", "Harirampur", "Ghior"],
    "Munshiganj": ["Munshiganj Sadar", "Sreenagar", "Lohajang", "Sirajdikhan", "Tongibari", "Gajaria"],
    "Narsingdi": ["Narsingdi Sadar", "Belabo", "Monohardi", "Palash", "Raipura", "Shibpur"],
    "Rajbari": ["Rajbari Sadar", "Goalanda", "Pangsha", "Baliakandi", "Kalukhali"],
    "Shariatpur": ["Shariatpur Sadar", "Damudya", "Naria", "Zajira", "Bhedarganj", "Gosairhat"],
    "Madaripur": ["Madaripur Sadar", "Shibchar", "Kalkini", "Rajoir"],
    "Gopalganj": ["Gopalganj Sadar", "Kashiani", "Kotalipara", "Muksudpur", "Tungipara"],
    "Kishoreganj": ["Kishoreganj Sadar", "Bhairab", "Itna", "Karimganj", "Katiadi", "Kuliarchar", "Mithamain", "Nikli", "Pakundia"]
  },
  "Chattogram": {
    "Chattogram": ["Panchlaish", "Double Mooring", "Halishahar", "Patiya", "Hathazari", "Sitakunda", "Anwara", "Banshkhali", "Boalkhali", "Chandanaish", "Fatikchhari", "Lohagara", "Mirsharai", "Raozan", "Rangunia", "Sandwip"],
    "Cox's Bazar": ["Cox's Bazar Sadar", "Chakaria", "Teknaf", "Ukhiya", "Ramu", "Maheshkhali", "Pekua", "Kutubdia"],
    "Cumilla": ["Cumilla Sadar", "Laksam", "Daudkandi", "Chauddagram", "Barura", "Brahmanpara", "Burichang", "Chandina", "Debidwar", "Homna", "Muradnagar", "Nangalkot", "Titas"],
    "Feni": ["Feni Sadar", "Daganbhuiyan", "Chhagalnaiya", "Parshuram", "Fulgazi", "Sonagazi"],
    "Brahmanbaria": ["Brahmanbaria Sadar", "Ashuganj", "Bancharampur", "Kasba", "Nabinagar", "Nasirnagar", "Sarail"],
    "Rangamati": ["Rangamati Sadar", "Belaichhari", "Baghaichhari", "Barkal", "Kawkhali", "Langadu", "Naniyarchar", "Rajasthali"],
    "Noakhali": ["Noakhali Sadar", "Begumganj", "Chatkhil", "Companiganj", "Hatiya", "Senbagh", "Subarnachar"],
    "Chandpur": ["Chandpur Sadar", "Faridganj", "Hajiganj", "Hayemchar", "Kachua", "Matlab North", "Matlab South", "Shahrasti"],
    "Lakshmipur": ["Lakshmipur Sadar", "Raipur", "Ramganj", "Ramgati", "Kamalnagar"],
    "Khagrachhari": ["Khagrachhari Sadar", "Dighinala", "Lakshmichhari", "Mahalchhari", "Manikchhari", "Matiranga", "Panchhari", "Ramgarh"],
    "Bandarban": ["Bandarban Sadar", "Alikadam", "Lama", "Naikhongchhari", "Rowangchhari", "Ruma", "Thanchi"]
  },
  "Rajshahi": {
    "Rajshahi": ["Boalia", "Motihar", "Rajpara", "Shah Mokhdum", "Paba", "Bagmara", "Godagari", "Charghat", "Durgapur", "Mohanpur", "Puthia", "Tanore"],
    "Bogura": ["Bogura Sadar", "Sherpur", "Shajahanpur", "Dhunat", "Adamdighi", "Dhupchanchia", "Gabtali", "Kahaloo", "Nandigram", "Sariakandi", "Sonatala"],
    "Pabna": ["Pabna Sadar", "Ishwardi", "Santhia", "Bera", "Atgharia", "Chatmohar", "Faridpur", "Sujanagar"],
    "Naogaon": ["Naogaon Sadar", "Patnitala", "Mahadebpur", "Atrai", "Badalgachhi", "Dhamoirhat", "Manda", "Niamatpur", "Porsha", "Raninagar", "Sapahar"],
    "Natore": ["Natore Sadar", "Bagatipara", "Baraigram", "Gurudaspur", "Lalpur", "Singra"],
    "Chapai Nawabganj": ["Chapai Nawabganj Sadar", "Bholahat", "Gomastapur", "Nachole", "Shibganj"],
    "Joypurhat": ["Joypurhat Sadar", "Akkelpur", "Kalai", "Khetlal", "Panchbibi"],
    "Sirajganj": ["Sirajganj Sadar", "Belkuchi", "Chauhali", "Kamarkhanda", "Kazipur", "Raiganj", "Shahjadpur", "Tarash", "Ullapara"]
  },
  "Khulna": {
    "Khulna": ["Khulna Sadar", "Daulatpur", "Khalishpur", "Phultala", "Dumuria", "Batiaghata", "Dacope", "Dighalia", "Koyra", "Paikgachha", "Rupsha", "Terokhada"],
    "Jashore": ["Jashore Sadar", "Sharsha", "Jhikargacha", "Abhaynagar", "Bagherpara", "Chaugachha", "Keshabpur", "Manirampur"],
    "Kushtia": ["Kushtia Sadar", "Kumarkhali", "Bheramara", "Daulatpur", "Khoksa", "Mirpur"],
    "Bagerhat": ["Bagerhat Sadar", "Chitalmari", "Fakirhat", "Kachua", "Mollahat", "Mongla", "Morrelganj", "Rampal", "Sarankhola"],
    "Chuadanga": ["Chuadanga Sadar", "Alamdanga", "Damurhuda", "Jibannagar"],
    "Jhenaidah": ["Jhenaidah Sadar", "Harakunda", "Kaliganj", "Kotchandpur", "Maheshpur", "Shailkupa"],
    "Magura": ["Magura Sadar", "Mohammadpur", "Shalikha", "Sreepur"],
    "Meherpur": ["Meherpur Sadar", "Gangni", "Mujibnagar"],
    "Narail": ["Narail Sadar", "Kalia", "Lohagara"],
    "Satkhira": ["Satkhira Sadar", "Assasuni", "Debhata", "Kalaroa", "Kaliganj", "Shyamnagar", "Tala"]
  },
  "Barishal": {
    "Barishal": ["Barishal Sadar", "Bakerganj", "Mehendiganj", "Banaripara", "Agailjhara", "Babuganj", "Gournadi", "Hizla", "Muladi", "Wazirpur"],
    "Bhola": ["Bhola Sadar", "Char Fasson", "Lalmohan", "Burhanuddin", "Daulatkhan", "Manpura", "Tazumuddin"],
    "Jhalokathi": ["Jhalokathi Sadar", "Kathalia", "Nalchity", "Rajapur"],
    "Patuakhali": ["Patuakhali Sadar", "Bauphal", "Dashmina", "Galachipa", "Kalapara", "Mirzaganj", "Rangabali", "Dumki"],
    "Pirojpur": ["Pirojpur Sadar", "Bhandaria", "Kawkhali", "Mathbaria", "Nazirpur", "Nesarabad", "Zianagar"],
    "Barguna": ["Barguna Sadar", "Amtali", "Bamna", "Betagi", "Patharghata", "Taltali"]
  },
  "Sylhet": {
    "Sylhet": ["Sylhet Sadar", "Beanibazar", "Golapganj", "Zakiganj", "Balaganj", "Bishwanath", "Fenchuganj", "Gowainghat", "Jaintiapur", "Kanaighat", "Osmani Nagar", "South Surma"],
    "Moulvibazar": ["Moulvibazar Sadar", "Sreemangal", "Kulaura", "Barlekha", "Juri", "Rajnagar", "Kamalganj"],
    "Habiganj": ["Habiganj Sadar", "Ajmiriganj", "Bahubal", "Baniyachong", "Chunarughat", "Lakhai", "Madhabpur", "Nabiganj"],
    "Sunamganj": ["Sunamganj Sadar", "Bishwamvapur", "Chhatak", "Derai", "Dharamapasha", "Dowarabazar", "Jagannathpur", "Jamalganj", "Sullah", "Tahirpur", "South Sunamganj"]
  },
  "Rangpur": {
    "Rangpur": ["Rangpur Sadar", "Mithapukur", "Pirganj", "Badarganj", "Gangachara", "Kaunia", "Pirgachha", "Taraganj"],
    "Dinajpur": ["Dinajpur Sadar", "Birganj", "Parbatipur", "Birampur", "Biral", "Bochaganj", "Chirirbandar", "Ghoraghat", "Hakimpur", "Kaharole", "Khansama", "Nawabganj", "Phulbari"],
    "Gaibandha": ["Gaibandha Sadar", "Fulchhari", "Gobindaganj", "Palashbari", "Sadullapur", "Saghata", "Sundarganj"],
    "Kurigram": ["Kurigram Sadar", "Bhurungamari", "Chilmari", "Phulbari", "Rajarhat", "Rajibpur", "Roumari", "Nageshwari", "Ulipur"],
    "Lalmonirhat": ["Lalmonirhat Sadar", "Aditmari", "Hatibandha", "Kaliganj", "Patgram"],
    "Nilphamari": ["Nilphamari Sadar", "Dimla", "Domar", "Jaldhaka", "Kishoreganj", "Saidpur"],
    "Panchagarh": ["Panchagarh Sadar", "Atwari", "Boda", "Debiganj", "Tetulia"],
    "Thakurgaon": ["Thakurgaon Sadar", "Baliadangi", "Haripur", "Pirganj", "Ranisankail"]
  },
  "Mymensingh": {
    "Mymensingh": ["Mymensingh Sadar", "Muktagacha", "Fulbaria", "Trishal", "Bhaluka", "Gauripur", "Haluaghat", "Ishwarganj", "Nandail", "Phulpur", "Dhobaura", "Tara Khanda"],
    "Jamalpur": ["Jamalpur Sadar", "Sarishabari", "Islampur", "Baxiganj", "Dewanganj", "Madarganj", "Melandaha"],
    "Netrokona": ["Netrokona Sadar", "Atpara", "Barhatta", "Durgapur", "Khaliajuri", "Kalmakanda", "Kendua", "Madan", "Mohanganj", "Purbadhala"],
    "Sherpur": ["Sherpur Sadar", "Jhenaigati", "Nakla", "Nalitabari", "Sreebardi"]
  }
};

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
  
  // Location States
  const [div, setDiv] = useState('');
  const [dist, setDist] = useState('');
  const [upz, setUpz] = useState('');
  const [customArea, setCustomArea] = useState('');

  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Fashion');
  const [rentalType, setRentalType] = useState<'Bachelor' | 'Family' | null>(null);
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

  // Sync category if a global signal is received
  useEffect(() => {
    const handleToLetNav = () => {
      setCategory('টু-লেট');
    };
    window.addEventListener('navToPostToLet', handleToLetNav);
    return () => window.removeEventListener('navToPostToLet', handleToLetNav);
  }, []);

  const isToLet = category === 'টু-লেট';

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
    title: isToLet ? (language === 'bn' ? 'টু-লেট পোস্ট করুন' : 'Post a To-Let') : (language === 'bn' ? 'অ্যাড পোস্ট করুন' : 'Post Your Ad'),
    subtitle: language === 'bn' ? 'আপনার পণ্যের সঠিক তথ্য দিন' : 'Provide correct info for your product',
    limit: language === 'bn' ? `ফ্রি লিমিট: ${postCountToday}/${settings.freePostLimit}` : `Free Limit: ${postCountToday}/${settings.freePostLimit}`,
    prodName: isToLet ? (language === 'bn' ? 'বাসার নাম বা ফ্ল্যাট নম্বর' : 'House Name or Flat No') : (language === 'bn' ? 'পণ্যের নাম' : 'Product Name'),
    price: isToLet ? (language === 'bn' ? 'মাসিক ভাড়া (৳)' : 'Monthly Rent (৳)') : (language === 'bn' ? 'মূল্য (৳)' : 'Price (৳)'),
    category: language === 'bn' ? 'ক্যাটাগরি' : 'Category',
    rentalType: language === 'bn' ? 'ভাড়াটিয়া সিলেকশন' : 'Tenant Type',
    location: language === 'bn' ? 'লোকেশন' : 'Location',
    div: language === 'bn' ? 'বিভাগ' : 'Division',
    dist: language === 'bn' ? 'জেলা' : 'District',
    upz: language === 'bn' ? 'উপজেলা' : 'Upazila',
    customArea: language === 'bn' ? 'নির্দিষ্ট এলাকা/বাসার ঠিকানা' : 'Specific Area/House Address',
    phone: language === 'bn' ? 'ফোন নম্বর' : 'Phone Number',
    images: language === 'bn' ? 'পণ্যের ছবি' : 'Product Images',
    desc: language === 'bn' ? 'বিস্তারিত বিবরণ' : 'Description',
    submitBtn: language === 'bn' ? 'বিজ্ঞাপনটি জমা দিন' : 'Submit Ad',
    paidBtn: language === 'bn' ? 'পেমেন্ট ও পাবলিশ' : 'Pay & Publish',
    successTitle: language === 'bn' ? 'বিজ্ঞাপন জমা হয়েছে!' : 'Ad Submitted!',
    aiBtn: language === 'bn' ? 'AI দিয়ে লিখুন' : 'Write with AI',
    extraImgBtn: language === 'bn' ? '১০০ ছবি পর্যন্ত (+৳৫০)' : 'Add up to 100 photos (+৳50)',
    trxLabel: language === 'bn' ? 'ট্রানজ্যাকশন আইডি (TrxID)' : 'Transaction ID (TrxID)',
    boostBtn: language === 'bn' ? 'এই অ্যাডটি বুস্ট করুন' : 'Boost this Post',
    anotherBtn: language === 'bn' ? 'আরেকটি অ্যাড দিন' : 'Post Another Ad',
    payTitle: language === 'bn' ? 'পেমেন্ট গেটওয়ে' : 'Payment Gateway',
    paySub: language === 'bn' ? 'অতিরিক্ত ফি জমা দিন' : 'Submit Extra Fee'
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const isPaidImages = showPayment && paymentType === 'image_limit';
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
      const prompt = `Write a professional and attractive description in ${language === 'bn' ? 'Bengali' : 'English'} for: "${productName}". Category: ${category}. ${isToLet ? 'This is a house rental ad.' : ''} Concise and high quality.`;
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      if (response.text) setDescription(response.text.trim());
    } catch (error) {
      alert(language === 'bn' ? 'AI ডেসক্রিপশন তৈরিতে সমস্যা হয়েছে।' : 'AI description failed.');
    } finally { setIsGenerating(false); }
  };

  const handleFinalSubmit = () => {
    if (!productName || !price || images.length === 0 || !div || !dist || !upz || !phone || (isToLet && !rentalType)) {
      alert(language === 'bn' ? 'দয়া করে সকল তথ্য, লোকেশন ও ভাড়ার ধরণ প্রদান করুন।' : 'Please provide all info, location and rental type.');
      return;
    }
    const fullLocation = `${customArea ? customArea + ', ' : ''}${upz}, ${dist}, ${div}`;
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
        location: fullLocation,
        phone,
        rentalType: isToLet ? rentalType || undefined : undefined
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
          <div className="space-y-4">
             <button onClick={() => lastSubmittedProduct && onBoostClick(lastSubmittedProduct)} className="w-full py-5 bg-[#1A237E] text-[#FFD600] font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all"><Rocket className="w-6 h-6" /> {t.boostBtn}</button>
             <button onClick={() => window.location.reload()} className="w-full py-4 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-white font-bold rounded-2xl">{t.anotherBtn}</button>
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
            <h3 className="text-2xl font-black text-[#1A237E] dark:text-white mb-4">{language === 'bn' ? 'অতিরিক্ত ছবি প্রয়োজন?' : 'Need More Photos?'}</h3>
            <div className="space-y-4">
              <button onClick={() => { setPaymentType('image_limit'); setShowPayment(true); setShowImageLimitModal(false); }} className="w-full py-4 bg-[#1A237E] text-[#FFD600] font-bold rounded-2xl">পেমেন্ট করুন</button>
              <button onClick={() => setShowImageLimitModal(false)} className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold rounded-2xl">বাতিল</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="bg-[#1A237E] p-10 text-white flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-[#FFD600] p-3 rounded-2xl">
              {isToLet ? <Home className="text-[#1A237E] w-8 h-8" /> : <Plus className="text-[#1A237E] w-8 h-8" />}
            </div>
            <div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">{t.title}</h2>
              <p className="text-blue-100 opacity-70 font-medium">{t.subtitle}</p>
            </div>
          </div>
          {!isVerified && <div className="p-3 bg-white/10 rounded-xl text-xs font-bold border border-white/20">{t.limit}</div>}
        </div>

        {showPayment ? (
          <div className="p-10 space-y-8">
             <div className="text-center mb-6"><h4 className="text-xl font-black text-[#1A237E] dark:text-white">{t.payTitle}</h4><p className="text-[#FFD600] font-black text-2xl">{t.paySub}</p></div>
             <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-2xl border border-pink-100 flex justify-between"><span className="font-bold text-pink-600">bKash</span><span className="font-black dark:text-white">01516-595597</span></div>
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 flex justify-between"><span className="font-bold text-orange-600">Nagad</span><span className="font-black dark:text-white">01516-595597</span></div>
                </div>
                <div className="space-y-4">
                   <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">{t.trxLabel}</label>
                   <input type="text" placeholder="Transaction ID" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border focus:border-[#1A237E] dark:text-white" value={trxId} onChange={e => setTrxId(e.target.value)} />
                   <button onClick={handleFinalSubmit} disabled={isProcessing} className="w-full py-4 bg-[#1A237E] text-[#FFD600] font-black rounded-2xl flex items-center justify-center gap-2">{isProcessing ? <Loader2 className="animate-spin" /> : <>{language === 'bn' ? 'পাবলিশ করুন' : 'Verify & Publish'} <ChevronRight /></>}</button>
                </div>
             </div>
          </div>
        ) : (
          <div className="p-10 space-y-10">
            {/* Conditional Rental Selection - Make it LARGE and Visual */}
            {isToLet && (
              <div className="space-y-6 animate-in slide-in-from-top-4">
                <label className="text-sm font-black text-slate-500 uppercase tracking-widest block text-center mb-4">{t.rentalType}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <button 
                    onClick={() => setRentalType('Bachelor')}
                    className={`group relative p-8 rounded-[2.5rem] border-4 transition-all flex flex-col items-center justify-center gap-4 overflow-hidden ${
                      rentalType === 'Bachelor' 
                        ? 'bg-[#1A237E] border-[#FFD600] text-white shadow-2xl scale-105' 
                        : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xl'
                    }`}
                  >
                    <div className={`p-5 rounded-3xl transition-colors ${rentalType === 'Bachelor' ? 'bg-[#FFD600]/20' : 'bg-white dark:bg-slate-900 shadow-sm'}`}>
                      <Users className={`w-12 h-12 ${rentalType === 'Bachelor' ? 'text-[#FFD600]' : 'text-slate-400'}`} />
                    </div>
                    <div className="text-center">
                      <span className="font-black text-2xl uppercase italic tracking-tighter">Bachelor</span>
                      <p className={`text-[10px] font-bold mt-1 ${rentalType === 'Bachelor' ? 'text-blue-200' : 'text-slate-400'}`}>ছাত্র বা চাকুরিজীবীদের জন্য</p>
                    </div>
                    {rentalType === 'Bachelor' && <CheckCircle className="absolute top-4 right-4 w-8 h-8 text-[#FFD600]" />}
                  </button>

                  <button 
                    onClick={() => setRentalType('Family')}
                    className={`group relative p-8 rounded-[2.5rem] border-4 transition-all flex flex-col items-center justify-center gap-4 overflow-hidden ${
                      rentalType === 'Family' 
                        ? 'bg-pink-600 border-[#FFD600] text-white shadow-2xl scale-105' 
                        : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xl'
                    }`}
                  >
                    <div className={`p-5 rounded-3xl transition-colors ${rentalType === 'Family' ? 'bg-white/20' : 'bg-white dark:bg-slate-900 shadow-sm'}`}>
                      <UserCheck className={`w-12 h-12 ${rentalType === 'Family' ? 'text-white' : 'text-slate-400'}`} />
                    </div>
                    <div className="text-center">
                      <span className="font-black text-2xl uppercase italic tracking-tighter">Family</span>
                      <p className={`text-[10px] font-bold mt-1 ${rentalType === 'Family' ? 'text-pink-100' : 'text-slate-400'}`}>সপরিবারে থাকার জন্য</p>
                    </div>
                    {rentalType === 'Family' && <CheckCircle className="absolute top-4 right-4 w-8 h-8 text-[#FFD600]" />}
                  </button>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">{t.prodName}</label>
                <input type="text" placeholder={isToLet ? "e.g. Dream House / Flat 4A" : "Product Name"} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl outline-none border-2 border-transparent focus:border-[#1A237E] transition-all font-bold" value={productName} onChange={e => setProductName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">{t.price}</label>
                <input type="number" placeholder="৳" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl outline-none border-2 border-transparent focus:border-[#1A237E] transition-all font-black text-[#1A237E] dark:text-[#FFD600]" value={price} onChange={e => setPrice(e.target.value)} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">{t.category}</label>
                <div className="relative">
                  <select className="w-full pl-6 pr-10 py-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl outline-none appearance-none border-2 border-transparent focus:border-[#1A237E] font-bold" value={category} onChange={e => setCategory(e.target.value)}>
                    {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2 flex flex-col justify-end">
                <button onClick={generateAIDescription} className="w-full py-4 bg-[#FFD600] text-[#1A237E] font-black rounded-2xl hover:shadow-md transition-all flex items-center justify-center gap-2 uppercase text-xs">
                  <Sparkles className="w-4 h-4" /> {isGenerating ? "..." : t.aiBtn}
                </button>
              </div>
            </div>

            <div className="space-y-6 bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
               <h3 className="text-xl font-black text-[#1A237E] dark:text-[#FFD600] flex items-center gap-2 mb-4 uppercase italic"><MapPin className="w-5 h-5" /> {t.location}</h3>
               <div className="grid md:grid-cols-3 gap-6">
                  <select className="w-full pl-6 pr-10 py-4 bg-white dark:bg-slate-900 dark:text-white rounded-2xl outline-none appearance-none border-2 border-transparent focus:border-[#1A237E] font-bold" value={div} onChange={(e) => { setDiv(e.target.value); setDist(''); setUpz(''); }}><option value="">Select Division</option>{Object.keys(BD_LOCATIONS).map(d => <option key={d} value={d}>{d}</option>)}</select>
                  <select disabled={!div} className="w-full pl-6 pr-10 py-4 bg-white dark:bg-slate-900 dark:text-white rounded-2xl outline-none appearance-none border-2 border-transparent focus:border-[#1A237E] font-bold disabled:opacity-50" value={dist} onChange={(e) => { setDist(e.target.value); setUpz(''); }}><option value="">Select District</option>{div && Object.keys(BD_LOCATIONS[div]).map(d => <option key={d} value={d}>{d}</option>)}</select>
                  <select disabled={!dist} className="w-full pl-6 pr-10 py-4 bg-white dark:bg-slate-900 dark:text-white rounded-2xl outline-none appearance-none border-2 border-transparent focus:border-[#1A237E] font-bold disabled:opacity-50" value={upz} onChange={(e) => setUpz(e.target.value)}><option value="">Select Upazila</option>{div && dist && BD_LOCATIONS[div][dist].map(u => <option key={u} value={u}>{u}</option>)}</select>
               </div>
               <input type="text" placeholder="e.g. House 12, Road 05, Mirpur 10" className="w-full px-6 py-4 mt-4 bg-white dark:bg-slate-900 dark:text-white rounded-2xl outline-none border-2 border-transparent focus:border-[#1A237E] transition-all font-medium" value={customArea} onChange={e => setCustomArea(e.target.value)} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">{t.phone}</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input type="text" placeholder="01712xxxxxx" className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl outline-none border-2 border-transparent focus:border-[#1A237E]" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-500 uppercase">{t.images} ({images.length}/3)</label>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {images.map((img, i) => (<div key={i} className="relative w-28 h-28 rounded-2xl overflow-hidden border shrink-0"><img src={img} className="w-full h-full object-cover" /><button onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"><X className="w-3 h-3" /></button></div>))}
                {images.length < 100 && (<div onClick={() => fileInputRef.current?.click()} className="w-28 h-28 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#1A237E] text-slate-400 shrink-0 bg-slate-50 dark:bg-slate-800"><Camera /><span className="text-[10px] mt-1 font-bold">ছবি দিন</span></div>)}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleImageUpload} />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">{t.desc}</label>
              <textarea rows={4} placeholder={isToLet ? "বাসার বিস্তারিত বিবরণ দিন (যেমন: কত তলা, কয়টি রুম, বারান্দা আছে কি না ইত্যাদি)..." : "বিস্তারিত বিবরণ লিখুন..."} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl outline-none resize-none border focus:border-[#1A237E] dark:border-slate-700 font-medium" value={description} onChange={e => setDescription(e.target.value)}></textarea>
            </div>

            <button onClick={handleFinalSubmit} className="w-full py-6 bg-[#1A237E] text-[#FFD600] font-black rounded-3xl shadow-2xl hover:scale-[1.01] transition-all text-xl uppercase italic tracking-widest">
              {isLimitReached || (images.length > 3 && !isVerified) ? t.paidBtn : t.submitBtn}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostAd;
