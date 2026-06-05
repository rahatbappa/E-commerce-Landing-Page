import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Megaphone, CheckCircle, ShieldAlert, BadgePercent, 
  MapPin, Star, Users, Phone, Eye, HelpCircle, HardDriveDownload, 
  Settings, ShoppingBag, EyeOff, Lock, Check, Heart, Award, CheckCircle2 
} from 'lucide-react';

// Imports of assets generated
import IMG_FRONT from './assets/images/solar_light_front_1780501714601.png';
import IMG_BACK from './assets/images/solar_light_back_1780501730841.png';
import IMG_USE from './assets/images/camping_light_use_1780501749430.png';

// Imports of custom sub-components
import Ticker from './components/Ticker';
import CheckoutForm from './components/CheckoutForm';
import LeadLogs from './components/LeadLogs';
import HtmlExport from './components/HtmlExport';
import WordPressPlugin from './components/WordPressPlugin';
import { ProductOffer, LeadOrder } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Mode selection: starts with 'developer' (the WordPress integration panel and developer workspace) by default as a SaaS system
  const [currentMode, setCurrentMode] = useState<'user' | 'developer'>('developer');
  
  // High fidelity offers
  const offers: ProductOffer[] = [
    {
      id: 'pkg_1',
      name: '১টি সোলার এমার্জেন্সি লাইট (Standard Deal)',
      quantity: 1,
      price: 1490,
      originalPrice: 2500,
      badge: '৪০% ছাড়',
      description: '১টি IP66 সোলার এলইডি লাইট, ১টি চার্জিং ক্যাবল, ফ্রি ৭ দিনের রিপ্লেসমেন্ট এবং ৫ বছরের লাইফটাইম সার্ভিস ওয়ারেন্টি।'
    },
    {
      id: 'pkg_2',
      name: '২টি ফ্যামিলি জ্যাম্বো ক্যাম্পিং ডিল (Best Selling)',
      quantity: 2,
      price: 2690,
      originalPrice: 5000,
      badge: 'মহা ছাড় ৪৮% + ফ্রি হোম ডেলিভারি!',
      description: '২টি ওরিজিনাল সোলার লাইট, ২টি চার্জিং ক্যাবল, ফ্রি সারাদেশ হোম কুরিয়ার এবং ৫ বছরের লাইফটাইম ওয়ারেন্টি।'
    },
    {
      id: 'pkg_3',
      name: '৩টি মেগা ট্র্যাভেলার ব্যাকআপ ডিল (Mega Value)',
      quantity: 3,
      price: 3850,
      originalPrice: 7500,
      badge: 'মেগা ডিল ৫০% সেভিংস + ফ্রি গিফট!',
      description: '৩টি রিচার্জেবল সোলার লাইট, ৩টি ক্যাবল, ফ্রি এক্সপ্রেস কুরিয়ার সুবিধা এবং ১টি প্রিমিয়াম পকেট মেটাল টুলকার্ড গিফট সম্পূর্ণ ফ্রি!'
    }
  ];

  const [selectedOfferId, setSelectedOfferId] = useState<string>('pkg_2'); // Default to best seller
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string>(IMG_FRONT);
  const [orders, setOrders] = useState<LeadOrder[]>([]);
  const [isZoomedModalOpen, setIsZoomedModalOpen] = useState(false);
  const [devActiveTab, setDevActiveTab] = useState<'wp_plugin' | 'leads' | 'export'>('wp_plugin');

  // Local storage loading with default seeding
  useEffect(() => {
    const saved = localStorage.getItem('solar_camping_leads');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          setOrders(parsed);
          return;
        }
      } catch (e) {
        console.error("Error parsing saved leads: ", e);
      }
    }
    
    // Seed high-fidelity mock leads if nothing is in localStorage inside developer sandbox
    const defaultLeads: LeadOrder[] = [
      {
        id: "WP-lead-704125",
        customerName: "মোঃ হাসান মাহমুদ",
        phoneNumber: "01845124963",
        address: "ফ্ল্যাট ৩বি, বাড়ি-১২, রোড-৯, ধানন্ডি আর/এ",
        district: "Dhaka",
        offerName: "২টি ফ্যামিলি জ্যাম্বো ক্যাম্পিং ডিল (Best Selling)",
        itemsQuantity: 2,
        subtotal: 2690,
        shippingCost: 0,
        discount: 0,
        total: 2690,
        checkoutType: "phone_1click",
        paymentMethod: "Cash On Delivery (ক্যাশ অন ডেলিভারি)",
        status: "Processing",
        createdAt: new Date(Date.now() - 3600050 * 2).toISOString()
      },
      {
        id: "WP-lead-612051",
        customerName: "সুলতান আহমেদ সাজু",
        phoneNumber: "01712458963",
        address: "তালুকদার ভিলা, শাহজালাল উপশহর",
        district: "Sylhet",
        offerName: "১টি সোলার এমার্জেন্সি লাইট (Standard Deal)",
        itemsQuantity: 1,
        subtotal: 1490,
        shippingCost: 120,
        discount: 0,
        total: 1610,
        checkoutType: "phone_1click",
        paymentMethod: "Cash On Delivery (ক্যাশ অন ডেলিভারি)",
        status: "Pending Verification",
        createdAt: new Date(Date.now() - 3600050 * 5).toISOString()
      },
      {
        id: "WC-401589",
        customerName: "তানিয়া সুলতানা নিঝুম",
        phoneNumber: "01956489325",
        address: "গ্রিন রোড সরকারি কোয়ার্টার, তেজগাঁও",
        district: "Dhaka",
        offerName: "৩টি মেগা ট্র্যাভেলার ব্যাকআপ ডিল (Mega Value)",
        itemsQuantity: 3,
        subtotal: 3850,
        shippingCost: 0,
        discount: 150,
        total: 3700,
        checkoutType: "woocommerce_full",
        paymentMethod: "bKash Mobile Payment (Prepaid)",
        status: "Shipped",
        createdAt: new Date(Date.now() - 3600050 * 24).toISOString()
      }
    ];

    setOrders(defaultLeads);
    localStorage.setItem('solar_camping_leads', JSON.stringify(defaultLeads));
  }, []);

  // Save base orders helper
  const handleOrderAdd = (newOrder: LeadOrder) => {
    const updated = [newOrder, ...orders];
    setOrders(updated);
    localStorage.setItem('solar_camping_leads', JSON.stringify(updated));
  };

  const handleClearOrders = () => {
    if (window.confirm("আপনি কি নিশ্চিতভাবে ডাটাবেজের সকল অর্ডার লিড মুছে ফেলতে চান?")) {
      setOrders([]);
      localStorage.removeItem('solar_camping_leads');
    }
  };

  const handlePrepopulateOrders = () => {
    const dummyLeads: LeadOrder[] = [
      {
        id: "SL-842051",
        customerName: "মোঃ হাসিবুল শান্ত",
        phoneNumber: "01725489632",
        address: "বাসা নং ২৪, রোড ৩, মিরপুর ১০",
        district: "Dhaka",
        offerName: "২টি ফ্যামিলি জ্যাম্বো ক্যাম্পিং ডিল (Best Selling)",
        itemsQuantity: 2,
        subtotal: 2690,
        shippingCost: 0,
        discount: 0,
        total: 2690,
        checkoutType: "phone_1click",
        paymentMethod: "Cash On Delivery (ক্যাশ অন ডেলিভারি)",
        status: "Processing",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: "WC-512063",
        customerName: "Kamrun Nahar Eva",
        phoneNumber: "01824796325",
        address: "H-512, Agrabad Access Road, double-mooring",
        district: "Chittagong",
        email: "eva.nahar@gmail.com",
        notes: "Deliver in morning hours please",
        offerName: "১টি সোলার এমার্জেন্সি লাইট (Standard Deal)",
        itemsQuantity: 1,
        subtotal: 1490,
        shippingCost: 120,
        discount: 150, // Coupon PROMO10 used
        total: 1460,
        checkoutType: "woocommerce_full",
        paymentMethod: "bKash Mobile Payment (Prepaid)",
        status: "Pending Verification",
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
      },
      {
        id: "SL-630251",
        customerName: "অধ্যাপক সামসুল আরেফিন",
        phoneNumber: "01912458963",
        address: "মহানন্দা ভিলা, আম্বরখানা",
        district: "Sylhet",
        offerName: "৩টি মেগা ট্র্যাভেলার ব্যাকআপ ডিল (Mega Value)",
        itemsQuantity: 3,
        subtotal: 3850,
        shippingCost: 0,
        discount: 0,
        total: 3850,
        checkoutType: "phone_1click",
        paymentMethod: "Cash On Delivery (ক্যাশ অন ডেলিভারি)",
        status: "Shipped",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ];
    
    setOrders(dummyLeads);
    localStorage.setItem('solar_camping_leads', JSON.stringify(dummyLeads));
  };

  const handleUpdateStatus = (orderId: string, newStatus: LeadOrder['status']) => {
    const updated = orders.map(ord => ord.id === orderId ? { ...ord, status: newStatus } : ord);
    setOrders(updated);
    localStorage.setItem('solar_camping_leads', JSON.stringify(updated));
  };

  // Safe discount offer selected
  const activeOffer = offers.find(o => o.id === selectedOfferId) || offers[0];

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen font-sans flex flex-col relative selection:bg-indigo-600 selection:text-white antialiased">
      
      {/* 1. TOP MARQUEE TICKER */}
      <Ticker position="top" />

      {/* ADMIN & BUILDER CONTROL BAR */}
      <div className="w-full bg-slate-900 border-b border-slate-800 px-4 py-3 text-xs flex flex-wrap gap-4 items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
          <span className="font-mono text-slate-300 font-semibold uppercase">Development Sandbox Mode</span>
        </div>

        {/* Workspace Toggle buttons */}
        <div className="flex gap-2.5">
          <button
            id="control-view-page-btn"
            onClick={() => setCurrentMode('user')}
            className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentMode === 'user'
                ? 'bg-indigo-600 text-white shadow shadow-indigo-500/20'
                : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-750'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>কনভার্টিং ল্যান্ডিং পেজ (Consumer Page)</span>
          </button>
          
          <button
            id="control-dev-hub-btn"
            onClick={() => setCurrentMode('developer')}
            className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentMode === 'developer'
                ? 'bg-indigo-600 text-white shadow shadow-indigo-500/20'
                : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-750'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>ডেভেলপার হাব ও ডাউনলোড করুন ({orders.length} Leads)</span>
          </button>
        </div>
      </div>

      {currentMode === 'user' ? (
        /* ==================== 1. HIGH CONVERTING LANDING PAGE ==================== */
        <main className="flex-1 animate-fadeIn">
          
          {/* HEADER HERO BANNER WRAPPER */}
          <section className="bg-white border-b border-slate-200 overflow-hidden relative">
            <div className="max-w-6xl mx-auto px-4 py-10 md:py-16 relative">
              
              {/* Decorative side lights */}
              <div className="absolute top-10 right-1/4 w-72 h-72 bg-indigo-100/45 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-10 left-10 w-96 h-96 bg-slate-100/70 rounded-full blur-3xl pointer-events-none"></div>

              {/* Grid content */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center relative z-10">
                
                {/* Left block Info Copy */}
                <div className="lg:col-span-7 space-y-6 text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-black tracking-wider uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>১০০% অরিজিনাল হেভি ডিউটি জ্যাম্বো সোলার লাইট</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                    লোডশেডিং আর অন্ধকারেও জ্বলবে দিনের আলোয়! <br className="hidden md:inline" />
                    <span className="text-indigo-600">
                      IP66 Waterproof 4-LED Solar Super-Bright Searchlight
                    </span>
                  </h1>

                  <p className="text-sm md:text-base text-slate-600 leading-relaxed font-sans max-w-2xl">
                    রড-শেডিংয়ের যন্ত্রণা, গ্রামের বিদ্যুৎ বিহীন রাস্তা বা রাতে ইমার্জেন্সি সিকিউরিটি গার্ড দিতে দিনরাত সার্ভিস দিতে হাজির দেশের সেরা মাল্টি-পারপাস সোলার সার্চলাইট। বিদ্যুৎ না থাকলে দুশ্চিন্তা জিরো - পেছনে থাকা পাওয়ারফুল সোলার ট্র্যাকিং সিস্টেম দিয়ে সূর্যালোকেই চার্জ হয়ে কাজ করবে একটানা ১০-১২ ঘণ্টা!
                  </p>

                  {/* Bullet badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2 font-medium">
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-lg shadow-sm">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">✓</div>
                      <p className="text-xs text-slate-700"><strong>৪ লাইট গিয়ারস:</strong> ডেলাইট, ওয়ার্ম, মিক্সড ও ফ্ল্যাশ মোড!</p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-lg shadow-sm">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">✓</div>
                      <p className="text-xs text-slate-700"><strong>সূর্যালোকে রিচার্জ:</strong> অরিজিনাল পলিসিলিকন সোলার সেল!</p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-lg shadow-sm">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">✓</div>
                      <p className="text-xs text-slate-700"><strong>মিলিটারি ওয়াটারপ্রুফ:</strong> ঝড়-বৃষ্টি বা বন্যাতেও সচ্ছল সার্ভিস!</p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-lg shadow-sm">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">✓</div>
                      <p className="text-xs text-slate-700"><strong>পাওয়ার ব্যাংক সকেট:</strong> ফোন চার্জের USB ক্রাইসিস ব্যালেন্স!</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                    <a
                      href="#checkout-section"
                      className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.01] active:scale-[0.98] text-white font-extrabold text-base rounded-xl transition-all shadow-lg shadow-indigo-200 uppercase text-center"
                    >
                      কিনুন (Buy Now) • ৬০% বিশেষ ছাড়
                    </a>
                    
                    <div className="flex items-center gap-2 bg-slate-100 p-1.5 px-4 rounded-lg border border-slate-200 justify-center">
                      <Users className="w-4 h-4 text-indigo-600" />
                      <span className="text-[11px] text-slate-600 font-bold">১৬৫+ ক্যাশ অন ডেলিভারি অর্ডার প্লেসড আজ!</span>
                    </div>
                  </div>
                </div>

                {/* Right block Gallery Interactive Media */}
                <motion.div 
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="lg:col-span-5 relative space-y-4"
                >
                  
                  {/* Aspect tag */}
                  <div className="relative bg-white rounded-2xl border border-slate-200 p-4 shadow-xl overflow-hidden group">
                    <div className="absolute top-3.5 left-3.5 z-20 bg-red-650 text-white font-black text-[10px] py-1 px-3 rounded-full uppercase tracking-widest leading-none select-none">
                      Mega Offer
                    </div>

                    <div className="absolute top-3.5 right-3.5 z-20 bg-indigo-600 text-white font-black text-[9px] py-1 px-2.5 rounded-full select-none flex items-center gap-1">
                      <span>৫★ রেটিং কাস্টমার</span>
                    </div>

                    {/* Interactive Showcase with pulsing features */}
                    <div 
                      onClick={() => setIsZoomedModalOpen(true)}
                      className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden aspect-square flex items-center justify-center p-3 relative shadow-inner cursor-zoom-in"
                      title="ছবিটি বড় করে দেখতে ক্লিক করুন"
                    >
                      {/* Interactive Pulse Hotspots */}
                      <div className="absolute top-1/4 right-1/3 group/spot z-10 font-sans">
                        <span className="absolute inline-flex h-3 w-3 rounded-full bg-indigo-500 opacity-75 animate-ping"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-indigo-600 border border-white cursor-pointer hover:scale-110"></span>
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-sm text-white font-semibold text-[10px] py-1 px-2.5 rounded shadow-lg opacity-0 group-hover/spot:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          পলিসিলিকন ফাস্ট সোলার প্যানেল
                        </div>
                      </div>

                      <div className="absolute bottom-1/3 left-1/4 group/spot z-10 font-sans">
                        <span className="absolute inline-flex h-3 w-3 rounded-full bg-orange-500 opacity-75 animate-ping"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-orange-500 border border-white cursor-pointer hover:scale-110"></span>
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-sm text-white font-semibold text-[10px] py-1 px-2.5 rounded shadow-lg opacity-0 group-hover/spot:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          শকপ্রুফ Military Orange বাম্পার
                        </div>
                      </div>

                      <div className="absolute top-1/2 left-1/2 group/spot z-10 font-sans">
                        <span className="absolute inline-flex h-3 w-3 rounded-full bg-emerald-500 opacity-75 animate-ping"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-white cursor-pointer hover:scale-110"></span>
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-sm text-white font-semibold text-[10px] py-1 px-2.5 rounded shadow-lg opacity-0 group-hover/spot:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          ৪-এলইডি আল্ট্রা ফ্লাডলাইট
                        </div>
                      </div>

                      <motion.img
                        key={selectedGalleryImg}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        src={selectedGalleryImg}
                        alt="Solar Camping Searchlight Device"
                        className="max-h-[300px] w-auto object-contain filter drop-shadow-[0_12px_22px_rgba(79,70,229,0.12)] hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />

                      <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-white/70 backdrop-blur-sm p-1 rounded">
                        <Phone className="w-3 h-3 text-indigo-600" />
                        <span>🔍 জুম ভিউ করতে ক্লিক করুন</span>
                      </div>
                    </div>

                    {/* Image thumbnails selector */}
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <button
                        onClick={() => setSelectedGalleryImg(IMG_FRONT)}
                        className={`p-1.5 rounded-lg border bg-white transition-all cursor-pointer ${
                          selectedGalleryImg === IMG_FRONT 
                            ? 'border-indigo-600 scale-[1.02] bg-indigo-50/20 shadow-sm' 
                            : 'border-slate-205'
                        }`}
                      >
                        <img src={IMG_FRONT} alt="Front view" className="h-10 mx-auto object-contain" referrerPolicy="no-referrer" />
                        <p className="text-[8px] uppercase mt-1 font-mono font-bold text-slate-500">Front Angle</p>
                      </button>

                      <button
                        onClick={() => setSelectedGalleryImg(IMG_BACK)}
                        className={`p-1.5 rounded-lg border bg-white transition-all cursor-pointer ${
                          selectedGalleryImg === IMG_BACK 
                            ? 'border-indigo-600 scale-[1.02] bg-indigo-50/20 shadow-sm' 
                            : 'border-slate-205'
                        }`}
                      >
                        <img src={IMG_BACK} alt="Solar panel view" className="h-10 mx-auto object-contain" referrerPolicy="no-referrer" />
                        <p className="text-[8px] uppercase mt-1 font-mono font-bold text-slate-500">Solar back</p>
                      </button>

                      <button
                        onClick={() => setSelectedGalleryImg(IMG_USE)}
                        className={`p-1.5 rounded-lg border bg-white transition-all cursor-pointer ${
                          selectedGalleryImg === IMG_USE 
                            ? 'border-indigo-600 scale-[1.02] bg-indigo-50/20 shadow-sm' 
                            : 'border-slate-205'
                        }`}
                      >
                        <img src={IMG_USE} alt="Campsite Use" className="h-10 mx-auto object-contain" referrerPolicy="no-referrer" />
                        <p className="text-[8px] uppercase mt-1 font-mono font-bold text-slate-500">Tent lifestyle</p>
                      </button>
                    </div>
                  </div>

                  {/* Highlight Specs */}
                  <div className="bg-slate-100 border border-slate-200 p-3.5 rounded-xl flex items-center justify-between text-xs py-2.5 shadow-sm">
                    <p className="text-slate-600 font-medium">অর্ডার করতে সরাসরি কল করুন চব্বিশ ঘণ্টা:</p>
                    <a href="tel:01800000000" className="flex items-center gap-1.5 font-bold font-mono text-indigo-600 text-sm hover:underline">
                      <Phone className="w-3.5 h-3.5" />
                      <span>01800-000000</span>
                    </a>
                  </div>
                </motion.div>

              </div>
            </div>
          </section>

          {/* SOCIAL PROOF REAL-TIME TRUST SECTORS */}
          <section className="bg-slate-100 py-10 border-b border-slate-200">
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center select-none">
                <div className="space-y-1">
                  <p className="text-2xl md:text-3.5xl font-black text-indigo-600 font-mono">৳১,৪৯০</p>
                  <p className="text-xs text-slate-500">সর্বনিম্ন অবিশ্বাস্য লাঞ্চ অফার</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl md:text-3.5xl font-black text-emerald-600 font-mono">15 Min</p>
                  <p className="text-xs text-slate-500">অর্ডার নিশ্চিতকরণ কল ট্র্যাকিং</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl md:text-3.5xl font-black text-indigo-600 font-mono">৫ বছর</p>
                  <p className="text-xs text-slate-500">সার্ভিস ওয়ারেন্টি গ্যারান্টি</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl md:text-3.5xl font-black text-slate-900 font-mono">১০০%</p>
                  <p className="text-xs text-slate-500">নিরাপদ ক্যাশঅন ডেলিভারি</p>
                </div>
              </div>
            </div>
          </section>

          {/* DYNAMIC SPECIFICATIONS GRID IN BENTO STYLE */}
          <section className="max-w-6xl mx-auto px-4 py-16">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs uppercase tracking-widest font-extrabold text-indigo-600">Robust Features</span>
              <h3 className="text-2.5xl md:text-4xl font-extrabold text-slate-900 leading-tight mt-1">
                মিলিটারি গ্রেড মেটেরিয়ালে গড়া সেরা সোলার লাইট
              </h3>
              <p className="text-xs md:text-sm text-slate-500 mt-2">
                এটি কোনো সাধারণ প্লাস্টিকের খেলনা লাইট নয়। রাফ ও টাফ ব্যবহারের জন্য এতে রয়েছে শকপ্রুফ বাম্পার ও অত্যাধুনিক রিচার্জ লুপ।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 hover:border-indigo-600/30 transition-all flex flex-col justify-between shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl uppercase font-mono">💡</div>
                <div className="space-y-1.5 flex-1 mt-4">
                  <h4 className="text-lg font-bold text-slate-900">৪ লাইটিং মুডস ও এসওএস ফ্ল্যাশ</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    ১ম গিয়ার ডেলাইট দিয়ে যেকোনো বড় স্পেস আলোকিত করুন, ২য় গিয়ার দিয়ে সফট ওয়ার্ম মুডে পড়াশোনা করুন, ৩য় মিক্সড কড়া হোয়াইট ওয়ার্ম ব্যাকআপ, এবং ৪র্থ মোডে লাল-নীল ইমার্জেন্সে পুলিশ সিগন্যাল ফ্লাশার দিয়ে রাস্তা বা দুর্যোগে সাহায্য চান।
                  </p>
                </div>
                <div className="border-t border-slate-100 pt-3.5 mt-2">
                  <span className="text-[10px] text-indigo-600 font-mono font-bold tracking-widest block uppercase">Up to 300 SQM Light radius</span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 hover:border-indigo-600/30 transition-all flex flex-col justify-between shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl uppercase font-mono">⛅</div>
                <div className="space-y-1.5 flex-1 mt-4">
                  <h4 className="text-lg font-bold text-slate-900">স্বয়ংক্রিয় সোলার চার্জিং ও ইউএসবি</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    সৌর প্যানেলের সাহায্যে লাইটটি দিনের মেঘাচ্ছন্ন পরিবেশেও হালকা চার্জ নিতে সক্ষম। বিদ্যুৎ ছাড়াই বছরের ৩৬৫ দিন এটিকে সম্পূর্ণ ফ্রিতে রিচার্জ করতে পারবেন। বিদ্যুৎ বিপর্যয়ে বা বন্যা বা ঝড়ে এটি দারুণ সেবা দেবে!
                  </p>
                </div>
                <div className="border-t border-slate-100 pt-3.5 mt-2">
                  <span className="text-[10px] text-indigo-600 font-mono font-bold tracking-widest block uppercase">High grade Polysilicon solar cells</span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 hover:border-indigo-600/30 transition-all flex flex-col justify-between shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl uppercase font-mono">🌧</div>
                <div className="space-y-1.5 flex-1 mt-4">
                  <h4 className="text-lg font-bold text-slate-900">IP66 মিলিটারি ওয়াটারপ্রুফ বডি</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    উচ্চ শক্তির এবিএস প্লাস্টিক গ্যাসকেট ও রেইন সীল ক্যাপযুক্ত পোর্ট এটিকে ধুলোবালি এবং কঠিন পানির ফোঁটা থেকে রক্ষা করে। ভারী বৃষ্টিতে রেখে অনায়াসে কাজ করতে পারবেন মাঠ বা ঘাটে।
                  </p>
                </div>
                <div className="border-t border-slate-100 pt-3.5 mt-2">
                  <span className="text-[10px] text-indigo-600 font-mono font-bold tracking-widest block uppercase">Dust, Shock and Splash protection</span>
                </div>
              </div>
            </div>
          </section>

          {/* DETAILED PHOTO REVIEWS SECTION WITH AUTHENTIC LOCAL NAMES */}
          <section className="bg-slate-50 border-y border-slate-200 py-16">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center max-w-xl mx-auto mb-12">
                <span className="text-xs uppercase tracking-widest font-extrabold text-indigo-600 font-mono flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-indigo-600 text-indigo-600" /> Five Star Testimonials
                </span>
                <h3 className="text-2.5xl md:text-4xl font-extrabold text-slate-900 mt-1">আমাদের হ্যাপি গ্রাহকদের রিভিউ</h3>
                <p className="text-xs md:text-sm text-slate-500 mt-2">সারাদেশে হাজারো কাস্টমার ব্যবহার করে সন্তুষ্ট হয়ে আমাদের চমৎকার সব রিভিউ দিয়েছেন।</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Review 1 */}
                <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-4 shadow-sm">
                  <div className="flex gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "আমি সিলেটে থাকি, আমাদের এখানে খুব ঝড় বৃষ্টিতে বিদ্যুৎ চলে যায়। আমি এই সোলার লাইটটি কিনে অনেক ভালো সাপোর্ট পাচ্ছি। বিশেষ করে রাতে ঝড়ের দিনে সোলার দিয়ে চার্জ দিয়ে বাতি জালানো যায়। আর ৫ বছরের সার্ভিস ওয়ারেন্টির কারণে ভরসা পেয়েছি।"
                  </p>
                  <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
                    <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center font-mono">RM</div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">রাকিবুল হাসান মিনা</p>
                      <p className="text-[10px] text-slate-500 font-medium font-sans">আম্বরখানা, সিলেট থেকে</p>
                    </div>
                  </div>
                </div>

                {/* Review 2 */}
                <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-4 shadow-sm">
                  <div className="flex gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "লাইটটার বাটন প্রেস করলে ৩ ধরণের আলো দেয় আর সাথে ইমার্জেন্সি লাল-নীল ফ্লাশারটা অস্থির। পকেটে অনেক চার্জ থাকে, আমার ফোনে একটু চার্জ দিতে পারসি এমার্জেন্সিতে। ফোনের ১-ক্লিকে অর্ডার দিতে কোনো পেও করতে হয়নাই, বাসায় এসে ডেলিভারি পাইসি।"
                  </p>
                  <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
                    <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center font-mono font-sans font-bold">TK</div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">তারেক আহমেদ খান</p>
                      <p className="text-[10px] text-slate-500 font-medium font-sans">মিরপুর - ১২, ঢাকা</p>
                    </div>
                  </div>
                </div>

                {/* Review 3 */}
                <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-4 shadow-sm">
                  <div className="flex gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "Awesome solid product. Frame has strong thick orange bumpers that can take hits during field study. Solar panel charges well even beside home windows. Recommended seller for outdoor emergency searches!"
                  </p>
                  <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
                    <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-605 text-xs font-bold flex items-center justify-center font-mono font-sans font-bold">AK</div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Ahsanul Karim</p>
                      <p className="text-[10px] text-slate-500 font-medium font-sans">Wari, Old Dhaka</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* DYNAMIC CAMPAIGN PRICING SELECTORS */}
          <section className="max-w-6xl mx-auto px-4 py-16">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs uppercase tracking-widest font-extrabold text-indigo-600 font-mono">Current Campaign Packages</span>
              <h3 className="text-2.5xl md:text-4xl font-extrabold text-slate-900 mt-1">সবচেয়ে লাভজনক অফার সিলেক্ট করুন</h3>
              <p className="text-xs md:text-sm text-slate-500 mt-2">ফ্যামিলি প্যাক অথবা একাধিক লাইট একসাথে কিনলে পাচ্ছেন চমৎকার ক্যাশ ছাড় ও ফ্রি হোম ডেলিভারি!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  onClick={() => setSelectedOfferId(offer.id)}
                  className={`relative p-6 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between ${
                    selectedOfferId === offer.id
                      ? 'bg-indigo-50/40 border-indigo-600 shadow-lg shadow-indigo-100'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  {offer.badge && (
                    <span className="absolute -top-3 left-4 bg-red-650 text-white text-[10px] uppercase font-black px-3 py-1 rounded-full">
                      {offer.badge}
                    </span>
                  )}
                  {offer.id === 'pkg_2' && (
                    <span className="absolute -top-3.5 right-4 bg-indigo-600 text-white text-[10px] uppercase font-extrabold px-3 py-1 rounded-full shadow-md">
                      Best Value Pack
                    </span>
                  )}

                  <div className="space-y-4">
                    <div className="flex justify-between items-start pt-1.5">
                      <div>
                        <h4 className="font-bold text-lg text-slate-900">{offer.name}</h4>
                        <span className="inline-block px-2.5 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black uppercase mt-1">
                          {offer.badge}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-sans">{offer.description}</p>
                  </div>

                  <div className="pt-6 border-t border-slate-100 mt-6 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Offer Price:</p>
                      <span className="text-2.5xl text-indigo-600 font-extrabold font-mono">৳{offer.price}</span>
                      <span className="text-xs text-slate-500 line-through block font-mono">৳{offer.originalPrice}</span>
                    </div>

                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                      selectedOfferId === offer.id 
                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                        : 'border-slate-300 text-transparent'
                    }`}>
                      <Check className="w-3.5 h-3.5 text-current stroke-[3]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* MULTI CHECKOUT SYSTEM AT THE BOTTOM FUNNEL */}
          <section className="max-w-4xl mx-auto px-4 pb-20 pt-10">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs uppercase font-extrabold text-indigo-600 tracking-wider">Fast Secure Checkout</span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">নিচের ফর্মে এখনই অর্ডারটি সাবমিট করুন</h3>
              <p className="text-xs text-slate-500 mt-2">২-মিনিটে আপনার শিপিং ও পেমেন্ট রিসিভ করতে ক্যাশ-অন-ডেলিভারি ড্যাশবোর্ড সিলেক্ট করুন।</p>
            </div>

            {/* Injected CheckoutForm, handles database saves automatically */}
            <CheckoutForm
              offers={offers}
              selectedOfferId={selectedOfferId}
              onOfferChange={(id) => setSelectedOfferId(id)}
              onOrderPlaced={handleOrderAdd}
            />
          </section>

        </main>
      ) : (
        /* ==================== 2. ADMIN PORTAL & DEVELOPER HUB ==================== */
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 space-y-10 animate-fadeIn text-slate-900">
          
          {/* Welcome Info Board */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
            <div className="space-y-1 flex-1">
              <h2 className="text-xl font-extrabold text-slate-900">স্বাগতম, এডমিন ও ডেভেলপার হাব-এ!</h2>
              <p className="text-xs text-slate-500">
                এখানে আপনি আপনার তৈরি করা ল্যান্ডিং পেইজ থেকে সংগৃহীত অর্ডার বা তথ্য দেখতে পারবেন এবং ওয়ার্ডপ্রেস সাইটে ব্যবহারের জন্য প্লাগইন বা সোর্স কোড ডাউনলোড করতে পারবেন।
              </p>
            </div>
            
            <div className="flex gap-2 shrink-0">
              <button
                id="developer-return-to-page-btn"
                onClick={() => setCurrentMode('user')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
              >
                ল্যান্ডিং পেইজে ফিরে যান (Preview Page)
              </button>
            </div>
          </div>

          {/* Sub-tabs menu inside developer hub for organized experience */}
          <div className="border-b border-slate-200 flex gap-4 overflow-x-auto bg-slate-100/50 p-2.5 rounded-lg">
            <button
              onClick={() => setDevActiveTab('wp_plugin')}
              className={`py-2 px-4 rounded-lg font-bold text-xs md:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                devActiveTab === 'wp_plugin' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              💼 ওয়ার্ডপ্রেস প্লাগইন ও সিমুলেটর
            </button>
            <button
              onClick={() => setDevActiveTab('leads')}
              className={`py-2 px-4 rounded-lg font-bold text-xs md:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                devActiveTab === 'leads' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              📊 লোকাল অর্ডার লিডস ডাটাবেজ ({orders.length})
            </button>
            <button
              onClick={() => setDevActiveTab('export')}
              className={`py-2 px-4 rounded-lg font-bold text-xs md:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                devActiveTab === 'export' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              📥 ল্যান্ডিং পেজ সোর্স কোড রিসিট
            </button>
          </div>

          <AnimatePresence mode="wait">
            {devActiveTab === 'wp_plugin' && (
              <motion.div
                key="wp_tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <WordPressPlugin 
                  orders={orders}
                  onUpdateStatus={handleUpdateStatus}
                  onAddOrder={handleOrderAdd}
                />
              </motion.div>
            )}

            {devActiveTab === 'leads' && (
              <motion.div
                key="leads_tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <LeadLogs
                  orders={orders}
                  onClearOrders={handleClearOrders}
                  onPrepopulateOrders={handlePrepopulateOrders}
                  onUpdateStatus={handleUpdateStatus}
                />
              </motion.div>
            )}

            {devActiveTab === 'export' && (
              <motion.div
                key="export_tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <HtmlExport />
              </motion.div>
            )}
          </AnimatePresence>

        </main>
      )}

      {/* Elegant Image Lightbox / Zoom Modal */}
      <AnimatePresence>
        {isZoomedModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomedModalOpen(false)}
            className="fixed inset-0 bg-slate-950/90 z-100 flex items-center justify-center p-4 cursor-zoom-out select-none backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-4 md:p-6 rounded-3xl max-w-2xl w-full relative shadow-ff-lightbox text-slate-900 text-left"
            >
              <button
                onClick={() => setIsZoomedModalOpen(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 p-1.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-xs font-bold cursor-pointer"
              >
                ✕ বন্ধ করুন (Close)
              </button>

              <div className="text-center font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4 text-xs md:text-sm uppercase tracking-wide">
                সোলার সার্চলাইট বিবরণী জুম ভিউ (Visual Detail Close-up)
              </div>

              <div className="flex bg-slate-50 border border-slate-200 rounded-2xl items-center justify-center p-3 relative h-[300px] md:h-[400px]">
                <img
                  src={selectedGalleryImg}
                  alt="High resolution product feature"
                  className="max-h-full max-w-full object-contain filter drop-shadow-[0_15px_30px_rgba(79,70,229,0.15)] animate-floating"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 text-xs font-semibold">
                <button
                  onClick={() => setSelectedGalleryImg(IMG_FRONT)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                    selectedGalleryImg === IMG_FRONT ? 'border-indigo-600 bg-indigo-50/20 text-indigo-700' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Front view
                </button>
                <button
                  onClick={() => setSelectedGalleryImg(IMG_BACK)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                    selectedGalleryImg === IMG_BACK ? 'border-indigo-600 bg-indigo-50/20 text-indigo-700' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Solar Panel back
                </button>
                <button
                  onClick={() => setSelectedGalleryImg(IMG_USE)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                    selectedGalleryImg === IMG_USE ? 'border-indigo-600 bg-indigo-50/20 text-indigo-700' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Outdoor campsite Use
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. BOTTOM MARQUEE TICKER */}
      <Ticker position="bottom" />
    </div>
  );
}
