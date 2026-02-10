
import React from 'react';
import { Target, Users, Sparkles } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A237E] mb-6">আমাদের লক্ষ্য ও উদ্দেশ্য</h2>
          <div className="w-20 h-1.5 bg-[#FFD600] mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <p className="text-lg text-slate-600 leading-relaxed italic">
              "Bazaari শুধু একটি মার্কেটপ্লেস নয়, এটি আপনার লাইফস্টাইলের একটি অংশ। আমাদের যাত্রা শুরু হয়েছে প্রতিটি মানুষের কাছে বিশ্বস্ত ও মানসম্মত পণ্য সহজে পৌঁছে দেওয়ার স্বপ্ন নিয়ে।"
            </p>
            
            <div className="flex gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="bg-[#1A237E] p-4 rounded-xl shrink-0 h-fit">
                <Target className="text-white w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1A237E] mb-2">আমাদের ভিশন</h3>
                <p className="text-slate-600">
                  বাংলাদেশের শীর্ষস্থানীয় ই-কমার্স প্ল্যাটফর্ম হিসেবে নিজেকে প্রতিষ্ঠিত করা, যেখানে প্রতিটি কেনাকাটা হবে স্বচ্ছ এবং আনন্দদায়ক।
                </p>
              </div>
            </div>

            <div className="flex gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="bg-[#1A237E] p-4 rounded-xl shrink-0 h-fit">
                <Sparkles className="text-white w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1A237E] mb-2">কেন আমরা আলাদা?</h3>
                <p className="text-slate-600">
                  আমরা সরাসরি ব্র্যান্ড এবং ভেন্ডরদের সাথে কাজ করি যাতে আমাদের কাস্টমাররা পান সেরা কোয়ালিটির নিশ্চয়তা। প্রতিটি ডেলিভারি আমাদের জন্য একটি আস্থার গল্প।
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
                <p className="text-xs uppercase opacity-80">হ্যাপি কাস্টমার</p>
              </div>
              <div className="text-center border-r border-white/20 pr-4">
                <p className="text-3xl font-bold text-[#FFD600]">৫০+</p>
                <p className="text-xs uppercase opacity-80">ভেন্ডর</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#FFD600]">২৪/৭</p>
                <p className="text-xs uppercase opacity-80">সাপোর্ট</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
