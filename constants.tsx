
import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Phone } from 'lucide-react';
import { Product, Category, BoostPlan, VerifyPlan } from './types.ts';

export const COLORS = {
  primary: '#1A237E', 
  secondary: '#FFD600', 
  accent: '#F59E0B',
  bg: '#F8FAFC',
  text: '#0F172A',
  white: '#FFFFFF'
};

export const BOOST_PLANS: BoostPlan[] = [
  { id: '3d', days: 3, price: 150, description: 'দ্রুত বিক্রির জন্য সেরা' },
  { id: '7d', days: 7, price: 299, description: 'সবচেয়ে জনপ্রিয় চয়েস' },
  { id: '15d', days: 15, price: 550, description: 'ম্যাক্সিমাম কাস্টমার রিচ' },
  { id: '30d', days: 30, price: 999, description: 'দীর্ঘমেয়াদী বিজ্ঞাপনের জন্য' }
];

export const VERIFY_PLANS: VerifyPlan[] = [
  { id: '1m', duration: '১ মাস', price: 99, desc: 'নতুন ভেন্ডরদের জন্য' },
  { id: '6m', duration: '৬ মাস', price: 499, desc: 'সেরা ভ্যালু ও বিশ্বাসযোগ্যতা' },
  { id: '1y', duration: '১ বছর', price: 899, desc: 'প্রফেশনাল বিজনেস অ্যাকাউন্ট' }
];

export const CATEGORIES: Category[] = [
  { id: 'fashion', name: 'ফ্যাশন', icon: '👕' },
  { id: 'gadgets', name: 'গ্যাজেটস', icon: '⌚' },
  { id: 'perfume', name: 'পারফিউম', icon: '✨' },
  { id: 'electronics', name: 'ইলেকট্রনিক্স', icon: '🎧' },
  { id: 'lifestyle', name: 'লাইফস্টাইল', icon: '🏠' },
  { id: 'tolet', name: 'টু-লেট', icon: '🏘️' },
];

export const PRODUCTS: Product[] = [];

export const TRUST_BADGES = [
  { icon: <ShieldCheck className="w-8 h-8" />, title: '১০০% অথেনটিক', desc: 'অরিজিনাল ব্র্যান্ডের নিশ্চয়তা' },
  { icon: <Truck className="w-8 h-8" />, title: 'ফাস্ট ডেলিভারি', desc: 'সারা দেশে দ্রুত পৌঁছে দেই' },
  { icon: <RefreshCw className="w-8 h-8" />, title: '৭ দিনের রিটার্ন', desc: 'সহজ ও নিরাপদ পলিসি' },
  { icon: <Phone className="w-8 h-8" />, title: '২৪/৭ সাপোর্ট', desc: 'আপনাদের সেবায় আমরা সদা প্রস্তুত' }
];
