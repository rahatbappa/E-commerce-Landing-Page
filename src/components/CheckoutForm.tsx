import React, { useState, useEffect } from 'react';
import { 
  Phone, ShoppingBag, Check, Truck, Ticket, 
  CreditCard, Wallet, Send, Info, AlertCircle, ShoppingCart 
} from 'lucide-react';
import { ProductOffer, CheckoutState, LeadOrder } from '../types';

interface CheckoutFormProps {
  offers: ProductOffer[];
  selectedOfferId: string;
  onOfferChange: (offerId: string) => void;
  onOrderPlaced: (newOrder: LeadOrder) => void;
}

function TrustSection() {
  return (
    <div className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-4 mt-5 text-center select-none shadow-sm animate-fadeIn">
      <div className="flex items-center justify-center gap-1.5 text-slate-800 font-extrabold text-xs md:text-sm mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-emerald-600 animate-pulse shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span className="font-semibold text-neutral-800">১০০% নিরাপদ ও বিশ্বস্ত পেমেন্ট গ্যারান্টি</span>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {/* bKash */}
        <div className="flex items-center gap-1.5 bg-[#E2136E] hover:scale-105 transition-transform duration-150 px-3 py-1 rounded-lg h-8 shadow-sm border border-[#C50D5F]" title="bKash">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-white shrink-0" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
          </svg>
          <span className="font-sans font-black text-[11px] text-white tracking-tight leading-none">bKash</span>
        </div>
        
        {/* Nagad */}
        <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#F26522] to-[#F7931E] hover:scale-105 transition-transform duration-150 px-3 py-1 rounded-lg h-8 shadow-sm border border-[#D94F1A]" title="Nagad">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-white shrink-0" fill="currentColor">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2l1 4 4 1-4 1-1 4-1-4-4-1 4-1z" />
          </svg>
          <span className="font-sans font-black text-[11px] text-white tracking-tight uppercase leading-none">nagad</span>
        </div>
        
        {/* Visa */}
        <div className="flex items-center justify-center bg-[#151C62] hover:scale-105 transition-transform duration-150 px-3 py-1 rounded-lg h-8 shadow-sm border border-[#0F1448]" title="Visa">
          <span className="font-sans font-black italic text-[11.5px] text-white tracking-wider leading-none">
            <span className="text-[#F7B600]">V</span>ISA
          </span>
        </div>
        
        {/* Mastercard */}
        <div className="flex items-center gap-1.5 bg-[#1F2937] hover:scale-105 transition-transform duration-150 px-3 py-1 rounded-lg h-8 shadow-sm border border-slate-950" title="Mastercard">
          <div className="flex -space-x-1.5 items-center shrink-0">
            <span className="w-3 h-3 rounded-full bg-[#EB001B] opacity-95"></span>
            <span className="w-3 h-3 rounded-full bg-[#FF5F00] opacity-95"></span>
          </div>
          <span className="font-sans font-black text-[9.5px] text-white tracking-tight uppercase leading-none">mc</span>
        </div>
        
        {/* Amex */}
        <div className="flex items-center justify-center bg-[#0177B4] hover:scale-105 transition-transform duration-150 px-3 py-1 rounded-lg h-8 shadow-sm border border-[#015A8A]" title="Amex">
          <span className="font-sans font-black text-[10px] text-white tracking-wider uppercase leading-none">AMEX</span>
        </div>
      </div>
      
      <p className="text-[10px] md:text-[10.5px] text-neutral-550 font-medium mt-2 leading-relaxed">
        বিকাশ, নগদ, ভিসা, মাস্টারকার্ড কিংবা আমেরিকান এক্সপ্রেস (Amex) দ্বারা ১০০% নিশ্চিত পেমেন্ট করুন।
      </p>
    </div>
  );
}

