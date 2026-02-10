
import React from 'react';
import { Target, Users, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface AboutUsProps {
  language: Language;
}

const AboutUs: React.FC<AboutUsProps> = ({ language }) => {
  const t = {
    title: language === 'bn' ? 'আমাদের লক্ষ্য ও উদ্দেশ্য' : 'Our Mission & Vision',
    mainText: language === 'bn' 
      ? '"Bazaari শুধু একটি মার্কেটপ্লেস নয়, এটি আপনার লাইফস্টাইলের একটি অংশ। আমাদের যাত্রা শুরু হয়েছে প্রতিটি মানুষের কাছে বিশ্বস্ত ও মানসম্মত পণ্য সহজে পৌঁছে দেওয়ার স্বপ্ন নিয়ে।"'
      : '"Bazaari is not just a marketplace; it is a part of your lifestyle. Our journey began with the dream of delivering trusted and quality products to everyone easily."',
    visionTitle: language === 'bn' ? 'আমাদের ভিশন' : 'Our Vision',
    visionText: language === 'bn'
      ? 'বাংলাদেশের শীর্ষস্থানীয় ই-কমার্স প্ল্যাটফর্ম হিসেবে নিজেকে প্রতিষ্ঠিত করা, যেখানে প্রতিটি কেনাকাটা হবে স্বচ্ছ এবং আনন্দদায়ক।'
      : 'To establish ourselves as the leading e-commerce platform in Bangladesh, where every purchase is transparent and delightful.',
    diffTitle: language === 'bn' ? 'কেন আমরা আলাদা?' : 'Why Are We Different?',
    diffText: language === 'bn'
      ? 'আমরা সরাসরি ব্র্যান্ড এবং ভেন্ডরদের সাথে কাজ করি যাতে আমাদের কাস্টমাররা পান সেরা কোয়ালিটির নিশ্চয়তা। প্রতিটি ডেলিভারি আমাদের জন্য একটি আস্থার গল্প।'
      : 'We work directly with brands and vendors to ensure our customers receive the best quality. Every delivery is a story of trust for us.',
    happyCust: language === 'bn' ? 'হ্যাপি কাস্টমার' : 'Happy Customers',
    vendors: language === 'bn' ? 'ভেন্ডর' : 'Vendors',
    support: language === 'bn' ? 'সাপোর্ট' : 'Support'
  };

  return (
    <div className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A237E] dark:text-white mb-6">{t.title}</h2>
          <div className="w-20 h-1.5 bg-[#FFD600] mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed italic">
              {t.mainText}
            </p>
            
            <div className="flex gap-6 p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="bg-[#1A237E] p-4 rounded-xl shrink-0 h-fit">
                <Target className="text-white w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1A237E] dark:text-[#FFD600] mb-2">{t.visionTitle}</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {t.visionText}
                </p>
              </div>
            </div>

            <div className="flex gap-6 p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="bg-[#1A237E] p-4 rounded-xl shrink-0 h-fit">
                <Sparkles className="text-white w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1A237E] dark:text-[#FFD600] mb-2">{t.diffTitle}</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {t.diffText}
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img src="https://picsum.photos/seed/team1/300/400" className="rounded-2xl shadow-lg mt-8" alt="Team" />
              <img src="https://picsum.photos/seed/store/300/400" className="rounded-2xl shadow-lg" alt="Store" />
            </div>
            {/* Stats Overlay */}
            <div className="absolute -bottom-10 left-10 right-10 bg-[#1A237E] p-8 rounded-2xl flex justify-around text-white shadow-2xl">
              <div className="text-center border-r border-white/20 pr-4">
                <p className="text-3xl font-bold text-[#FFD600]">১০কে+</p>
                <p className="text-xs uppercase opacity-80">{t.happyCust}</p>
              </div>
              <div className="text-center border-r border-white/20 pr-4">
                <p className="text-3xl font-bold text-[#FFD600]">৫০+</p>
                <p className="text-xs uppercase opacity-80">{t.vendors}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#FFD600]">২৪/৭</p>
                <p className="text-xs uppercase opacity-80">{t.support}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
