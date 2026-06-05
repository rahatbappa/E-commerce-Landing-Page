// Shared Raw self-contained plain HTML code for Solar LED Pro Landing Page (Upgraded Premium Indigo theme)
export const rawHtmlCode = `<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>প্রিমিয়াম মাল্টি-এলইডি সোলার চার্জিং সার্চলাইট - Solar LED Pro</title>
    <!-- Google Fonts for English/Bangla Typography -->
    <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
    <!-- Tailwind CSS Play CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'Hind Siliguri', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace'],
                    },
                    animation: {
                        'infinite-marquee': 'marquee 40s linear infinite',
                        'pulse-cta': 'buyPulse 2s infinite ease-in-out'
                    },
                    keyframes: {
                        marquee: {
                            '0%': { transform: 'translateX(0%)' },
                            '100%': { transform: 'translateX(-50%)' }
                        },
                        buyPulse: {
                            '0%, 100%': { transform: 'scale(1)', boxShadow: '0 4px 20px rgba(79, 70, 229, 0.4)' },
                            '50%': { transform: 'scale(1.03)', boxShadow: '0 10px 25px rgba(79, 70, 229, 0.6)' }
                        }
                    }
                }
            }
        }
    </script>
    <style>
        body {
            font-family: 'Inter', 'Hind Siliguri', sans-serif;
            scroll-behavior: smooth;
        }
        .zoom-img-container img {
            transition: transform 0.5s ease;
        }
        .zoom-img-container:hover img {
            transform: scale(1.05);
        }
    </style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen antialiased selection:bg-indigo-600 selection:text-white">

    <!-- TOP WELCOME SCROLLING TICKER -->
    <div class="relative w-full overflow-hidden whitespace-nowrap py-2.5 bg-indigo-600 text-white font-medium border-b border-indigo-500/10 z-40">
        <div class="flex items-center min-w-full">
            <div class="flex animate-infinite-marquee gap-12 text-xs md:text-sm shrink-0 items-center">
                <span class="mx-4">🔥 ধামাকা অফার! আমাদের প্রিমিয়াম সোলার সার্চলাইটে ৬০% পর্যন্ত বিশেষ ছাড় চলছে! •</span>
                <span class="mx-4">⚡ সরাসরি ফোনে ক্যাশ অন ডেলিভারি পেতে ২৪ ঘণ্টা কল করুন: 01800-000000 •</span>
                <span class="mx-4">📦 কোনো অগ্রিম টাকা ছাড়াই সারা বাংলাদেশে কুরিয়ারে ফ্রি ডেলিভারি ডিল বিদ্যমান! •</span>
                <span class="mx-4">🌟 ৫ বছরের ফুল সার্ভিস ওয়ারেন্টি ও ৭ দিনের মানি ব্যাক সহজ রিপ্লেসমেন্ট গ্যারান্টি! •</span>
                <!-- Duplicate for seamless scrolling -->
                <span class="mx-4">🔥 ধামাকা অফার! আমাদের প্রিমিয়াম সোলার সার্চলাইটে ৬০% পর্যন্ত বিশেষ ছাড় চলছে! •</span>
                <span class="mx-4">⚡ সরাসরি ফোনে ক্যাশ অন ডেলিভারি পেতে ২৪ ঘণ্টা কল করুন: 01800-000000 •</span>
                <span class="mx-4">📦 কোনো অগ্রিম টাকা ছাড়াই সারা বাংলাদেশে কুরিয়ারে ফ্রি ডেলিভারি ডিল বিদ্যমান! •</span>
                <span class="mx-4">🌟 ৫ বছরের ফুল সার্ভিস ওয়ারেন্টি ও ৭ দিনের মানি ব্যাক সহজ রিপ্লেসমেন্ট গ্যারান্টি! •</span>
            </div>
        </div>
    </div>

    <!-- MAIN APP CONTAINER -->
    <div class="max-w-6xl mx-auto px-4 py-6 md:py-8">
        
        <!-- HEADER -->
        <header class="flex justify-between items-center py-4 border-b border-slate-200 mb-8">
            <div class="flex items-center gap-2">
                <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-md shadow-indigo-200">💡</div>
                <div>
                    <h1 class="text-lg font-black tracking-tight text-slate-900 leading-none">SOLAR LED PRO</h1>
                    <p class="text-[9px] text-indigo-600 font-mono font-bold tracking-widest uppercase mt-0.5">Premium Camping Companion</p>
                </div>
            </div>
            <a href="#checkout-section" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all shadow-md shadow-indigo-100">
                অর্ডার দিন (Buy Now)
            </a>
        </header>

        <!-- HERO SECTION -->
        <section class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16 relative">
            
            <!-- Bg decorative spots -->
            <div class="absolute -top-10 right-1/4 w-72 h-72 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none -z-10"></div>
            <div class="absolute -bottom-10 left-10 w-80 h-80 bg-slate-100/80 rounded-full blur-3xl pointer-events-none -z-10"></div>

            <div class="lg:col-span-7 space-y-6">
                <span class="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold tracking-wide py-1.5 px-3 rounded-full border border-indigo-100 uppercase">
                    ★ ১-ক্লিক সিকিউরড ক্যাশ-অন-ডেলিভারি ডিল
                </span>
                <h2 class="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                    লোডশেডিং আর অন্ধকারেও আপনার বিশ্বস্ত স্মার্ট বন্ধু — <span class="text-indigo-600">IP66 Waterproof Solar Searchlight!</span>
                </h2>
                <p class="text-sm md:text-base text-slate-600 leading-relaxed font-sans">
                    দিনের পর দিন লোডশেডিংয়ের যন্ত্রণা, দুর্গম পাহাড়ি পথ বা রাতে এমার্জেন্সি ক্যাম্পিং করতে দেশের সেরা মাল্টি-পারপাস সোলার সার্চলাইট হতে পারে আপনার সার্বক্ষণিক ভরসা। বিদ্যুৎ না থাকলেও সূর্যালোকেই পেছনের প্যানেল দিয়ে চার্জ হয়ে এটি ব্যাকআপ দেয় একটানা ১০ থেকে ১২ ঘণ্টা!
                </p>

                <!-- Key highlights list -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    <div class="flex items-start gap-3 bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                        <span class="text-indigo-600 font-bold text-sm bg-indigo-50 w-5 h-5 rounded-full flex items-center justify-center shrink-0">✔</span>
                        <p class="text-xs text-slate-700 leading-normal"><strong>৪টি মাল্টি-মোড এলইডি:</strong> ডেলাইট, সফট রিডিং ওয়ার্ম, মিক্সড পাওয়ার ও police এসওএস ফ্ল্যাশ!</p>
                    </div>
                    <div class="flex items-start gap-3 bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                        <span class="text-indigo-600 font-bold text-sm bg-indigo-50 w-5 h-5 rounded-full flex items-center justify-center shrink-0">✔</span>
                        <p class="text-xs text-slate-700 leading-normal"><strong>পলিসিলিকন সোলার সেল:</strong> প্রাকৃতিক আলোতেই ফ্রিতে চার্জ, বিদ্যুৎ বিলের ঝামেলা চিরতরে শেষ!</p>
                    </div>
                    <div class="flex items-start gap-3 bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                        <span class="text-indigo-600 font-bold text-sm bg-indigo-50 w-5 h-5 rounded-full flex items-center justify-center shrink-0">✔</span>
                        <p class="text-xs text-slate-700 leading-normal"><strong>IP66 মিলিটারি ওয়াটারপ্রুফ:</strong> ঝড়-বৃষ্টি বা বন্যাতেও সচ্ছল সার্ভিস। ক্ষতিকর ধূলিকণা ঢুকবেনা!</p>
                    </div>
                    <div class="flex items-start gap-3 bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                        <span class="text-indigo-600 font-bold text-sm bg-indigo-50 w-5 h-5 rounded-full flex items-center justify-center shrink-0">✔</span>
                        <p class="text-xs text-slate-700 leading-normal"><strong>এমার্জেন্সি পাওয়ার ব্যাংক:</strong> মোবাইলের চার্জ শেষ হলে ব্যাকআপ চার্জ করার রিডানড্যান্ট USB আউটলেট!</p>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                    <a href="#checkout-section" class="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base text-center rounded-xl transition-all shadow-md animate-pulse-cta">
                        কিনুন (Buy Now) • ৬০% বিশেষ ছাড়
                    </a>
                    
                    <div class="flex items-center gap-2 bg-slate-150 p-2 px-4 rounded-lg border border-slate-200 justify-center">
                        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <span class="text-[11px] text-slate-650 font-bold font-sans">১৬৫+ অর্ডার সফলভাবে ডেলিভারড করা হয়েছে আজকে!</span>
                    </div>
                </div>
            </div>

            <!-- Gallery simulation on plain html -->
            <div class="lg:col-span-5 space-y-4">
                <div class="relative bg-white rounded-2xl border border-slate-200 p-4 shadow-xl overflow-hidden zoom-img-container">
                    <span class="absolute top-4 left-4 z-10 bg-red-600 text-white font-black text-[10px] py-1 px-3 rounded-full uppercase tracking-wider">
                        60% OFF Today
                    </span>
                    
                    <div class="w-full aspect-square bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-center p-4">
                        <!-- Custom inline representation of Premium light super spotlight -->
                        <div id="gallery-container" class="flex items-center justify-center">
                            <!-- SVGs are used as ultra-high fidelity drawings of Solar Charging Spotlight inside standard HTML -->
                            <svg id="gallery-view-front" class="w-48 h-48 text-indigo-600 opacity-95" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l.707-.707m2.818 12.014c.09.117.166.241.226.372l1.206 2.568a1.125 1.125 0 002.014 0l1.206-2.568c.06-.131.136-.255.226-.372a3.9 3.9 0 00.951-2.562 3.84 3.84 0 00-7.68 0c0 .97.34 1.861.951 2.562zm6.516-2.562h-1.337a1.125 1.125 0 01-1.125-1.125V10.125c0-.621.504-1.125 1.125-1.125h1.337c.621 0 1.125.504 1.125 1.125v1.625c0 .621-.504 1.125-1.125 1.125z" />
                            </svg>
                            <svg id="gallery-view-solar" class="hidden w-48 h-48 text-indigo-600 opacity-95" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                            </svg>
                            <svg id="gallery-view-camping" class="hidden w-48 h-48 text-indigo-600 opacity-95" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <circle cx="12" cy="12" r="3" stroke-width="1.2" />
                            </svg>
                        </div>
                    </div>

                    <!-- Gallery thumbnails interactive triggers -->
                    <div class="grid grid-cols-3 gap-2 mt-3">
                        <button onclick="switchGalleryImg('front')" id="thumb-front" class="p-1.5 rounded-lg border bg-white transition-all border-indigo-600 scale-[1.02] shadow-sm">
                            <span class="text-xs block font-bold text-slate-800">Front view</span>
                            <span class="text-[8px] uppercase mt-0.5 font-mono block text-indigo-605 font-bold">Searchlight</span>
                        </button>
                        <button onclick="switchGalleryImg('solar')" id="thumb-solar" class="p-1.5 rounded-lg border bg-white transition-all border-slate-200 opacity-70 hover:opacity-100">
                            <span class="text-xs block font-bold text-slate-800">Solar panel</span>
                            <span class="text-[8px] uppercase mt-0.5 font-mono block text-slate-500 font-medium">Auto-Charge</span>
                        </button>
                        <button onclick="switchGalleryImg('camping')" id="thumb-camping" class="p-1.5 rounded-lg border bg-white transition-all border-slate-200 opacity-70 hover:opacity-100">
                            <span class="text-xs block font-bold text-slate-800">Emergency</span>
                            <span class="text-[8px] uppercase mt-0.5 font-mono block text-slate-500 font-medium">Power Bank</span>
                        </button>
                    </div>

                    <div class="flex justify-between items-center bg-slate-50 p-4 border border-slate-200 rounded-xl mt-4">
                        <div class="text-left">
                            <span class="text-[10px] font-bold text-slate-500 uppercase">বিশেষ লাঞ্চ ক্যাম্পেইন অফার:</span>
                            <p class="text-2xl font-black text-indigo-600">৳১,৪৯০ <span class="text-xs text-slate-400 font-normal line-through">regular ৳২,৫০০</span></p>
                        </div>
                        <div class="text-right">
                            <p class="text-xs text-emerald-600 font-bold">✔ স্টক সীমিত!</p>
                            <p class="text-[9px] text-slate-500 font-medium">৫ বছরের সার্ভিস ওয়ারেন্টি</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- PRODUCT DETAILS GRID -->
        <section class="border-t border-slate-200 pt-16 mb-16">
            <div class="text-center max-w-lg mx-auto mb-12">
                <span class="text-xs uppercase tracking-widest font-bold text-indigo-600 font-mono">Unbeatable Advantages</span>
                <h3 class="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">ক্যাম্পিং ও হোম মাল্টি-পারপাসের বেস্ট ফিচারস</h3>
                <p class="text-xs md:text-sm text-slate-505 mt-2">আমাদের এমার্জেন্সি সোলার লাইটে এমন সব অত্যাধুনিক প্রযুক্তি ব্যবহৃত হয়েছে যা এটিকে সাধারণ সব সস্তা লাইট থেকে ১০০% আলাদা করে তোলে।</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Feature Card 1 -->
                <div class="bg-white border border-slate-200 p-6 rounded-2xl hover:border-indigo-600/20 transition-all shadow-sm">
                    <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl mb-4">⚙</div>
                    <h4 class="text-lg font-bold text-slate-900 mb-2">৪টি ওরিজিনাল বাটন স্পেক গিয়ার্স</h4>
                    <p class="text-xs text-slate-650 leading-relaxed">
                        প্রয়োজনমত সিঙ্গেল বাটন ক্লিকেই পরিবর্তন করুন মোড: প্রথম গিয়ার কুল হোয়ایت ডেলাইট, দ্বিতীয় মৃদু ওয়ার্ম লাইট, তৃতীয় মিক্সড শক্তিশালী হোয়ایت এবং চতুর্থ রেড-ব্লু এসওএস ফ্লাশিং ইমার্জেন্সি সিগন্যাল।
                    </p>
                </div>
                <!-- Feature Card 2 -->
                <div class="bg-white border border-slate-200 p-6 rounded-2xl hover:border-indigo-600/20 transition-all shadow-sm">
                    <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl mb-4">☀</div>
                    <h4 class="text-lg font-bold text-slate-900 mb-2">ইনবিল্ট সোলার প্যানেল রিচার্জ</h4>
                    <p class="text-xs text-slate-650 leading-relaxed">
                        লাইটের পেছনে থাকা পলিসিলিকন সোলার সেলের উচ্চ সংবেদনশীলতার কারণে এটি সুর্যের আলো ছাড়াও ঘরের টিউবলাইটের আলোতেও মৃদু রিচার্জ নিতে সক্ষম!
                    </p>
                </div>
                <!-- Feature Card 3 -->
                <div class="bg-white border border-slate-200 p-6 rounded-2xl hover:border-indigo-600/20 transition-all shadow-sm">
                    <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl mb-4">🔋</div>
                    <h4 class="text-lg font-bold text-slate-900 mb-2">মোবাইল এমার্জেন্সি পাওয়ার ব্যাংক</h4>
                    <p class="text-xs text-slate-655 leading-relaxed">
                        এতে থাকা পাওয়ারফুল ৫০০০mAh রিচার্জেবল ব্যাটারি ও ইনবিল্ট USB সকেট থেকে যেকোনো সময়ে জরুরি পরিস্থিতিতে আপনার স্মার্টফোন বা ট্র্যাকিং ব্যান্ড সম্পূর্ণ ফ্রিতে চার্জ দিতে পারবেন।
                    </p>
                </div>
            </div>
        </section>

        <!-- DETAILED PHOTO REVIEWS SECTION WITH AUTHENTIC LOCAL NAMES -->
        <section class="border-t border-slate-200 pt-16 mb-16">
            <div class="text-center max-w-lg mx-auto mb-12">
                <span class="text-xs uppercase tracking-widest font-bold text-indigo-600 font-mono">Verified Customer Feedback</span>
                <h3 class="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">আমাদের হ্যাপি গ্রাহকদের প্রশংসাপত্র</h3>
                <p class="text-xs md:text-sm text-slate-500 mt-2">সারাদেশে হাজারো কাস্টমার ব্যবহার করে ১০০% খুশি ও সন্তুষ্ট হয়ে তাদের অভিজ্ঞতা শেয়ার করেছেন।</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Review 1 -->
                <div class="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
                    <div class="flex gap-1 text-amber-500">
                        <span class="text-sm">★</span><span class="text-sm">★</span><span class="text-sm">★</span><span class="text-sm">★</span><span class="text-sm">★</span>
                    </div>
                    <p class="text-xs text-slate-650 leading-relaxed italic">
                        "আমি সিলেটে থাকি, আমাদের এখানে খুব ঝড় বৃষ্টিতে বিদ্যুৎ চলে যায়। আমি এই সোলার লাইটটি কিনে অনেক ভালো সাপোর্ট পাচ্ছি। বিশেষ করে রাতে ঝড়ের দিনে সোলার দিয়ে সম্পূর্ণ ফ্রিতে চার্জ দেয়া যায়। আর ৫ বছরের নিশ্চিন্ত সার্ভিস ওয়ারেন্টির কারণে ভরসা পেয়েছি।"
                    </p>
                    <div class="flex items-center gap-2.5 pt-2 border-t border-slate-100">
                        <div class="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 text-xs font-black flex items-center justify-center">RM</div>
                        <div>
                            <p class="text-xs font-bold text-slate-900">রাকিবুল হাসান মিনা</p>
                            <p class="text-[10px] text-slate-400 font-medium">আম্বরখানা, সিলেট</p>
                        </div>
                    </div>
                </div>

                <!-- Review 2 -->
                <div class="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
                    <div class="flex gap-1 text-amber-500">
                        <span class="text-sm">★</span><span class="text-sm">★</span><span class="text-sm">★</span><span class="text-sm">★</span><span class="text-sm">★</span>
                    </div>
                    <p class="text-xs text-slate-650 leading-relaxed italic">
                        "লাইটটার ফ্রেমটা অনেক মজবুত আর পিছনে থাকা সোলার প্যানেলটা দিয়ে খুব দ্রুত চার্জ হয়। পানিতে পড়লেও নষ্ট হয় না। ডিরেক্ট ক্যাশ অন ডেলিভারিতে অর্ডার দিয়েছিলাম, ২৪ ঘণ্টার মধ্যে আমার মিরপুরের বাসায় এসে ডেলিভারি দিয়ে গেছে। অসাধারণ সার্ভিস!"
                    </p>
                    <div class="flex items-center gap-2.5 pt-2 border-t border-slate-100">
                        <div class="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 text-xs font-black flex items-center justify-center">TK</div>
                        <div>
                            <p class="text-xs font-bold text-slate-900">তারেক আহমেদ খান</p>
                            <p class="text-[10px] text-slate-400 font-medium">মিরপুর-১২, ঢাকা</p>
                        </div>
                    </div>
                </div>

                <!-- Review 3 -->
                <div class="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
                    <div class="flex gap-1 text-amber-500">
                        <span class="text-sm">★</span><span class="text-sm">★</span><span class="text-sm">★</span><span class="text-sm">★</span><span class="text-sm">★</span>
                    </div>
                    <p class="text-xs text-slate-650 leading-relaxed italic">
                        "Awesome solid product. The thick orange bumpers are robust and shock-absorbing. Solar light charges perfectly fine even beside room windows. Emergency SOS mode is exceptionally good. Recommended for all households in BD."
                    </p>
                    <div class="flex items-center gap-2.5 pt-2 border-t border-slate-100">
                        <div class="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 text-xs font-black flex items-center justify-center">AK</div>
                        <div>
                            <p class="text-xs font-bold text-slate-900">Ahsanul Karim</p>
                            <p class="text-[10px] text-slate-400 font-medium">Wari, Old Dhaka</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- DYNAMIC CAMPAIGN PACKAGE CARDS -->
        <section class="max-w-6xl mx-auto py-8 mb-12">
            <div class="text-center max-w-xl mx-auto mb-10">
                <span class="text-xs uppercase tracking-widest font-bold text-indigo-600 font-mono font-sans">Save More, Get More</span>
                <h3 class="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">সবচেয়ে লাভজনক অফারটি বেছে নিন</h3>
                <p class="text-xs text-slate-500 mt-2">ফ্যামিলি প্যাক অথবা কাস্টম সেভার ক্যাম্প ডিল কিনলে পাচ্ছেন আকর্ষণীয় বিল ডিসকাউন্ট এবং ফ্রী হোম ডেলিভারি!</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Pkg 1 -->
                <div onclick="selectProductPackage('pkg_1', 1490, 1, '১টি সোলার এমার্জেন্সি লাইট (Standard Deal)')" id="pkg-card-pkg_1" class="relative p-6 rounded-2xl cursor-pointer transition-all border bg-white border-slate-200 hover:bg-slate-50 flex flex-col justify-between">
                    <span class="absolute -top-3 left-4 bg-red-600 text-white text-[9px] uppercase font-bold px-2.5 py-1 rounded-full">৪০% ছাড়</span>
                    <div class="space-y-4 pt-1">&nbsp;
                        <h4 class="font-bold text-base text-slate-900">১টি সোলার এমার্জেন্সি লাইট</h4>
                        <p class="text-xs text-slate-500 font-medium leading-relaxed">১টি সোলার সার্চলাইট, ১টি চার্জিং ক্যাবল, ৭ দিনের রিপ্লেসমেন্ট এবং ৫ বছরের লাইফটাইম ফ্রি সার্ভিস ওয়ারেন্টি ডিল।</p>
                    </div>
                    <div class="pt-6 border-t border-slate-100 mt-6 flex justify-between items-end">
                        <div>
                            <span class="text-[9px] text-slate-450 block font-medium uppercase">অফার মূল্য:</span>
                            <span class="text-2xl text-indigo-600 font-extrabold font-mono font-sans">৳১,৪৯০</span>
                            <span class="text-xs text-slate-450 line-through block">৳২,৫০০</span>
                        </div>
                        <div id="pkg-check-pkg_1" class="w-5 h-5 rounded-full border border-slate-300 text-transparent flex items-center justify-center font-bold text-xs select-none">✓</div>
                    </div>
                </div>

                <!-- Pkg 2 -->
                <div onclick="selectProductPackage('pkg_2', 2690, 2, '২টি ফ্যামিলি জ্যাম্বো ক্যাম্পিং ডিল (Best Selling)')" id="pkg-card-pkg_2" class="relative p-6 rounded-2xl cursor-pointer transition-all border bg-indigo-50/40 border-indigo-600 shadow-xl shadow-indigo-100 flex flex-col justify-between">
                    <span class="absolute -top-3 left-4 bg-red-600 text-white text-[9px] uppercase font-bold px-2.5 py-1 rounded-full">৪৮% ছাড় + ফ্রি শিপিং!</span>
                    <span class="absolute -top-3.5 right-4 bg-indigo-600 text-white text-[9px] uppercase font-bold px-2.5 py-1 rounded-full shadow">BEST SELLER</span>
                    <div class="space-y-4 pt-1">&nbsp;
                        <h4 class="font-bold text-base text-slate-900">২টি ফ্যামিলি ক্যাম্পিং ডিল</h4>
                        <p class="text-xs text-slate-550 leading-relaxed">২টি অরিজিনাল সোলার লাইট, ২টি চার্জিং ক্যাবল, ফ্রি এক্সপ্রেস সারা বাংলাদেশ হোম কুরিয়ার এবং ৫ বছরের ওরিজিনাল ওয়ারেন্টি সাপোর্ট!</p>
                    </div>
                    <div class="pt-6 border-t border-indigo-105 mt-6 flex justify-between items-end">
                        <div>
                            <span class="text-[9px] text-slate-450 block font-medium uppercase">অফার মূল্য:</span>
                            <span class="text-2xl text-indigo-600 font-extrabold font-mono font-sans">৳২,৬৯০</span>
                            <span class="text-xs text-slate-450 line-through block">৳৫,০০০</span>
                        </div>
                        <div id="pkg-check-pkg_2" class="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs select-none">✓</div>
                    </div>
                </div>

                <!-- Pkg 3 -->
                <div onclick="selectProductPackage('pkg_3', 3850, 3, '৩টি মেগা ট্র্যাভেলার ব্যাকআপ ডিল (Mega Value)')" id="pkg-card-pkg_3" class="relative p-6 rounded-2xl cursor-pointer transition-all border bg-white border-slate-200 hover:bg-slate-50 flex flex-col justify-between">
                    <span class="absolute -top-3 left-4 bg-red-600 text-white text-[9px] uppercase font-bold px-2.5 py-1 rounded-full">৫০% ছাড় + ফ্রি শিপিং + গিফট!</span>
                    <div class="space-y-4 pt-1">&nbsp;
                        <h4 class="font-bold text-base text-slate-900">৩টি মেগা ট্র্যাভেলার ব্যাকআপ ডিল</h4>
                        <p class="text-xs text-slate-500 font-medium leading-relaxed">৩টি রিচার্জেবল সোলার লাইট, ৩টি ক্যাবল, ফ্রি সারাদেশে হোম ডেলিভারি এবং ১টি সিকিউরড পকেট মেটাল মাল্টি-টুলকার্ড আকর্ষণীয় গিফট!</p>
                    </div>
                    <div class="pt-6 border-t border-slate-100 mt-6 flex justify-between items-end">
                        <div>
                            <span class="text-[9px] text-slate-450 block font-medium uppercase">অফার মূল্য:</span>
                            <span class="text-2xl text-indigo-600 font-extrabold font-mono font-sans">৳৩,৮৫০</span>
                            <span class="text-xs text-slate-450 line-through block">৳৭,৫০০</span>
                        </div>
                        <div id="pkg-check-pkg_3" class="w-5 h-5 rounded-full border border-slate-300 text-transparent flex items-center justify-center font-bold text-xs select-none">✓</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- LEAD CHECKOUT / BILLING AREA Anchor -->
        <span id="checkout-section" class="block h-2 select-none"></span>

        <!-- CO-ORDINATED DUAL FORM AND CHECKOUT INTEGRATION -->
        <section class="max-w-3xl mx-auto mb-16 bg-white text-slate-800 rounded-2xl overflow-hidden shadow-xl border border-slate-200">
            <!-- Tabs -->
            <div class="flex bg-slate-900 border-b border-slate-800 text-white">
                <button onclick="switchTab('phone')" id="tab-phone-trigger" class="flex-1 py-4 text-center font-black text-sm md:text-base bg-indigo-600 flex items-center justify-center gap-2 text-white cursor-pointer">
                    📞 ফোনে সরাসরি দ্রুত অর্ডার
                </button>
                <button onclick="switchTab('woo')" id="tab-woo-trigger" class="flex-1 py-4 text-center font-bold text-xs md:text-base text-slate-400 hover:text-white flex items-center justify-center gap-2 cursor-pointer">
                    🛒 WooCommerce Checkout
                </button>
            </div>

            <!-- SUCCESS MESSAGE (HIDDEN BY DEFAULT) -->
            <div id="success-message" class="hidden p-8 text-center bg-indigo-50/20">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4 font-bold text-3xl">✓</div>
                <h3 class="text-2xl font-black text-slate-905">অর্ডার সফলভাবে গ্রহণ করা হয়েছে!</h3>
                <p class="text-xs md:text-sm text-slate-500 max-w-sm mx-auto mt-2 mb-6">আমাদের কাস্টমার কেয়ার প্রতিনিধি পরবর্তী ১৫ মিনিটের মধ্যে আপনার প্রদত্ত নাম্বারে কল করে অর্ডারটি নিশ্চিত করবেন। ধন্যবাদ!</p>
                
                <!-- Dynamic Invoice printed here after submit -->
                <div id="invoice-details" class="bg-white border text-left border-dashed border-slate-300 p-5 rounded-xl text-xs space-y-1.5 max-w-md mx-auto mb-6 shadow-sm text-slate-800"></div>
                
                <button onclick="resetForms()" class="px-6 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 font-bold rounded-lg transition-colors cursor-pointer">অর্ডার আবার দিন (Order Again)</button>
            </div>

            <!-- 1-CLICK DRAFT FORM -->
            <form id="form-phone" onsubmit="submitPhoneOrder(event)" class="p-6 md:p-8 space-y-5">
                <div class="p-3 bg-indigo-50/50 text-indigo-900 border border-indigo-100/50 text-xs rounded-lg select-none">
                    <strong>১-ক্লিকে ফোন অর্ডার:</strong> নিচে আপনার নাম, মোবাইল নম্বর এবং স্পষ্ট রিসিভ করার ঠিকানা প্রদান করে 'অর্ডার প্লেস করুন' বাটনে ক্লিক করুন।
                </div>

                <div class="bg-slate-50 p-4 rounded-xl flex justify-between items-center border border-slate-200">
                    <div>
                        <p id="bill-item-name" class="font-bold text-slate-900 text-sm">২টি ফ্যামিলি জ্যাম্বো ক্যাম্পিং ডিল (Best Selling)</p>
                        <p class="text-[10px] text-slate-500">ফ্ল্যাশ লাইট, ফাস্ট চার্জার ক্যাবল ও ফ্রি ৫ বছরের সার্ভিস গ্যারান্টি</p>
                    </div>
                    <div class="text-right">
                        <span id="bill-item-price" class="font-black text-indigo-600 font-mono text-lg">৳২,৬৯০</span>
                    </div>
                </div>

                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-605 uppercase mb-1">আপনার নাম (Full Name) *</label>
                        <input id="p_name" type="text" required placeholder="মোঃ আবির আহমেদ" class="w-full px-4 py-2.5 border border-slate-250 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 transition-colors">
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-605 uppercase mb-1">মোবাইল নাম্বার (11-Digit Mobile Number) *</label>
                            <input id="p_phone" type="tel" required placeholder="017xxxxxxxx" class="w-full px-4 py-2.5 border border-slate-250 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 transition-all font-mono">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-605 uppercase mb-1">ডেলিভারি ডিস্ট্রিক্ট / জেলা *</label>
                            <select id="p_district" onchange="recalculatePrice()" class="w-full px-4 py-2.5 border border-slate-250 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600">
                                <option value="Dhaka">Dhaka (ঢাকা সিটি - কুরিয়ার ৬০ টাকা)</option>
                                <option value="Outside">Outside Dhaka (ঢাকার বাইরে - কুরিয়ার ১২০ টাকা)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-605 uppercase mb-1">সম্পূর্ণ ঠিকানা (Full Delivery Address) *</label>
                        <textarea id="p_addr" required rows="3" placeholder="বাসা/গ্রাম নং, সড়ক এলাকা, থানা, জেলা" class="w-full px-4 py-2.5 border border-slate-250 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 resize-none transition-colors"></textarea>
                    </div>
                </div>

                <!-- Live Price Breakdown -->
                <div class="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-1.5 text-xs text-slate-600 shadow-inner">
                    <div class="flex justify-between">
                        <span>পণ্যের দাম (Subtotal):</span>
                        <span id="p_subtotal_text">৳২,৬৯০</span>
                    </div>
                    <div class="flex justify-between">
                        <span>কুরিয়ার ডেলিভারি চার্জ (Courier Charge):</span>
                        <span id="p_shipping_text">৳০</span>
                    </div>
                    <div class="flex justify-between font-extrabold text-slate-900 text-sm border-t border-slate-200 pt-2">
                        <span>সর্বমোট বিল (Grand Total):</span>
                        <span id="p_grand_total">৳২,৬৯০</span>
                    </div>
                </div>

                <button type="submit" class="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-lg active:scale-[0.99] transition-all text-center cursor-pointer shadow-md shadow-indigo-100">
                    সহজে ক্যাশ অন ডেলিভারি অর্ডার সাবমিট করুন (৳)
                </button>
            </form>

            <!-- WOOCOMMERCE FORM (HIDDEN) -->
            <form id="form-woo" onsubmit="submitWooOrder(event)" class="hidden p-6 md:p-8 space-y-5">
                <div class="p-3 bg-slate-50 border border-slate-200 text-xs text-slate-600 rounded-lg">
                    <strong>WooCommerce Billing Checkout:</strong> Please fill in custom requirements, billing info and placement options.
                </div>

                <!-- Billing details -->
                <div class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-605 uppercase mb-1">First & Last Name *</label>
                            <input id="w_name" type="text" required placeholder="Abrar Hossen" class="w-full px-4 py-2.5 border border-slate-250 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-605 uppercase mb-1">Cell Phone Number *</label>
                            <input id="w_phone" type="tel" required placeholder="017xxxxxxxx" class="w-full px-4 py-2.5 border border-slate-250 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-605 uppercase mb-1">Email Name (Optional)</label>
                            <input id="w_email" type="email" placeholder="example@domain.com" class="w-full px-4 py-2.5 border border-slate-250 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-605 uppercase mb-1">Courier Area Zone *</label>
                            <select id="w_shipping" onchange="recalculatePrice()" class="w-full px-4 py-2.5 border border-slate-250 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600">
                                <option value="inside_dhaka">Inside Dhaka (৳60)</option>
                                <option value="outside_dhaka">Outside Dhaka (৳120)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-605 uppercase mb-1">Shipping Full Address *</label>
                        <input id="w_addr" type="text" required placeholder="House number, Street sectoral area" class="w-full px-4 py-2.5 border border-slate-250 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-800">
                    </div>

                    <!-- Payment methods -->
                    <div class="space-y-2 border-t border-slate-205 pt-3">
                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">WooCommerce Payment Gateway</label>
                        <div class="space-y-2">
                            <label class="flex items-center gap-2.5 p-3 border rounded-xl text-xs font-medium bg-slate-50 hover:bg-slate-100 cursor-pointer text-slate-800 border-slate-200">
                                <input type="radio" value="cod" name="payment_method" checked class="text-indigo-650 focus:ring-indigo-500">
                                <span>Cash on Delivery (COD)</span>
                            </label>
                            <label class="flex items-center gap-2.5 p-3 border rounded-xl text-xs font-medium bg-slate-50 hover:bg-slate-100 cursor-pointer text-slate-800 border-slate-200">
                                <input type="radio" value="bkash" name="payment_method" class="text-indigo-650 focus:ring-indigo-500">
                                <span>bKash Mobile Pocket Wallet transfer (Simulated)</span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- WooCommerce Grand Total box -->
                <div class="bg-indigo-50/30 p-4 border border-indigo-100 rounded-xl space-y-1.5 text-xs text-slate-700">
                    <div class="flex justify-between">
                        <span>Cart Total:</span>
                        <span id="w_subtotal_text">৳২,৬৯০</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Cart Shipping:</span>
                        <span id="w_shipping_text">৳০</span>
                    </div>
                    <div class="flex justify-between font-extrabold text-slate-900 border-t border-indigo-100 pt-2 text-sm">
                        <span>WooCommerce Grand Total:</span>
                        <span id="w_grand_total">৳২,৬৯০</span>
                    </div>
                </div>

                <button type="submit" class="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-extrabold text-xs md:text-sm rounded-lg active:scale-[0.99] transition-all text-center cursor-pointer shadow-md">
                    Proceed to WooCommerce Dispatch Order (Simulated)
                </button>
            </form>
        </section>

        <!-- SECURITY FOOTER GUARANTEES -->
        <section class="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-white border border-slate-200 rounded-2xl text-center mb-16 shadow-inner">
            <div class="space-y-1">
                <span class="text-lg">📦</span>
                <h5 class="text-xs font-black text-slate-900">ক্যাশ অন ডেলিভারি</h5>
                <p class="text-[10px] text-slate-500 font-medium">হাতে মাল পেয়ে টাকা পরিশোধ করুন</p>
            </div>
            <div class="space-y-1 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0">
                <span class="text-lg">🚚</span>
                <h5 class="text-xs font-black text-slate-900">সারাদেশে কুরিয়ার</h5>
                <p class="text-[10px] text-slate-500 font-medium">২৪ থেকে ৪৮ ঘণ্টায় এক্সপ্রেস ডেলিভারি</p>
            </div>
            <div class="space-y-1 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0">
                <span class="text-lg">🛡</span>
                <h5 class="text-xs font-black text-slate-900">সহজ ৭ দিনের রিটার্ন</h5>
                <p class="text-[10px] text-slate-500 font-medium">যেকোনো টেকনিক্যাল ত্রুটিতে ১০০% বদল</p>
            </div>
            <div class="space-y-1 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0">
                <span class="text-lg">⚙</span>
                <h5 class="text-xs font-black text-slate-900">৫ বছরের ওয়ারেন্টি</h5>
                <p class="text-[10px] text-slate-500 font-medium">আজীবন ফ্রি পার্টস সার্ভিসিং ওয়ারেন্টি</p>
            </div>
        </section>

        <!-- FOOTER FAQ -->
        <footer class="border-t border-slate-200 pt-8 pb-12 text-center text-xs text-slate-500">
            <p class="mb-2">💡 <strong>Solar LED Pro</strong> — Designed for Emergency Backup, Tracking and Active Campings in BD.</p>
            <p>© 2026 E-Commerce Limited. All Rights Reserved. Active theme and plugin components authorized.</p>
        </footer>

    </div>

    <!-- DYNAMIC JAVASCRIPT FOR ORDER TRANSFERS, TAB ACTIONS AND GALERRIES -->
    <script>
        // Setup initial selected package values
        let currentPackage = {
            id: 'pkg_2',
            name: '২টি ফ্যামিলি জ্যাম্বো ক্যাম্পিং ডিল (Best Selling)',
            price: 2690,
            quantity: 2
        };

        function switchGalleryImg(type) {
            document.getElementById('gallery-view-front').classList.add('hidden');
            document.getElementById('gallery-view-solar').classList.add('hidden');
            document.getElementById('gallery-view-camping').classList.add('hidden');
            
            document.getElementById('thumb-front').className = 'p-1.5 rounded-lg border bg-white transition-all border-slate-200 opacity-70';
            document.getElementById('thumb-solar').className = 'p-1.5 rounded-lg border bg-white transition-all border-slate-200 opacity-70';
            document.getElementById('thumb-camping').className = 'p-1.5 rounded-lg border bg-white transition-all border-slate-200 opacity-70';

            const activeView = 'gallery-view-' + type;
            const activeThumb = 'thumb-' + type;

            document.getElementById(activeView).classList.remove('hidden');
            document.getElementById(activeThumb).className = 'p-1.5 rounded-lg border bg-white transition-all border-indigo-650 scale-[1.02] shadow-sm';
        }

        function selectProductPackage(pkgId, price, quantity, name) {
            currentPackage.id = pkgId;
            currentPackage.price = price;
            currentPackage.quantity = quantity;
            currentPackage.name = name;

            // Reset borders
            document.getElementById('pkg-card-pkg_1').className = 'relative p-6 rounded-2xl cursor-pointer transition-all border bg-white border-slate-200 hover:bg-slate-50 flex flex-col justify-between';
            document.getElementById('pkg-card-pkg_2').className = 'relative p-6 rounded-2xl cursor-pointer transition-all border bg-white border-slate-200 hover:bg-slate-50 flex flex-col justify-between';
            document.getElementById('pkg-card-pkg_3').className = 'relative p-6 rounded-2xl cursor-pointer transition-all border bg-white border-slate-200 hover:bg-slate-50 flex flex-col justify-between';

            // Reset marks
            document.getElementById('pkg-check-pkg_1').className = 'w-5 h-5 rounded-full border border-slate-300 text-transparent flex items-center justify-center font-bold text-xs select-none';
            document.getElementById('pkg-check-pkg_2').className = 'w-5 h-5 rounded-full border border-slate-300 text-transparent flex items-center justify-center font-bold text-xs select-none';
            document.getElementById('pkg-check-pkg_3').className = 'w-5 h-5 rounded-full border border-slate-300 text-transparent flex items-center justify-center font-bold text-xs select-none';

            // Focus card
            const activeCard = document.getElementById('pkg-card-' + pkgId);
            const activeCheck = document.getElementById('pkg-check-' + pkgId);

            if (pkgId === 'pkg_2') {
                activeCard.className = 'relative p-6 rounded-2xl cursor-pointer transition-all border bg-indigo-50/40 border-indigo-600 shadow-xl shadow-indigo-100 flex flex-col justify-between';
            } else {
                activeCard.className = 'relative p-6 rounded-2xl cursor-pointer transition-all border bg-indigo-50/20 border-indigo-600 shadow-md flex flex-col justify-between';
            }
            activeCheck.className = 'w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs select-none';

            // Update Billing view
            document.getElementById('bill-item-name').innerText = name;
            document.getElementById('bill-item-price').innerText = '৳' + price;

            recalculatePrice();
        }

        function switchTab(mode) {
            const tabPhone = document.getElementById('tab-phone-trigger');
            const tabWoo = document.getElementById('tab-woo-trigger');
            const formPhone = document.getElementById('form-phone');
            const formWoo = document.getElementById('form-woo');

            if (mode === 'phone') {
                tabPhone.className = 'flex-1 py-4 text-center font-black text-sm md:text-base bg-indigo-600 flex items-center justify-center gap-2 text-white cursor-pointer';
                tabWoo.className = 'flex-1 py-4 text-center font-bold text-xs md:text-base text-slate-400 hover:text-white flex items-center justify-center gap-2 cursor-pointer';
                formPhone.classList.remove('hidden');
                formWoo.classList.add('hidden');
            } else {
                tabPhone.className = 'flex-1 py-4 text-center font-bold text-xs md:text-base text-slate-400 hover:text-white flex items-center justify-center gap-2 cursor-pointer';
                tabWoo.className = 'flex-1 py-4 text-center font-black text-sm md:text-base bg-slate-900 flex items-center justify-center gap-2 text-white cursor-pointer';
                formPhone.classList.add('hidden');
                formWoo.classList.remove('hidden');
            }
            recalculatePrice();
        }

        function recalculatePrice() {
            const isPhoneTab = !document.getElementById('form-phone').classList.contains('hidden');
            let courierCharge = 0;

            if (isPhoneTab) {
                const zone = document.getElementById('p_district').value;
                // If package is pkg_2 or pkg_3, delivery is FREE (0)
                if (currentPackage.id === 'pkg_2' || currentPackage.id === 'pkg_3') {
                    courierCharge = 0;
                } else {
                    courierCharge = zone === 'Dhaka' ? 60 : 120;
                }

                const total = currentPackage.price + courierCharge;

                document.getElementById('p_subtotal_text').innerText = '৳' + currentPackage.price;
                document.getElementById('p_shipping_text').innerText = courierCharge === 0 ? 'ফ্রি (৳০)' : '৳' + courierCharge;
                document.getElementById('p_grand_total').innerText = '৳' + total;
            } else {
                const zone = document.getElementById('w_shipping').value;
                if (currentPackage.id === 'pkg_2' || currentPackage.id === 'pkg_3') {
                    courierCharge = 0;
                } else {
                    courierCharge = zone === 'inside_dhaka' ? 60 : 120;
                }

                const total = currentPackage.price + courierCharge;

                document.getElementById('w_subtotal_text').innerText = '৳' + currentPackage.price;
                document.getElementById('w_shipping_text').innerText = courierCharge === 0 ? 'Free (৳0)' : '৳' + courierCharge;
                document.getElementById('w_grand_total').innerText = '৳' + total;
            }
        }

        // Handle AJAX form posts simulation
        function sendLeadToAPI(payload) {
            console.log("dispatching payload to REST handler...", payload);
            
            // Broadcast event which is caught by our simulated WP and WooCommerce database
            const event = new CustomEvent('landing_page_order_submitted', { detail: payload });
            window.dispatchEvent(event);
        }

        function submitPhoneOrder(e) {
            e.preventDefault();
            const name = document.getElementById('p_name').value.trim();
            const phone = document.getElementById('p_phone').value.trim();
            const address = document.getElementById('p_addr').value.trim();
            const district = document.getElementById('p_district').value;
            
            // Validation
            if (!name || !phone || !address) {
                alert('দয়া করে সব ঘর সঠিকভাবে পূরণ করুন!');
                return;
            }

            let courierCharge = (currentPackage.id === 'pkg_2' || currentPackage.id === 'pkg_3') ? 0 : (district === 'Dhaka' ? 60 : 120);
            const grand = currentPackage.price + courierCharge;
            const distText = district === 'Dhaka' ? 'ঢাকা সিটি' : 'ঢাকার বাইরে';

            const payload = {
                id: 'LP-phone-' + Math.floor(100000 + Math.random() * 900000),
                customerName: name,
                phoneNumber: phone,
                address: address + ' (' + distText + ')',
                selectedOffer: currentPackage.name,
                price: grand,
                channel: 'Phone Order',
                createdAt: new Date().toISOString()
            };

            sendLeadToAPI(payload);

            const invoiceHTML = '<div class="text-center font-black pb-2 border-b border-indigo-200 mb-3 text-indigo-950 text-sm uppercase">Phone Call Invoice</div>' +
                '<p class="mb-1 text-slate-700"><strong>Order ID:</strong> <span class="font-bold text-indigo-650">CALL-' + Math.floor(100000 + Math.random() * 900000) + '</span></p>' +
                '<p class="mb-1 text-slate-700"><strong>Customer:</strong> ' + name + '</p>' +
                '<p class="mb-1 text-slate-700"><strong>Mobile:</strong> ' + phone + '</p>' +
                '<p class="mb-1 text-slate-705"><strong>Shipping Spot:</strong> ' + address + ' (' + distText + ')</p>' +
                '<p class="mb-1 text-slate-700"><strong>Offer Selections:</strong> ' + currentPackage.name + '</p>' +
                '<div class="border-t border-dashed border-slate-300 pt-2.5 mt-2.5 flex justify-between font-black text-indigo-600 text-sm">' +
                    '<span>Amount Due (ক্যাশ অন ডেলিভারি):</span>' +
                    '<span>৳' + grand + '</span>' +
                '</div>';

            showSuccess(invoiceHTML);
        }

        function submitWooOrder(e) {
            e.preventDefault();
            const name = document.getElementById('w_name').value.trim();
            const phone = document.getElementById('w_phone').value.trim();
            const address = document.getElementById('w_addr').value.trim();
            const shippingZone = document.getElementById('w_shipping').value;
            const paymentMethodEl = document.querySelector('input[name="payment_method"]:checked');
            const payMethod = paymentMethodEl ? paymentMethodEl.value : 'cod';

            if (!name || !phone || !address) {
                alert('Please complete all billing input fields!');
                return;
            }

            let courierCharge = (currentPackage.id === 'pkg_2' || currentPackage.id === 'pkg_3') ? 0 : (shippingZone === 'inside_dhaka' ? 60 : 120);
            const grand = currentPackage.price + courierCharge;
            
            const areaText = shippingZone === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka';
            const payText = payMethod === 'cod' ? 'Cash on Delivery (COD)' : 'bKash Mobile Wallet (Simulated)';

            const payload = {
                id: 'LP-Woo-' + Math.floor(100000 + Math.random() * 900000),
                customerName: name,
                phoneNumber: phone,
                address: address + ' (' + areaText + ')',
                selectedOffer: currentPackage.name,
                price: grand,
                channel: 'WooCommerce Store (' + payText + ')',
                createdAt: new Date().toISOString()
            };

            sendLeadToAPI(payload);

            const invoiceHTML = '<div class="text-center font-black pb-2 border-b border-slate-200 mb-3 text-slate-900 text-sm uppercase">WooCommerce Receipt</div>' +
                '<p class="mb-1 text-slate-700"><strong>Invoice Ref:</strong> <span class="font-bold text-indigo-600">WC-' + Math.floor(100000 + Math.random() * 900000) + '</span></p>' +
                '<p class="mb-1 text-slate-700"><strong>Customer Name:</strong> ' + name + '</p>' +
                '<p class="mb-1 text-slate-700"><strong>Billing Phone:</strong> ' + phone + '</p>' +
                '<p class="mb-1 text-slate-700"><strong>Area / Address:</strong> ' + address + ', ' + areaText + '</p>' +
                '<p class="mb-1 text-slate-700"><strong>Cart Items:</strong> ' + currentPackage.name + '</p>' +
                '<p class="mb-2 text-slate-705"><strong>Selected Gateway:</strong> ' + payText + '</p>' +
                '<div class="border-t border-dashed border-slate-300 pt-2.5 mt-2.5 flex justify-between font-black text-indigo-600 text-sm">' +
                    '<span>Invoice Amount Total:</span>' +
                    '<span>৳' + grand + '</span>' +
                '</div>';

            showSuccess(invoiceHTML);
        }

        function showSuccess(invoiceHtml) {
            document.getElementById('form-phone').classList.add('hidden');
            document.getElementById('form-woo').classList.add('hidden');
            const successEl = document.getElementById('success-message');
            const invoiceDetailsEl = document.getElementById('invoice-details');
            
            invoiceDetailsEl.innerHTML = invoiceHtml;
            successEl.classList.remove('hidden');
            
            // Auto scroll to checkout for success notification
            document.getElementById('checkout-section').scrollIntoView({ behavior: 'smooth' });
        }

        function resetForms() {
            document.getElementById('success-message').classList.add('hidden');
            document.getElementById('p_name').value = '';
            document.getElementById('p_phone').value = '';
            document.getElementById('p_addr').value = '';
            document.getElementById('w_name').value = '';
            document.getElementById('w_phone').value = '';
            document.getElementById('w_addr').value = '';
            
            switchTab('phone');
        }

        // Initialize default view
        recalculatePrice();
    </script>
</body>
</html>`;
