import React from 'react';
import { Sparkles, Megaphone, CheckCircle, ShieldAlert } from 'lucide-react';

interface TickerProps {
  position: 'top' | 'bottom';
}

export default function Ticker({ position }: TickerProps) {
  const topMessages = [
    { text: "স্বাগতম! আমাদের প্রিমিয়াম সোলার ক্যাম্পিং লাইটে ৬০% পর্যন্ত বিশেষ ছাড় চলছে!", icon: <Sparkles className="w-4 h-4 text-yellow-300" /> },
    { text: "Welcome! Heavy discount up to 60% on our premium Multi-functional Solar Camping Light!", icon: <Megaphone className="w-4 h-4 text-emerald-300" /> },
    { text: "সরাসরি ফোনে অর্ডার করতে কল করুন: 01800-000000 (সকাল ৯টা - রাত ১০টা)", icon: <Megaphone className="w-4 h-4 text-yellow-300" /> },
    { text: "Cash on delivery all over Bangladesh! সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা!", icon: <CheckCircle className="w-4 h-4 text-sky-300" /> },
  ];

  const bottomMessages = [
    { text: "৫ বছরের সার্ভিস ওয়ারেন্টি ও ৭ দিনের রিপ্লেসমেন্ট গ্যারান্টি!", icon: <CheckCircle className="w-4 h-4 text-green-300" /> },
    { text: "5 years service warranty & 7 days hassle-free replacement guarantee!", icon: <ShieldAlert className="w-4 h-4 text-emerald-300" /> },
    { text: "অরিজিনাল IP66 মিলিটারি গ্রেড ওয়াটারপ্রুফ বডি — বৃষ্টি বা ঝড়েও চার্জ জ্যাম্বো ব্যাকআপ!", icon: <Sparkles className="w-4 h-4 text-yellow-300" /> },
    { text: "Original rugged IP66 military grade build - perfect for flood, storm & camping!", icon: <CheckCircle className="w-4 h-4 text-sky-400" /> },
  ];

  const messages = position === 'top' ? topMessages : bottomMessages;

  // Duplicating list to make the infinite scroll smooth and continuous
  const tickerItems = [...messages, ...messages, ...messages];

  return (
    <div 
      id={`ticker-${position}`}
      className={`relative w-full overflow-hidden whitespace-nowrap py-2.5 z-40 ${
        position === 'top' 
          ? 'bg-indigo-600 text-white font-semibold border-b border-indigo-500/20' 
          : 'bg-slate-900 border-t border-slate-800 text-slate-300 font-mono text-xs'
      }`}
    >
      <div className="flex items-center min-w-full">
        {/* Double scrolling track for high fidelity visual effects */}
        <div className="flex animate-marquee shrink-0 gap-12 text-sm md:text-base tracking-wide items-center">
          {tickerItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2.5 mx-4 shrink-0">
              {item.icon}
              <span>{item.text}</span>
              <span className="text-indigo-300/60 font-bold select-none px-2">★</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