export default function CheckoutForm({ 
  offers, 
  selectedOfferId, 
  onOfferChange, 
  onOrderPlaced 
}: CheckoutFormProps) {
  const [activeTab, setActiveTab] = useState<'phone' | 'woocommerce'>('phone');
  
  // State for direct phone checkout
  const [phoneName, setPhoneName] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [phoneAddress, setPhoneAddress] = useState('');
  const [phoneDistrict, setPhoneDistrict] = useState('Dhaka');
  
  // State for WooCommerce checkout
  const [wooState, setWooState] = useState<CheckoutState>({
    fullName: '',
    phoneNumber: '',
    deliveryAddress: '',
    district: 'Dhaka',
    email: '',
    orderNotes: '',
    shippingMethod: 'inside_dhaka',
    paymentMethod: 'cod',
    couponCode: '',
    selectedOfferId: selectedOfferId
  });

  // Coupon applied state
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState({ text: '', type: '' });
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  // Mobile Banking details simulation
  const [mobileNumInput, setMobileNumInput] = useState('');
  const [mobileOtp, setMobileOtp] = useState('');
  const [mobilePin, setMobilePin] = useState('');
  const [paymentStep, setPaymentStep] = useState<'details' | 'otp' | 'pin' | 'done'>('details');

  // Success state
  const [completedOrder, setCompletedOrder] = useState<LeadOrder | null>(null);

  // Sync selectedOfferId from parent to wooState
  useEffect(() => {
    setWooState(prev => ({ ...prev, selectedOfferId }));
  }, [selectedOfferId]);

  const selectedOffer = offers.find(o => o.id === (activeTab === 'phone' ? selectedOfferId : wooState.selectedOfferId)) || offers[0];

  // Coupon Handler
  const handleApplyCoupon = (code: string) => {
    const cleanCode = code.toUpperCase().trim();
    if (cleanCode === 'PROMO10') {
      setPromoDiscount(150);
      setPromoMessage({ text: 'Promo Code Applied! Extra ৳150 Off.', type: 'success' });
      setIsPromoApplied(true);
    } else if (cleanCode === 'FREE60' && selectedOffer.quantity === 1) {
      setPromoDiscount(60); 
      setPromoMessage({ text: 'Delivery Discount Applied! ৳60 Off.', type: 'success' });
      setIsPromoApplied(true);
    } else if (cleanCode === '') {
      setPromoDiscount(0);
      setPromoMessage({ text: '', type: '' });
      setIsPromoApplied(false);
    } else {
      setPromoDiscount(0);
      setPromoMessage({ text: 'Invalid Promo Code!', type: 'error' });
      setIsPromoApplied(false);
    }
  };

  // Calculations
  const calculatedShipping = activeTab === 'phone' 
    ? (phoneDistrict.toLowerCase() === 'dhaka' ? 60 : 120)
    : (wooState.shippingMethod === 'inside_dhaka' ? 60 : 120);

  // Some offers give free shipping
  const shippingCost = selectedOffer.price >= 2000 ? 0 : calculatedShipping;
  const rawSubtotal = selectedOffer.price;
  const finalDiscount = promoDiscount;
  const grandTotal = rawSubtotal + shippingCost - finalDiscount;

  // Submit direct 1-click phone checkout
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneName || !phoneNum || !phoneAddress) {
      alert("অনুগ্রহ করে আপনার নাম, মোবাইল নাম্বার এবং সম্পূর্ণ ঠিকানা লিখুন।");
      return;
    }
    if (phoneNum.length < 11) {
      alert("দয়া করে একটি সঠিক ১১ ডিজিটের মোবাইল নাম্বার প্রদান করুন।");
      return;
    }

    const newOrder: LeadOrder = {
      id: "SL-" + Math.floor(100000 + Math.random() * 900000),
      customerName: phoneName,
      phoneNumber: phoneNum,
      address: phoneAddress,
      district: phoneDistrict,
      offerName: selectedOffer.name,
      itemsQuantity: selectedOffer.quantity,
      subtotal: rawSubtotal,
      shippingCost: shippingCost,
      discount: finalDiscount,
      total: grandTotal,
      checkoutType: 'phone_1click',
      paymentMethod: 'Cash On Delivery (ক্যাশ অন ডেলিভারি)',
      status: 'Pending Verification',
      createdAt: new Date().toISOString()
    };

    onOrderPlaced(newOrder);
    setCompletedOrder(newOrder);
  };

  // Submit WooCommerce standard checkout
  const handleWooSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wooState.fullName || !wooState.phoneNumber || !wooState.deliveryAddress) {
      alert("Please fill in billing Name, Phone and Delivery Address!");
      return;
    }
    if (wooState.phoneNumber.length < 11) {
      alert("Please provide a valid 11-digit phone number!");
      return;
    }

    // Is it a mobile gateway bKash / Nagad? Check step
    if ((wooState.paymentMethod === 'bkash' || wooState.paymentMethod === 'nagad') && paymentStep !== 'done') {
      if (!mobileNumInput) {
        alert("Please enter your mobile pocket number");
        return;
      }
      if (paymentStep === 'details') {
        setPaymentStep('otp');
        return;
      }
      if (paymentStep === 'otp') {
        if (!mobileOtp) { alert("Enter the SMS verification OTP"); return; }
        setPaymentStep('pin');
        return;
      }
      if (paymentStep === 'pin') {
        if (!mobilePin) { alert("Enter custom PIN secure to proceed"); return; }
        setPaymentStep('done');
      }
    }

    const newOrder: LeadOrder = {
      id: "WC-" + Math.floor(100000 + Math.random() * 900000),
      customerName: wooState.fullName,
      phoneNumber: wooState.phoneNumber,
      address: wooState.deliveryAddress,
      district: wooState.district,
      email: wooState.email || 'N/A',
      notes: wooState.orderNotes || 'None',
      offerName: selectedOffer.name,
      itemsQuantity: selectedOffer.quantity,
      subtotal: rawSubtotal,
      shippingCost: shippingCost,
      discount: finalDiscount,
      total: grandTotal,
      checkoutType: 'woocommerce_full',
      paymentMethod: wooState.paymentMethod === 'cod' 
        ? 'Cash on Delivery (COD)' 
        : wooState.paymentMethod === 'bkash' 
          ? 'bKash Mobile Payment (Prepaid)' 
          : 'Nagad Mobile Wallet (Prepaid)',
      status: 'Pending Verification',
      createdAt: new Date().toISOString()
    };

    onOrderPlaced(newOrder);
    setCompletedOrder(newOrder);
  };

  return (
    <div id="checkout-section" className="w-full bg-white text-neutral-800 rounded-2xl shadow-xl overflow-hidden border border-neutral-200">
      
      {/* Dynamic Header Tab Area */}
      <div className="flex bg-slate-900 border-b border-slate-800">
        <button
          id="tab-phone-trigger"
          onClick={() => { setActiveTab('phone'); setCompletedOrder(null); }}
          className={`flex-1 py-4 px-3 flex items-center justify-center gap-2 font-bold text-sm md:text-base transition-all duration-300 ${
            activeTab === 'phone' 
              ? 'bg-indigo-600 text-white font-black' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Phone className="w-5 h-5 animate-bounce" />
          <span>১-ক্লিকে ফোন অর্ডার (সহজ)</span>
        </button>
        <button
          id="tab-woo-trigger"
          onClick={() => { setActiveTab('woocommerce'); setCompletedOrder(null); }}
          className={`flex-1 py-4 px-3 flex items-center justify-center gap-2 font-bold text-sm md:text-base transition-all duration-300 ${
            activeTab === 'woocommerce' 
              ? 'bg-slate-950 border-r border-slate-800 text-white font-black' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          <span>WooCommerce Checkout</span>
        </button>
      </div>

      {completedOrder ? (
        /* Order Success Invoice View */
        <div id="order-success-screen" className="p-6 md:p-8 text-center bg-gradient-to-b from-amber-50 to-white animate-fadeIn">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4 animate-scaleUp">
            <Check className="w-9 h-9 stroke-[3]" />
          </div>
          
          <h3 className="text-2xl md:text-3xl font-extrabold text-neutral-950 mb-2">
            {activeTab === 'phone' ? 'আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!' : 'Order Placed Successfully!'}
          </h3>
          <p className="text-neutral-600 text-sm md:text-base max-w-lg mx-auto mb-6">
            {activeTab === 'phone' 
              ? 'ধন্যবাদ! আমাদের একজন প্রতিনিধি অল্প সময়ের মধ্যে (১৫ মিনিটের ভিতর) কল করে অর্ডারটি নিশ্চিত করবেন এবং আপনার ঠিকানা ভেরিফাই করবেন।'
              : 'Thank you for your purchase! Our team will contact you shortly to verify billing records and organize express delivery.'
            }
          </p>

          {/* Styled Dynamic Invoice Voucher */}
          <div className="bg-white border-2 border-dashed border-neutral-300 rounded-xl p-5 text-left max-w-md mx-auto shadow-md mb-6 font-sans">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3 mb-3">
              <div>
                <p className="text-xs text-neutral-400 font-mono">Invoice Number</p>
                <p className="text-sm font-bold text-amber-600">{completedOrder.id}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-neutral-400 font-mono">Status</p>
                <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                  {completedOrder.status}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs md:text-sm mb-4 border-b border-neutral-100 pb-3">
              <p><strong className="text-neutral-500">Customer:</strong> <span className="font-semibold text-neutral-900">{completedOrder.customerName}</span></p>
              <p><strong className="text-neutral-500">Phone:</strong> <span className="font-mono text-neutral-900 font-semibold">{completedOrder.phoneNumber}</span></p>
              <p><strong className="text-neutral-500">Address:</strong> <span className="text-neutral-900">{completedOrder.address}, {completedOrder.district}</span></p>
              <p><strong className="text-neutral-500">Product Pack:</strong> <span className="text-neutral-900 font-medium">{completedOrder.offerName}</span></p>
              <p><strong className="text-neutral-500">Payment Process:</strong> <span className="text-orange-700 font-semibold">{completedOrder.paymentMethod}</span></p>
            </div>

            <div className="space-y-1.5 text-xs text-neutral-600 border-b border-neutral-100 pb-2.5 mb-2.5">
              <div className="flex justify-between">
                <span>Subtotal (দাম):</span>
                <span className="font-semibold">৳{completedOrder.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping (ডেলিভারি চার্জ):</span>
                <span>{completedOrder.shippingCost === 0 ? 'FREE' : `৳${completedOrder.shippingCost}`}</span>
              </div>
              {completedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount (ছাড়):</span>
                  <span>-৳{completedOrder.discount}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className="font-bold text-neutral-950 text-sm md:text-base">Grand Total (সর্বমোট মোট):</span>
              <span className="font-black text-amber-600 text-xl font-mono">৳{completedOrder.total}</span>
            </div>
          </div>

          <button
            id="order-again-btn"
            onClick={() => {
              setCompletedOrder(null);
              setPhoneName('');
              setPhoneNum('');
              setPhoneAddress('');
              setPromoDiscount(0);
              setPromoMessage({ text: '', type: '' });
              setIsPromoApplied(false);
              setPaymentStep('details');
              setMobileNumInput('');
              setMobileOtp('');
              setMobilePin('');
            }}
            className="px-6 py-2.5 bg-neutral-900 hover:bg-amber-600 text-white font-bold transition-colors rounded-lg text-sm"
          >
            অর্ডার ফর্ম পুনরায় খুলুন (Order Again)
          </button>
        </div>
      ) : activeTab === 'phone' ? (
        /* 1-Click Phone Order */
        <form id="phone-quick-form" onSubmit={handlePhoneSubmit} className="p-6 md:p-8 space-y-5">
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200/50 flex gap-3 text-neutral-800 text-sm select-none">
            <Info className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
            <p className="leading-relaxed">
              <strong>১-ক্লিকে দ্রুত অর্ডার করুন:</strong> কোন রেজিস্ট্রেশন বা কার্ড চার্জ লাগবে না। নিচে শুধু আপনার নাম, মোবাইল নাম্বার এবং ডেলিভারি ঠিকানা দিন, এবং অর্ডার প্লেস করুন। আমরা ক্যাশ-অন-ডেলিভারি দিব।
            </p>
          </div>

          {/* Target Offer Details */}
          <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-600">Selected Package:</span>
            <div className="flex justify-between items-center mt-1">
              <div>
                <p className="font-extrabold text-neutral-900 text-base">{selectedOffer.name}</p>
                <p className="text-xs text-neutral-500 font-medium">{selectedOffer.description}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-amber-600">৳{selectedOffer.price}</span>
                <p className="text-xs line-through text-neutral-400">Regular: ৳{selectedOffer.originalPrice}</p>
              </div>
            </div>
            
            {/* Quick selectors for packages directly in form */}
            <div className="mt-3.5 pt-3.5 border-t border-neutral-200/60">
              <p className="text-xs font-bold text-neutral-400 uppercase mb-2">প্যাকেজ পরিবর্তন করুন:</p>
              <div className="grid grid-cols-3 gap-2">
                {offers.map(off => (
                  <button
                    key={off.id}
                    type="button"
                    onClick={() => onOfferChange(off.id)}
                    className={`p-2 rounded-lg border text-xs font-bold text-center transition-all ${
                      selectedOfferId === off.id 
                        ? 'bg-amber-600 border-amber-600 text-white shadow-sm' 
                        : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {off.quantity} Pcs (৳{off.price})
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs md:text-sm font-bold text-neutral-700 mb-1.5 flex items-center gap-1">
                <span>আপনার নাম (Name) *</span>
              </label>
              <input
                id="phone-input-name"
                type="text"
                required
                value={phoneName}
                onChange={(e) => setPhoneName(e.target.value)}
                placeholder="যেমনঃ মোঃ আবির আহমেদ"
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs md:text-sm font-bold text-neutral-700 mb-1.5">
                  মোবাইল নাম্বার (Phone Number) *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                  <input
                    id="phone-input-number"
                    type="tel"
                    required
                    value={phoneNum}
                    onChange={(e) => setPhoneNum(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    maxLength={11}
                    placeholder="যেমনঃ 017XXXXXXXX"
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-mono tracking-wide transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-bold text-neutral-700 mb-1.5">
                  আপনার জেলা / শহর (District) *
                </label>
                <select
                  id="phone-input-district"
                  value={phoneDistrict}
                  onChange={(e) => setPhoneDistrict(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white transition-all"
                >
                  <option value="Dhaka">Dhaka (ঢাকা - ডেলিভারি ৬০ টাকা)</option>
                  <option value="Chittagong">Chittagong (চট্টগ্রাম - ডেলিভারি ১২০ টাকা)</option>
                  <option value="Sylhet">Sylhet (সিলেট - ডেলিভারি ১২০ টাকা)</option>
                  <option value="Rajshahi">Rajshahi (রাজশাহী - ডেলিভারি ১২০ টাকা)</option>
                  <option value="Khulna">Khulna (খুলনা - ডেলিভারি ১২০ টাকা)</option>
                  <option value="Barisal">Barisal (বরিশাল - ডেলিভারি ১২০ টাকা)</option>
                  <option value="Rangpur">Rangpur (রংপুর - ডেলিভারি ১২০ টাকা)</option>
                  <option value="Mymensingh">Mymensingh (ময়মনসিংহ - ডেলিভারি ১২০ টাকা)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs md:text-sm font-bold text-neutral-700 mb-1.5">
                সম্পূর্ণ ঠিকানা (Full Delivery Address) *
              </label>
              <textarea
                id="phone-input-address"
                required
                rows={3}
                value={phoneAddress}
                onChange={(e) => setPhoneAddress(e.target.value)}
                placeholder="যেমনঃ গ্রাম/রোডনং, হোল্ডিংনং, থানা, জেলা"
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm transition-all resize-none"
              ></textarea>
            </div>
          </div>

          {/* Pricing breakdown summary */}
          <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200/60 font-medium space-y-2 text-xs md:text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>পণ্য সংখ্যা:</span>
              <span>{selectedOffer.quantity} টি ( {selectedOffer.name} )</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>পণ্যের দাম (Subtotal):</span>
              <span>৳{rawSubtotal}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>ডেলিভারি চার্জ (Delivery Fee):</span>
              <span>{shippingCost === 0 ? <strong className="text-emerald-600">FREE SHIPPING</strong> : `৳${shippingCost}`}</span>
            </div>
            <div className="flex justify-between text-neutral-900 border-t border-neutral-200 pt-2.5 font-bold text-sm md:text-base">
              <span>সর্বমোট মোট (Grand Total):</span>
              <span className="text-amber-600 font-mono">৳{grandTotal}</span>
            </div>
          </div>

          <button
            id="phone-order-submit-btn"
            type="submit"
            className="w-full py-4 text-center text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 transition-all text-base font-extrabold rounded-xl shadow-lg border border-orange-500/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <Phone className="w-5 h-5" />
            <span>অর্ডার কনফার্ম করুন (ক্যাশ অন ডেলিভারি)</span>
          </button>
          
          {/* Trust badges to gain customer confidence */}
          <TrustSection />
        </form>
      ) : (
        /* WooCommerce Standard Checkout Form representation */
        <form id="woo-standard-form" onSubmit={handleWooSubmit} className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* WooCommerce Billing Fields */}
            <div className="lg:col-span-7 space-y-4">
              <h4 className="text-base font-bold text-neutral-950 uppercase tracking-wide flex items-center gap-2 border-b border-neutral-200 pb-2">
                <ShoppingCart className="w-5 h-5 text-orange-600" />
                <span>WooCommerce Billing Info</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    First & Last Name *
                  </label>
                  <input
                    id="woo-input-name"
                    type="text"
                    required
                    value={wooState.fullName}
                    onChange={(e) => setWooState({ ...wooState, fullName: e.target.value })}
                    placeholder="E.g., Ahsan Kabir"
                    className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg text-sm bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Phone Contact *
                  </label>
                  <input
                    id="woo-input-number"
                    type="tel"
                    required
                    value={wooState.phoneNumber}
                    onChange={(e) => setWooState({ ...wooState, phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 11) })}
                    maxLength={11}
                    placeholder="017xxxxxxxx"
                    className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg text-sm bg-neutral-50 focus:bg-white font-mono focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    id="woo-input-email"
                    type="email"
                    value={wooState.email}
                    onChange={(e) => setWooState({ ...wooState, email: e.target.value })}
                    placeholder="name@gmail.com"
                    className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg text-sm bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    City / Division *
                  </label>
                  <select
                    id="woo-input-district"
                    value={wooState.district}
                    onChange={(e) => setWooState({ ...wooState, district: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Dhaka">Dhaka (ঢাকা)</option>
                    <option value="Chittagong">Chittagong (চট্টগ্রাম)</option>
                    <option value="Rajshahi">Rajshahi (রাজশাহী)</option>
                    <option value="Sylhet">Sylhet (সিলেট)</option>
                    <option value="Khulna">Khulna (খুলনা)</option>
                    <option value="Barisal">Barisal (বরিশাল)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Street Delivery Address *
                </label>
                <input
                  id="woo-input-address"
                  type="text"
                  required
                  value={wooState.deliveryAddress}
                  onChange={(e) => setWooState({ ...wooState, deliveryAddress: e.target.value })}
                  placeholder="House number, Street name, City sector"
                  className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg text-sm bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Order Notes (Optional)
                </label>
                <textarea
                  id="woo-input-notes"
                  rows={2}
                  value={wooState.orderNotes}
                  onChange={(e) => setWooState({ ...wooState, orderNotes: e.target.value })}
                  placeholder="Notes about your delivery, e.g. delay guidelines or times..."
                  className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg text-sm bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                ></textarea>
              </div>

              {/* Package details modifier inside woo-checkout */}
              <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-200">
                <p className="text-xs font-bold text-neutral-500 uppercase mb-2">WooCommerce Multi-Package:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {offers.map(off => (
                    <label
                      key={off.id}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all ${
                        wooState.selectedOfferId === off.id 
                          ? 'border-orange-500 bg-orange-50 text-orange-950 font-semibold' 
                          : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <input
                        id={`woo-offer-selector-${off.id}`}
                        type="radio"
                        name="woo_pkg_select"
                        checked={wooState.selectedOfferId === off.id}
                        onChange={() => {
                          setWooState({ ...wooState, selectedOfferId: off.id });
                          onOfferChange(off.id);
                        }}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <div className="text-xs">
                        <p className="font-bold">{off.quantity} Pack</p>
                        <p className="text-neutral-500 font-mono">৳{off.price}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* WooCommerce Order Summary / Payments Widget */}
            <div className="lg:col-span-5 space-y-6 bg-neutral-50 border border-neutral-200 rounded-xl p-5">
              <div>
                <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-200 pb-2 mb-3">
                  Your Checkout Order
                </h4>
                
                <div className="space-y-2 text-xs md:text-sm">
                  <div className="flex justify-between pb-2 border-b border-neutral-200">
                    <span className="font-semibold text-neutral-700">{selectedOffer.name} × {selectedOffer.quantity}</span>
                    <span className="font-bold text-neutral-900">৳{rawSubtotal}</span>
                  </div>

                  {/* Shipping Selection widget */}
                  <div className="py-2 border-b border-neutral-200 space-y-1.5 bg-white p-2.5 rounded-md border border-neutral-200/50">
                    <p className="text-xs font-bold text-neutral-500 uppercase">Calculated Delivery Option:</p>
                    <label className="flex items-center justify-between text-neutral-700 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          id="woo-shipping-inside-trigger"
                          type="radio"
                          name="shipping_method_radio"
                          checked={wooState.shippingMethod === 'inside_dhaka'}
                          onChange={() => setWooState({ ...wooState, shippingMethod: 'inside_dhaka' })}
                          className="text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-xs">Inside Dhaka</span>
                      </div>
                      <span className="font-semibold text-xs">{selectedOffer.price >= 2000 ? 'FREE' : '৳60'}</span>
                    </label>
                    <label className="flex items-center justify-between text-neutral-700 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          id="woo-shipping-outside-trigger"
                          type="radio"
                          name="shipping_method_radio"
                          checked={wooState.shippingMethod === 'outside_dhaka'}
                          onChange={() => setWooState({ ...wooState, shippingMethod: 'outside_dhaka' })}
                          className="text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-xs">Outside Dhaka</span>
                      </div>
                      <span className="font-semibold text-xs">{selectedOffer.price >= 2000 ? 'FREE' : '৳120'}</span>
                    </label>
                  </div>

                  {/* Coupon Application Box */}
                  <div className="pt-2">
                    <p className="text-xs font-bold text-neutral-500 uppercase mb-1">Coupon Promo Code:</p>
                    <div className="flex gap-2">
                      <input
                        id="woo-coupon-code-input"
                        type="text"
                        placeholder="Try PROMO10 or FREE60"
                        value={wooState.couponCode}
                        onChange={(e) => setWooState({ ...wooState, couponCode: e.target.value })}
                        className="px-3 py-1.5 border border-neutral-300 rounded-md bg-white text-xs w-full focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                      <button
                        id="woo-apply-coupon-btn"
                        type="button"
                        onClick={() => handleApplyCoupon(wooState.couponCode)}
                        className="px-4 py-1.5 bg-orange-600 text-white rounded-md text-xs font-semibold hover:bg-orange-700"
                      >
                        Apply
                      </button>
                    </div>
                    {promoMessage.text && (
                      <p className={`text-xs mt-1 font-semibold ${promoMessage.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {promoMessage.text}
                      </p>
                    )}
                  </div>

                  {/* Final Calculation Block */}
                  <div className="pt-3 border-t border-neutral-200 space-y-1.5 text-neutral-600">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-semibold text-neutral-900">৳{rawSubtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping Delivery:</span>
                      <span className="font-semibold text-neutral-900">
                        {shippingCost === 0 ? <strong className="text-emerald-600 uppercase font-mono">Free</strong> : `৳${shippingCost}`}
                      </span>
                    </div>
                    {isPromoApplied && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Discount Code applied:</span>
                        <span>-৳{finalDiscount}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-extrabold text-neutral-950 border-t border-neutral-200 pt-2 text-sm md:text-base">
                      <span>Grand Total:</span>
                      <span className="text-orange-600 font-mono">৳{grandTotal}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Gateways Option */}
              <div className="bg-white border rounded-lg p-3.5 space-y-3.5">
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Select WooCommerce Payment Method</p>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer hover:bg-neutral-50 font-semibold text-xs md:text-sm text-neutral-800">
                    <input
                      id="woo-payment-cod-trigger"
                      type="radio"
                      name="payment_method_input"
                      checked={wooState.paymentMethod === 'cod'}
                      onChange={() => {
                        setWooState({ ...wooState, paymentMethod: 'cod' });
                        setPaymentStep('details');
                      }}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <Truck className="w-4 h-4 text-neutral-500" />
                    <span>Cash on Delivery (ক্যাশ অন ডেলিভারি)</span>
                  </label>

                  <label className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer hover:bg-neutral-50 font-semibold text-xs md:text-sm text-neutral-800">
                    <input
                      id="woo-payment-bkash-trigger"
                      type="radio"
                      name="payment_method_input"
                      checked={wooState.paymentMethod === 'bkash'}
                      onChange={() => {
                        setWooState({ ...wooState, paymentMethod: 'bkash' });
                        setPaymentStep('details');
                      }}
                      className="text-pink-600 focus:ring-pink-500"
                    />
                    <Wallet className="w-4 h-4 text-pink-600" />
                    <span>Pay with bKash (বিকাশ)</span>
                  </label>

                  <label className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer hover:bg-neutral-50 font-semibold text-xs md:text-sm text-neutral-800">
                    <input
                      id="woo-payment-nagad-trigger"
                      type="radio"
                      name="payment_method_input"
                      checked={wooState.paymentMethod === 'nagad'}
                      onChange={() => {
                        setWooState({ ...wooState, paymentMethod: 'nagad' });
                        setPaymentStep('details');
                      }}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <Wallet className="w-4 h-4 text-orange-600" />
                    <span>Pay with Nagad (নগদ)</span>
                  </label>
                </div>

                {/* Sub-simulation step block for Mobile Banking prepaid checkout */}
                {(wooState.paymentMethod === 'bkash' || wooState.paymentMethod === 'nagad') && (
                  <div className="bg-amber-50 border border-amber-200/50 rounded-lg p-3 space-y-2 mt-2 animate-fadeIn text-xs text-neutral-800">
                    <div className="flex items-center gap-1 text-amber-800 font-bold mb-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{wooState.paymentMethod === 'bkash' ? 'bKash Checkout Wizard' : 'Nagad Pocket Wizard'}</span>
                    </div>

                    {paymentStep === 'details' && (
                      <div className="space-y-2">
                        <p>Enter your 11-digit wallet wallet account phone number:</p>
                        <input
                          id="woo-mobile-wallet-input"
                          type="tel"
                          maxLength={11}
                          placeholder="e.g. 01725458963"
                          value={mobileNumInput}
                          onChange={(e) => setMobileNumInput(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-2 py-1.5 border border-neutral-300 rounded bg-white font-mono"
                        />
                      </div>
                    )}

                    {paymentStep === 'otp' && (
                      <div className="space-y-2">
                        <p className="text-emerald-800 font-medium font-mono">OTP Sent to {mobileNumInput}! Enter code:</p>
                        <input
                          id="woo-mobile-otp-input"
                          type="text"
                          maxLength={6}
                          placeholder="E.g., 423589"
                          value={mobileOtp}
                          onChange={(e) => setMobileOtp(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-2 py-1.5 border border-neutral-300 rounded bg-white text-center font-bold tracking-widest text-sm"
                        />
                      </div>
                    )}

                    {paymentStep === 'pin' && (
                      <div className="space-y-2">
                        <p>Provide secure PIN key to authorize direct debit transfer:</p>
                        <input
                          id="woo-mobile-pin-input"
                          type="password"
                          maxLength={5}
                          placeholder="••••"
                          value={mobilePin}
                          onChange={(e) => setMobilePin(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-2 py-1.5 border border-neutral-300 rounded bg-white text-center font-bold tracking-widest text-sm"
                        />
                      </div>
                    )}
                    
                    <p className="text-[10px] text-neutral-400">
                      <i>*Security note: This is a safe checkout simulation sandbox. Your details are secure and only logged in your current local session logs.</i>
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                id="woo-checkout-submit-btn"
                type="submit"
                className="w-full py-4 text-center bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-sm md:text-base rounded-lg shadow-md border border-neutral-700/15 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 animate-pulse" />
                <span>
                  {wooState.paymentMethod === 'cod' 
                    ? 'Place Cash On Delivery Order ৳' + grandTotal
                    : paymentStep === 'details' 
                      ? 'Proceed to Pocket Wallet payment ৳' + grandTotal
                      : paymentStep === 'otp'
                        ? 'Confirm SMS OTP Codes'
                        : 'Submit Secure PIN to Complete Order'
                  }
                </span>
              </button>

              {/* Trust badges to gain customer confidence */}
              <TrustSection />
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
