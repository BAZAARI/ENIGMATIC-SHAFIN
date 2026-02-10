
import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Phone } from 'lucide-react';
import { Product, Category, BoostPlan, VerifyPlan } from './types';

export const COLORS = {
  primary: '#1A237E', // Royal Blue
  secondary: '#FFD600', // Golden Yellow
  accent: '#F59E0B',
  bg: '#F8FAFC',
  text: '#0F172A',
  white: '#FFFFFF'
};

export const BOOST_PLANS: BoostPlan[] = [
  { id: '3d', days: 3, price: 150, description: 'শর্ট টার্ম বিক্রির জন্য সেরা' },
  { id: '7d', days: 7, price: 299, description: 'সবচেয়ে জনপ্রিয় প্ল্যান' },
  { id: '15d', days: 15, price: 550, description: 'দীর্ঘমেয়াদী বিজ্ঞাপনের জন্য' }
];

export const VERIFY_PLANS: VerifyPlan[] = [
  { id: '1m', duration: '১ মাস', price: 99, desc: 'নতুন সেলারদের জন্য' },
  { id: '6m', duration: '৬ মাস', price: 499, desc: 'বিশ্বস্ততা বাড়াতে সেরা' },
  { id: '1y', duration: '১ বছর', price: 899, desc: 'প্রফেশনাল ভেন্ডরদের জন্য' }
];

export const CATEGORIES: Category[] = [
  { id: 'fashion', name: 'ফ্যাশন', icon: '👕' },
  { id: 'electronics', name: 'ইলেকট্রনিক্স', icon: '🎧' },
  { id: 'lifestyle', name: 'লাইফস্টাইল', icon: '🏠' },
  { id: 'beauty', name: 'বিউটি', icon: '💄' },
  { id: 'gadgets', name: 'গ্যাজেটস', icon: '⌚' },
];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'প্রিমিয়াম কটন পাঞ্জাবি - রয়্যাল ব্লু',
    price: 2450,
    originalPrice: 3200,
    image: 'https://picsum.photos/seed/p1/400/500',
    vendor: 'Elegant Threads',
    category: 'Fashion',
    rating: 4.8,
    reviews: 124,
    isFeatured: true
  },
  {
    id: 2,
    name: 'স্মার্ট ওয়াচ সিরিজ ৮ প্রিমিয়াম',
    price: 4200,
    originalPrice: 5500,
    image: 'https://picsum.photos/seed/p2/400/500',
    vendor: 'Gadget Hub',
    category: 'Gadgets',
    rating: 4.9,
    reviews: 89,
    isFeatured: true
  },
  {
    id: 3,
    name: 'লেদার ট্রাভেল ব্যাগ - ক্লাসিক ব্রাউন',
    price: 3800,
    originalPrice: 4800,
    image: 'https://picsum.photos/seed/p3/400/500',
    vendor: 'Leather Craft',
    category: 'Lifestyle',
    rating: 4.7,
    reviews: 56
  },
  {
    id: 4,
    name: 'ওয়্যারলেস নয়েজ ক্যানসেলিং হেডফোন',
    price: 8500,
    originalPrice: 10500,
    image: 'https://picsum.photos/seed/p4/400/500',
    vendor: 'Sound Master',
    category: 'Electronics',
    rating: 4.9,
    reviews: 210
  }
];

export const TRUST_BADGES = [
  { icon: <ShieldCheck className="w-8 h-8" />, title: '১০০% অথেনটিক', desc: 'অরিজিনাল ব্র্যান্ডের নিশ্চয়তা' },
  { icon: <Truck className="w-8 h-8" />, title: 'ফাস্ট ডেলিভারি', desc: 'সারা দেশে দ্রুত পৌঁছে দেই' },
  { icon: <RefreshCw className="w-8 h-8" />, title: '৭ দিনের রিটার্ন', desc: 'সহজ ও নিরাপদ পলিসি' },
  { icon: <Phone className="w-8 h-8" />, title: '২৪/৭ সাপোর্ট', desc: 'আপনাদের সেবায় আমরা সদা প্রস্তুত' }
];
