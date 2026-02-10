
import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[#1A237E] mb-4">আমাদের সাথে যোগাযোগ করুন</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">যেকোনো প্রশ্ন বা সহযোগিতার জন্য আমাদের মেসেজ দিন। আমাদের টিম দ্রুত আপনার সাথে যোগাযোগ করবে।</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Info Cards */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-4">
              <div className="bg-blue-50 p-4 rounded-2xl text-[#1A237E]">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-[#1A237E] mb-1">ফোন করুন</h4>
                <p className="text-slate-500 text-sm">+৮৮০ ১৫১৬ ৫৯৫ ৫৯৭</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-4">
              <div className="bg-pink-50 p-4 rounded-2xl text-pink-600">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-[#1A237E] mb-1">ইমেইল</h4>
                <p className="text-slate-500 text-sm">bazaarihelp@gmail.com</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-4">
              <div className="bg-green-50 p-4 rounded-2xl text-green-600">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-[#1A237E] mb-1">হেড অফিস</h4>
                <p className="text-slate-500 text-sm">বাংলাদেশ</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white p-8 md:p-12 rounded-[40px] shadow-xl border border-slate-100">
            <form className="grid md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">আপনার নাম</label>
                <input type="text" placeholder="যেমন: আবরার আহমেদ" className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#1A237E] transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">ইমেইল অ্যাড্রেস</label>
                <input type="email" placeholder="example@mail.com" className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#1A237E] transition-all" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700">মেসেজের বিষয়</label>
                <input type="text" placeholder="কী বিষয়ে সাহায্য চান?" className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#1A237E] transition-all" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700">বিস্তারিত মেসেজ</label>
                <textarea rows={5} placeholder="আপনার কথাগুলো এখানে লিখুন..." className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#1A237E] transition-all resize-none"></textarea>
              </div>
              <button type="submit" className="md:col-span-2 py-4 bg-[#1A237E] text-[#FFD600] font-bold rounded-2xl hover:bg-opacity-95 shadow-lg flex items-center justify-center text-lg">
                মেসেজ পাঠান <Send className="ml-2 w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
