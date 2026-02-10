
export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  vendor: string;
  vendorEmail?: string; // Track who posted it
  category: string;
  rating: number;
  reviews: number;
  description?: string;
  location?: string;
  phone?: string;
  condition?: 'New' | 'Used';
  isFeatured?: boolean;
  rentalType?: 'Bachelor' | 'Family'; // New field for To-Let
}

export interface User {
  name: string;
  email: string;
  isVerified: boolean;
  postCountToday: number;
  profilePic?: string;
}

export type Language = 'bn' | 'en';

export interface SupportMessage {
  id: string;
  userEmail: string;
  userName: string;
  text: string;
  timestamp: string;
  isAdmin: boolean;
  isRead: boolean;
}

export interface Message {
  id: number | string;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
}

export interface BoostPlan {
  id: string;
  days: number;
  price: number;
  description: string;
}

export interface VerifyPlan {
  id: string;
  duration: string;
  price: number;
  desc: string;
}

export interface AdminSettings {
  freePostLimit: number;
  extraPostPrice: number;
  extraImagePrice: number; // Added for the 50 taka requirement
  boostPlans: BoostPlan[];
  verifyPlans: VerifyPlan[];
  verificationPrice?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export enum Page {
  Home = 'Home',
  Shop = 'Shop',
  About = 'About',
  TrackOrder = 'TrackOrder',
  Messenger = 'Messenger',
  Wallet = 'Wallet',
  Boost = 'Boost',
  Verification = 'Verification',
  Contact = 'Contact',
  PostAd = 'PostAd',
  AIChat = 'AIChat',
  Login = 'Login',
  ProductDetail = 'ProductDetail',
  Cart = 'Cart',
  Admin = 'Admin',
  SupportChat = 'SupportChat',
  Checkout = 'Checkout',
  ToLet = 'ToLet'
}

export interface BoostRequest {
  id: string;
  planId: string;
  productId?: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket';
  senderNumber: string;
  trxId: string;
  screenshot: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
  paymentReason?: string;
}

export interface PostRequest {
  id: string;
  product: Product;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
  isPaid: boolean;
  trxId?: string;
  paymentReason?: 'extra_posts' | 'extra_images';
}

export interface VerificationRequest {
  id: string;
  planId: string;
  trxId: string;
  userEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
}
