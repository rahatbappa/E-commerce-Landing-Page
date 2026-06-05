import React, { useState, useEffect } from 'react';
import { 
  FolderLock, HardDriveDownload, Sparkles, ShieldCheck, 
  Settings, Layers, Plus, Trash2, CheckCircle2, AlertTriangle, 
  ArrowRight, Landmark, Smartphone, ShoppingBag, Terminal, Check, Users, HelpCircle,
  Truck, RefreshCw, Send, Activity, ClipboardCopy, FileText, Image, Globe, Key, Download
} from 'lucide-react';
import JSZip from 'jszip';
import { LeadOrder } from '../types';
import { rawHtmlCode } from './rawHtml';
import { motion, AnimatePresence } from 'motion/react';
import Ticker from './Ticker';
import CheckoutForm from './CheckoutForm';
import HtmlExport from './HtmlExport';
import IMG_FRONT from '../assets/images/solar_light_front_1780501714601.png';
import IMG_BACK from '../assets/images/solar_light_back_1780501730841.png';
import IMG_USE from '../assets/images/camping_light_use_1780501749430.png';
import { ProductOffer } from '../types';

interface WPProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  landingPageUrl: string;
}

interface WordPressPluginProps {
  orders: LeadOrder[];
  onUpdateStatus: (id: string, status: LeadOrder['status']) => void;
  onAddOrder: (order: LeadOrder) => void;
}

export default function WordPressPlugin({ orders, onUpdateStatus, onAddOrder }: WordPressPluginProps) {
  // Subscription plans setting 
  const plans = [
    { 
      id: 'plan_starter', 
      name: 'Starter Plan', 
      price: 178, 
      desc: '২টি প্রোডাক্ট এবং ল্যান্ডিং পেজ কাস্টম সোর্স', 
      productLimit: 2, 
      landingPageLimit: 2,
      badge: 'সাশ্রয়ী ডিল'
    },
    { 
      id: 'plan_growth', 
      name: 'Growth Plan', 
      price: 299, 
      desc: '৫টি প্রোডাক্ট এবং ৫টি ল্যান্ডিং পেজ কাস্টম সোর্স', 
      productLimit: 5, 
      landingPageLimit: 5,
      badge: 'বেস্ট সেলার'
    },
    { 
      id: 'plan_business', 
      name: 'Business Plan', 
      price: 399, 
      desc: '১০টি প্রোডাক্ট এবং ১০টি ল্যান্ডিং পেজ কাস্টম সোর্স', 
      productLimit: 10, 
      landingPageLimit: 10,
      badge: 'মেগা ভ্যালু'
    }
  ];

  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan_growth');
  const activePlan = plans.find(p => p.id === selectedPlanId) || plans[1];

  // WordPress Simulator Products State
  const [wpProducts, setWpProducts] = useState<WPProduct[]>([
    { 
      id: '1', 
      name: '4-LED Solar Super-Bright Searchlight', 
      sku: 'SL-LAMP-STAND', 
      price: 1490, 
      landingPageUrl: '/lander/solar-light-01' 
    },
    { 
      id: '2', 
      name: 'Heavy Duty 5000mAh Solar Power Bank Box', 
      sku: 'SL-LAMP-JUMBO', 
      price: 2690, 
      landingPageUrl: '/lander/solar-powerbox' 
    },
    { 
      id: '3', 
      name: 'High Intensity Tactical Solar Tent Lantern', 
      sku: 'SL-LAMP-MEGA', 
      price: 3850, 
      landingPageUrl: '/lander/tactical-lantern' 
    }
  ]);

  // Product Creator State
  const [newProdName, setNewProdName] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(1490);
  const [newProdUrl, setNewProdUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Landing page simulator states
  const [simName, setSimName] = useState('মোঃ সাইদুর রহমান');
  const [simPhone, setSimPhone] = useState('01712457891');
  const [simAddress, setSimAddress] = useState('বাসা-৪, রোড-৩, সেক্টর-১০, উত্তরা');
  const [simDistrict, setSimDistrict] = useState('Dhaka');
  const [simOffer, setSimOffer] = useState('pkg_2'); // matches offers
  const [simulatingLanderPost, setSimulatingLanderPost] = useState(false);

  // Courier integration states
  const [courierBrand, setCourierBrand] = useState<'pathao' | 'steadfast'>('pathao');
  
  // Pathao API settings
  const [pathaoClientId, setPathaoClientId] = useState('pathao_cli_9901452');
  const [pathaoClientSecret, setPathaoClientSecret] = useState('pathao_sec_884102x9a9');
  const [pathaoStoreId, setPathaoStoreId] = useState('14925');
  const [pathaoMode, setPathaoMode] = useState<'sandbox' | 'production'>('sandbox');
  const [pathaoConnected, setPathaoConnected] = useState(false);

  // Steadfast API settings
  const [steadfastApiKey, setSteadfastApiKey] = useState('sf_key_2026_94a021b3c4d5e6');
  const [steadfastSecretKey, setSteadfastSecretKey] = useState('sf_sec_f7d8e9c0b1a2');
  const [steadfastMode, setSteadfastMode] = useState<'sandbox' | 'production'>('sandbox');
  const [steadfastConnected, setSteadfastConnected] = useState(false);

  // Courier booking details
  const [selectedBookingOrderId, setSelectedBookingOrderId] = useState<string>('');
  const [courierServiceType, setCourierServiceType] = useState<string>('normal'); // 'normal', 'same_day', 'next_day'
  const [parcelWeight, setParcelWeight] = useState<number>(0.5); // kg
  
  // API JSON Console display
  const [apiConsoleRequest, setApiConsoleRequest] = useState<string>('');
  const [apiConsoleResponse, setApiConsoleResponse] = useState<string>('');
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  // Booked shipments state (loaded from / stored in localStorage)
  const [consignments, setConsignments] = useState<any[]>(() => {
    const saved = localStorage.getItem('phone_funnel_consignments');
    if (saved) {
      try { return JSON.parse(saved); } catch(_) {}
    }
    return [
      {
        orderId: 'WP-lead-704125',
        consignmentId: 'PT-9015822-DH',
        courier: 'Pathao',
        serviceType: 'Normal Delivery',
        weight: '0.5 kg',
        fee: 60,
        status: 'In Transit',
        bookedAt: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        orderId: 'WC-401589',
        consignmentId: 'SF-CODH-1894251',
        courier: 'Steadfast',
        serviceType: 'Standard COD',
        weight: '1.2 kg',
        fee: 120,
        status: 'Delivered',
        bookedAt: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ];
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('phone_funnel_consignments', JSON.stringify(consignments));
  }, [consignments]);

  // Handle Testing Connections
  const handleTestCourierConnection = (courier: 'pathao' | 'steadfast') => {
    setTestingConnection(true);
    setApiConsoleRequest('');
    setApiConsoleResponse('');
    setConsoleOpen(true);
    
    let mockReq = {};
    let mockRes = {};
    if (courier === 'pathao') {
      mockReq = {
        client_id: pathaoClientId,
        client_secret: pathaoClientSecret,
        grant_type: "client_credentials"
      };
      mockRes = {
        code: 200,
        status: "success",
        message: "Authentication Token Issued successfully",
        data: {
          token_type: "Bearer",
          expires_in: 31536000,
          access_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImIzMDdkMm..."
        }
      };
    } else {
      mockReq = {
        "api-key": steadfastApiKey,
        "secret-key": steadfastSecretKey
      };
      mockRes = {
        status: 200,
        message: "Credentials validated successfully. API Access Authorized.",
        sender_details: {
          store_name: "Premium Solar Bangladesh",
          sender_phone: "01800000000",
          address: "Dhaka Hub, BD"
        }
      };
    }

    setApiConsoleRequest(JSON.stringify(mockReq, null, 2));

    setTimeout(() => {
      setTestingConnection(false);
      setApiConsoleResponse(JSON.stringify(mockRes, null, 2));
      if (courier === 'pathao') {
        setPathaoConnected(true);
      } else {
        setSteadfastConnected(true);
      }
      setSuccessMsg(`${courier === 'pathao' ? 'Pathao' : 'Steadfast'} Courier API Credentials checked & connected successfully in ${courier === 'pathao' ? pathaoMode : steadfastMode} environment!`);
    }, 1200);
  };

  // Handle Shipping Booking Dispatches
  const handleDispatchCourier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingOrderId) {
      setErrorMsg('বুকিং করার জন্য দয়া করে একটি অর্ডার সিলেক্ট করুন!');
      return;
    }

    const targetOrder = orders.find(o => o.id === selectedBookingOrderId);
    if (!targetOrder) {
      setErrorMsg('অর্ডারটি ডাটাবেজে পাওয়া যায়নি!');
      return;
    }

    setBookingInProgress(true);
    setApiConsoleRequest('');
    setApiConsoleResponse('');
    setConsoleOpen(true);

    const isPathao = courierBrand === 'pathao';
    const trackingCode = isPathao 
      ? `PT-${Math.floor(1000000 + Math.random() * 9000000)}-DH`
      : `SF-CODH-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const bookingFee = targetOrder.district.toLowerCase() === 'dhaka' ? 60 : 120;

    let requestBody = {};
    let responseBody = {};

    if (isPathao) {
      requestBody = {
        store_id: Number(pathaoStoreId),
        sender_name: "Premium Solar BD",
        sender_phone: "01800000000",
        recipient_name: targetOrder.customerName,
        recipient_phone: targetOrder.phoneNumber,
        recipient_address: targetOrder.address,
        recipient_city: targetOrder.district,
        item_type: "parcel",
        delivery_type: courierServiceType === 'same_day' ? 1 : 2, 
        item_quantity: targetOrder.itemsQuantity,
        item_weight: parcelWeight,
        amount_to_collect: targetOrder.total,
        order_description: targetOrder.offerName
      };

      responseBody = {
        code: 200,
        status: "success",
        message: "Consignment created successfully",
        data: {
          consignment_id: trackingCode,
          delivery_fee: bookingFee,
          cod_charge: 0,
          total_charge: bookingFee,
          tracking_url: `https://pathao.com/courier/tracking?cons_id=${trackingCode}`
        }
      };
    } else {
      requestBody = {
        invoice: targetOrder.id,
        recipient_name: targetOrder.customerName,
        recipient_phone: targetOrder.phoneNumber,
        recipient_address: targetOrder.address,
        cod_amount: targetOrder.total,
        note: targetOrder.offerName
      };

      responseBody = {
        status: 200,
        message: "Order placed successfully",
        consignment: {
          consignment_id: trackingCode,
          tracking_code: trackingCode,
          cod_amount: targetOrder.total,
          delivery_charge: bookingFee,
          tracking_url: `https://steadfast.com.bd/tracking/${trackingCode}`
        }
      };
    }

    setApiConsoleRequest(JSON.stringify(requestBody, null, 2));

    setTimeout(() => {
      setBookingInProgress(false);
      setApiConsoleResponse(JSON.stringify(responseBody, null, 2));

      const newConsignment = {
        orderId: targetOrder.id,
        consignmentId: trackingCode,
        courier: isPathao ? 'Pathao' : 'Steadfast',
        serviceType: isPathao 
          ? (courierServiceType === 'same_day' ? 'Same Day Delivery' : 'Normal Delivery')
          : 'Standard COD',
        weight: `${parcelWeight} kg`,
        fee: bookingFee,
        status: 'Dispatched',
        bookedAt: new Date().toISOString()
      };

      setConsignments([newConsignment, ...consignments]);
      onUpdateStatus(targetOrder.id, 'Shipped');

      setSuccessMsg(`[Courier API 200 OK] অর্ডার নং ${targetOrder.id} সফলভাবে ${isPathao ? 'Pathao' : 'Steadfast'} কুরিয়ার বুকিংয়ে পাঠানো হয়েছে! Track ID: ${trackingCode}`);
      setSelectedBookingOrderId(''); 
    }, 1500);
  };

  // Change consignment status simulation
  const handleChangeConsignmentStatus = (consRef: string, newStatus: string) => {
    setConsignments(consignments.map(c => {
      if (c.consignmentId === consRef) {
        return { ...c, status: newStatus };
      }
      return c;
    }));
    setSuccessMsg(`কুরিয়ার ট্র্যাকিং স্ট্যাটাস [${consRef}] সফলভাবে ${newStatus} এ আপডেট হয়েছে এবং উকমার্স Webhook সিঙ্ক সম্পন্ন হয়েছে!`);
  };

  // Tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'courier' | 'plans' | 'landers' | 'posts' | 'media' | 'live_preview' | 'raw_export'>('dashboard');
  const [zipping, setZipping] = useState(false);
  const [zipDownloadUrl, setZipDownloadUrl] = useState<string | null>(null);

  // Consumer Lander Preview States
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<'front' | 'back' | 'use'>('front');
  const [selectedOfferId, setSelectedOfferId] = useState<string>('pkg_2');
  const [isZoomedModalOpen, setIsZoomedModalOpen] = useState(false);

  // Consumer Offers State synchronized with product listings
  const offers: ProductOffer[] = [
    {
      id: 'pkg_1',
      name: '১টি সোলার এমার্জেন্সি লাইট (Standard Deal)',
      price: 1490,
      originalPrice: 2500,
      description: '১টি মাল্টি-ডিইউটি সোলার লাইট, চার্জার ক্যাবল এবং ৫ বছরের সম্পূর্ণ সার্ভিস ওয়ারেন্টি সাপোর্ট।',
      badge: '৪০% ছাড়',
      quantity: 1
    },
    {
      id: 'pkg_2',
      name: '২টি ফ্যামিলি জ্যাম্বো ক্যাম্পিং ডিল (Best Selling)',
      price: 2690,
      originalPrice: 5000,
      description: '২টি প্রিমিয়াম সোলার লাইট, চার্জার ক্যাবল, ফ্রি হোম কুরিয়ার ডেলিভারি ও ৫ বছরের ওয়ারেন্টি সাপোর্ট।',
      badge: '৪৮% ছাড় + ফ্রি শিপিং',
      quantity: 2
    },
    {
      id: 'pkg_3',
      name: '৩টি মেগা ট্র্যাভেলার ব্যাকআপ ডিল (Mega Value)',
      price: 3850,
      originalPrice: 7500,
      description: '৩টি এমার্জেন্সি লাইট, ফ্রি এক্সপ্রেস কুরিয়ার, ৫ বছরের ওয়ারেন্টি ও ১টি আকর্ষণীয় পকেট মেটাল মাল্টি-টুলকার্ড গিফট!',
      badge: '৫০% ছাড় + ফ্রি শিপিং + গিফট',
      quantity: 3
    }
  ];

  const activeOffer = offers.find(o => o.id === selectedOfferId) || offers[1];

  // Live Sync toggle
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);

  // WordPress Simulator Posts State
  const [wpPosts, setWpPosts] = useState([
    { id: '1', title: 'কীভাবে ১-ক্লিক মোবাইল চেকআউট পেজ আপনার বিক্রি দ্বিগুণ করবে', author: 'rahatbappa', date: '2026-06-03', category: 'E-Commerce Tips', status: 'Published' },
    { id: '2', title: 'গ্রীষ্মকালে সোলার এলইডি ক্যাম্পিং লাইটের তুমুল চাহিদা ও মার্কেটিং স্ট্র্যাটেজি', author: 'admin', date: '2026-06-02', category: 'Marketing Guides', status: 'Published' },
    { id: '3', title: 'WooCommerce ডাটাবেজ সিঙ্ক সেটআপ ও ট্রাবলশুটিং গাইডলাইন', author: 'developer', date: '2026-05-28', category: 'Technical Docs', status: 'Draft' }
  ]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('E-Commerce Tips');
  const [newPostContent, setNewPostContent] = useState('');

  // WordPress Simulator Media State
  const [wpMedia, setWpMedia] = useState([
    { id: 'm1', name: 'solar_light_front.png', type: 'image/png', size: '428 KB', date: '2026-06-03' },
    { id: 'm2', name: 'solar_light_back.png', type: 'image/png', size: '385 KB', date: '2026-06-03' },
    { id: 'm3', name: 'camping_light_use.png', type: 'image/png', size: '790 KB', date: '2026-06-02' }
  ]);
  const [newMediaName, setNewMediaName] = useState('');
  const [newMediaSize, setNewMediaSize] = useState('150 KB');

  // Custom Landers builder based on subscription plan!
  const [wpLanders, setWpLanders] = useState([
    { id: 'l1', name: '4-LED Solar Searchlight Primary Lander', productSku: 'SL-LAMP-STAND', slug: 'solar-led-pro', themeOverride: 'page-solar-pro.php', active: true },
    { id: 'l2', name: 'Tactical Heavy Duty Lantern Page', productSku: 'SL-LAMP-JUMBO', slug: 'camping-jumbo', themeOverride: 'page-solar-pro.php', active: true }
  ]);
  const [newLanderName, setNewLanderName] = useState('');
  const [newLanderSlug, setNewLanderSlug] = useState('');
  const [newLanderProductSku, setNewLanderProductSku] = useState('SL-LAMP-STAND');

  // License Key Management
  const [licenseKey, setLicenseKey] = useState('PP-GROWTH-2026-KEYS-982A');
  const [licenseKeyInput, setLicenseKeyInput] = useState('');
  const [licenseVerificationLogs, setLicenseVerificationLogs] = useState<string[]>([
    'System: Local SSL active Key signature matched.',
    'System: Product synchronization limits verified with SaaS endpoint.'
  ]);

  // Add Product to simulation
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!newProdName || !newProdSku) {
      setErrorMsg('Product Name and SKU are required!');
      return;
    }

    // Check plan limits
    if (wpProducts.length >= activePlan.productLimit) {
      setErrorMsg(`সীমা অতিক্রম হয়েছে! আপনার বর্তমান ${activePlan.name} এ সর্বোচ্চ ${activePlan.productLimit}টি প্রোডাক্ট অ্যাড করা সম্ভব। দয়া করে ড্যাশবোর্ড থেকে প্ল্যান আপডেট করুন।`);
      return;
    }

    const newProd: WPProduct = {
      id: Math.random().toString(),
      name: newProdName,
      sku: newProdSku.toUpperCase().trim(),
      price: Number(newProdPrice),
      landingPageUrl: newProdUrl || `/lander/${newProdSku.toLowerCase().trim() || 'product'}`
    };

    setWpProducts([...wpProducts, newProd]);
    setSuccessMsg('Product added successfully to WordPress database!');
    setNewProdName('');
    setNewProdSku('');
    setNewProdPrice(1490);
    setNewProdUrl('');
  };

  // Delete product from simulation
  const handleDeleteProduct = (id: string) => {
    setWpProducts(wpProducts.filter(p => p.id !== id));
    setSuccessMsg('Product removed successfully from WordPress panel.');
  };

  // Simulate REST API POST request from Landing page
  const handleSimulateLanderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simName || !simPhone || !simAddress) {
      setErrorMsg('নাম, মোবাইল নাম্বার এবং ঠিকানা আবশ্যক!');
      return;
    }
    
    setSimulatingLanderPost(true);
    setSuccessMsg('');
    setErrorMsg('');

    // Simulate REST API latency of 800ms
    setTimeout(() => {
      const selectedOfferObj = simOffer === 'pkg_1' 
        ? { name: '১টি সোলার এমার্জেন্সি লাইট (Standard Deal)', price: 1490 }
        : simOffer === 'pkg_3'
          ? { name: '৩টি মেগা ট্র্যাভেলার ব্যাকআপ ডিল (Mega Value)', price: 3850 }
          : { name: '২টি ফ্যামিলি জ্যাম্বো ক্যাম্পিং ডিল (Best Selling)', price: 2690 };

      const randId = "WP-lead-" + Math.floor(100000 + Math.random() * 900000);
      const testLead: LeadOrder = {
        id: randId,
        customerName: simName.trim(),
        phoneNumber: simPhone.trim(),
        address: simAddress.trim(),
        district: simDistrict,
        offerName: selectedOfferObj.name,
        itemsQuantity: simOffer === 'pkg_1' ? 1 : simOffer === 'pkg_3' ? 3 : 2,
        subtotal: selectedOfferObj.price,
        shippingCost: 0,
        discount: 0,
        total: selectedOfferObj.price,
        checkoutType: 'phone_1click',
        paymentMethod: "Cash On Delivery (ক্যাশ অন ডেলিভারি)",
        status: 'Pending Verification',
        createdAt: new Date().toISOString()
      };

      onAddOrder(testLead);
      setSuccessMsg(`[REST API v1] ১-ক্লিক অর্ডার সফলভাবে ওয়ার্ডপ্রেস ও উকমার্স ডাটাবেজে সিঙ্ক হয়েছে! Order Code: ${randId}`);
      setSimulatingLanderPost(false);
      
      // Clear simulation form inputs
      setSimName('মোঃ সাইদুর রহমান');
      setSimPhone('01712457891');
    }, 850);
  };

  // Generate real WordPress Plugin Zip
  const generatePluginZip = async () => {
    setZipping(true);
    try {
      const zip = new JSZip();
      
      // 1. phone-funnel-pro.php main plugin script
      const phpContent = `<?php
/**
 * Plugin Name: Phone Funnel Leads & Product Manager Pro
 * Plugin URI: https://yourfunnels.com/phone-funnel
 * Description: Real-time leads logging system for Phone checkout and WooCommerce. Enforces subscriptions and multi-landing page generation (Plans: 178 BDT, 299 BDT, 399 BDT limiters).
 * Version: 1.0.0
 * Author: Phone Funnels Pro Team
 * Author URI: https://yourfunnels.com
 * License: GPL2
 * Text Domain: phone-funnel-pro
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

global $phone_funnel_db_version;
$phone_funnel_db_version = '1.0.0';

/**
 * Register custom DB table and initial default settings on activation
 */
function phone_funnel_pro_activate() {
    global $wpdb;
    global $phone_funnel_db_version;
    
    $table_name = $wpdb->prefix . 'phone_funnel_leads';
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        order_ref varchar(50) NOT NULL,
        customer_name varchar(100) NOT NULL,
        phone_number varchar(20) NOT NULL,
        address text NOT NULL,
        district varchar(50) NOT NULL,
        offer_name varchar(250) NOT NULL,
        total_price decimal(10,2) NOT NULL,
        checkout_type varchar(30) DEFAULT 'phone_1click' NOT NULL,
        status varchar(30) DEFAULT 'Pending' NOT NULL,
        created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
        PRIMARY KEY  (id),
        UNIQUE KEY order_ref (order_ref)
    ) $charset_collate;";

    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta( $sql );

    add_option( 'phone_funnel_db_version', $phone_funnel_db_version );
    
    // Set default demo subscription setup
    add_option( 'phone_funnel_subscription_plan', '${selectedPlanId}' );
    add_option( 'phone_funnel_products_limit', ${activePlan.productLimit} );

    // Default products if empty
    if ( ! get_option('phone_funnel_products') ) {
        $default_products = array(
            array(
                'id' => 'prod_1',
                'name' => '১টি সোলার এমার্জেন্সি লাইট (Standard Deal)',
                'price' => 1490,
                'original_price' => 2500,
                'sku' => 'SL-101',
                'badge' => '৪০% ছাড়',
                'status' => 'In Stock'
            ),
            array(
                'id' => 'prod_2',
                'name' => '২টি ফ্যামিলি জ্যাম্বো ক্যাম্পিং ডিল (Best Selling)',
                'price' => 2690,
                'original_price' => 5000,
                'sku' => 'SL-102',
                'badge' => '৪৮% ছাড় + ফ্রি শিপিং',
                'status' => 'In Stock'
            ),
            array(
                'id' => 'prod_3',
                'name' => '৩টি মেগা ট্র্যাভেলার ব্যাকআপ ডিল (Mega Value)',
                'price' => 3850,
                'original_price' => 7500,
                'sku' => 'SL-103',
                'badge' => '৫০% ছাড় + ফ্রি শিপিং + গিফট',
                'status' => 'In Stock'
            )
        );
        add_option('phone_funnel_products', json_encode($default_products));
    }

    // Default landers if empty
    if ( ! get_option('phone_funnel_landers') ) {
        $default_landers = array(
            array(
                'id' => 'land_1',
                'name' => 'Solar Emergency Light Campaign',
                'slug' => '/solar-led-pro',
                'template' => 'Space Grotesk Modern',
                'views' => 1450,
                'orders' => 45,
                'status' => 'Active'
            ),
            array(
                'id' => 'land_2',
                'name' => 'Camper Clearance Deal Page',
                'slug' => '/outdoor-adventure',
                'template' => 'Rustic Eco Theme',
                'views' => 890,
                'orders' => 21,
                'status' => 'Active'
            )
        );
        add_option('phone_funnel_landers', json_encode($default_landers));
    }
}
register_activation_hook( __FILE__, 'phone_funnel_pro_activate' );

/**
 * REST API Endpoint to accept incoming leads from Landing Pages
 */
add_action( 'rest_api_init', function () {
    register_rest_route( 'phone-funnel/v1', '/lead', array(
        'methods' => 'POST',
        'callback' => 'phone_funnel_pro_handle_api_lead',
        'permission_callback' => '__return_true'
    ));
});

function phone_funnel_pro_handle_api_lead( WP_REST_Request $request ) {
    global $wpdb;
    $params = $request->get_json_params();

    if ( empty($params['customer_name']) || empty($params['phone_number']) || empty($params['address']) ) {
        return new WP_REST_Response( array('success' => false, 'message' => 'Missing customer data (Name/Phone/Address)'), 400 );
    }

    $table_name = $wpdb->prefix . 'phone_funnel_leads';
    $order_ref = 'SL-' . rand(100000, 999999);
    
    $insert_data = array(
        'order_ref'     => $order_ref,
        'customer_name' => sanitize_text_field($params['customer_name']),
        'phone_number'  => sanitize_text_field($params['phone_number']),
        'address'       => sanitize_textarea_field($params['address']),
        'district'      => sanitize_text_field($params['district'] ?? 'Dhaka'),
        'offer_name'    => sanitize_text_field($params['offer_name'] ?? '1x Emergency Light'),
        'total_price'   => floatval($params['total_price'] ?? 1490),
        'checkout_type' => sanitize_text_field($params['checkout_type'] ?? 'phone_1click'),
        'status'        => 'Pending Verification'
    );

    $inserted = $wpdb->insert( $table_name, $insert_data );

    if ( $inserted ) {
        return new WP_REST_Response( array(
            'success' => true, 
            'order_id' => $order_ref, 
            'message' => 'Lead uploaded successfully to WordPress!'
        ), 200 );
    }

    return new WP_REST_Response( array('success' => false, 'message' => 'Database write failure'), 500 );
}

/**
 * Register Admin Menus
 */
add_action( 'admin_menu', 'phone_funnel_pro_menus' );

function phone_funnel_pro_menus() {
    add_menu_page(
        'Phone Funnels Pro',
        'Phone Funnels Pro',
        'manage_options',
        'phone-funnel-pro',
        'phone_funnel_pro_dashboard_html',
        'dashicons-phone',
        25
    );
}

function phone_funnel_pro_dashboard_html() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'phone_funnel_leads';
    
    // POST request processing
    if ( isset($_POST['save_ff_settings']) ) {
        $selected_plan = sanitize_text_field($_POST['ff_plan'] ?? 'plan_starter');
        update_option('phone_funnel_subscription_plan', $selected_plan);
        $limit = $selected_plan === 'plan_starter' ? 2 : ($selected_plan === 'plan_growth' ? 5 : 10);
        update_option('phone_funnel_products_limit', $limit);
        echo '<div class="notice notice-success is-dismissible"><p>✅ Subscription key activated successfully inside WordPress! Unlimited Sync enabled.</p></div>';
    }

    if ( isset($_POST['save_courier_settings']) ) {
        update_option('ff_pathao_store', sanitize_text_field($_POST['ff_pathao_store']));
        update_option('ff_steadfast_key', sanitize_text_field($_POST['ff_steadfast_key']));
        echo '<div class="notice notice-success is-dismissible"><p>✅ Courier API integrations credentials updated.</p></div>';
    }

    if ( isset($_POST['add_product_action']) ) {
        $prod_name = sanitize_text_field($_POST['prod_name']);
        $prod_price = floatval($_POST['prod_price']);
        $prod_orig = floatval($_POST['prod_original_price']);
        $prod_sku = sanitize_text_field($_POST['prod_sku']);
        $prod_badge = sanitize_text_field($_POST['prod_badge']);
        
        $current_products = json_decode(get_option('phone_funnel_products', '[]'), true);
        $current_products[] = array(
            'id' => 'prod_' . time(),
            'name' => $prod_name,
            'price' => $prod_price,
            'original_price' => $prod_orig,
            'sku' => $prod_sku,
            'badge' => $prod_badge,
            'status' => 'In Stock'
        );
        update_option('phone_funnel_products', json_encode($current_products));
        echo '<div class="notice notice-success is-dismissible"><p>✅ Product Added: ' . esc_html($prod_name) . '</p></div>';
    }

    if ( isset($_POST['delete_product_action']) ) {
        $prod_id = sanitize_text_field($_POST['prod_id']);
        $current_products = json_decode(get_option('phone_funnel_products', '[]'), true);
        $filtered = array_filter($current_products, function($p) use ($prod_id) {
            return $p['id'] !== $prod_id;
        });
        update_option('phone_funnel_products', json_encode(array_values($filtered)));
        echo '<div class="notice notice-success is-dismissible"><p>🗑️ Product deleted from options array.</p></div>';
    }

    if ( isset($_POST['add_lander_action']) ) {
        $l_name = sanitize_text_field($_POST['lander_name']);
        $l_slug = sanitize_text_field($_POST['lander_slug']);
        $l_temp = sanitize_text_field($_POST['lander_temp']);
        
        $current_landers = json_decode(get_option('phone_funnel_landers', '[]'), true);
        $current_landers[] = array(
            'id' => 'land_' . time(),
            'name' => $l_name,
            'slug' => $l_slug,
            'template' => $l_temp,
            'views' => 120,
            'orders' => 4,
            'status' => 'Active'
        );
        update_option('phone_funnel_landers', json_encode($current_landers));
        echo '<div class="notice notice-success is-dismissible"><p>✅ Landing Campaign Route configured: ' . esc_html($l_slug) . '</p></div>';
    }

    if ( isset($_POST['delete_lander_action']) ) {
        $lander_id = sanitize_text_field($_POST['lander_id']);
        $current_landers = json_decode(get_option('phone_funnel_landers', '[]'), true);
        $filtered = array_filter($current_landers, function($l) use ($lander_id) {
            return $l['id'] !== $lander_id;
        });
        update_option('phone_funnel_landers', json_encode(array_values($filtered)));
        echo '<div class="notice notice-success is-dismissible"><p>🗑️ Landing Page deleted.</p></div>';
    }

    if ( isset($_POST['delete_lead_action']) ) {
        $lead_id = intval($_POST['lead_id']);
        $wpdb->delete($table_name, array('id' => $lead_id));
        echo '<div class="notice notice-success is-dismissible"><p>🗑️ Customer lead removed from live database.</p></div>';
    }

    if ( isset($_POST['update_lead_status_action']) ) {
        $lead_id = intval($_POST['lead_id']);
        $new_status = sanitize_text_field($_POST['new_status']);
        $wpdb->update($table_name, array('status' => $new_status), array('id' => $lead_id));
        echo '<div class="notice notice-success is-dismissible"><p>🔄 Lead booking status successfully synchronized: ' . esc_html($new_status) . '</p></div>';
    }

    $current_plan = get_option('phone_funnel_subscription_plan', '${selectedPlanId}');
    $p_limit = get_option('phone_funnel_products_limit', ${activePlan.productLimit});
    $leads = $wpdb->get_results("SELECT * FROM $table_name ORDER BY created_at DESC LIMIT 50");
    
    // Custom database entities loaded
    $products_list = json_decode(get_option('phone_funnel_products', '[]'), true);
    $landers_list = json_decode(get_option('phone_funnel_landers', '[]'), true);
    
    // Core WP info counts for tab status indicators
    $wPosts_count = wp_count_posts('post')->publish;
    $wpMedia_count = wp_count_posts('attachment')->inherit;
    
    // Calculations
    $total_earnings = 0;
    $verified_leads_count = 0;
    foreach ($leads as $l) {
        $total_earnings += floatval($l->total_price);
        if ($l->status === 'Verified' || $l->status === 'Delivered' || $l->status === 'Verified & Packed') {
            $verified_leads_count++;
        }
    }
    ?>
    
    <!-- Load Tailwind CSS inside WordPress for stunning aesthetic replication -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=Hind+Siliguri:wght@400;600;700&display=swap" rel="stylesheet">
    
    <style>
        .wp-premium-platform {
            font-family: 'Inter', 'Hind Siliguri', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
        }
        /* Override default WordPress styles inside our applet scope to keep layout beautiful */
        .wp-premium-platform a { text-decoration: none !important; }
        .wp-premium-platform button:focus { outline: none !important; box-shadow: none !important; }
    </style>

    <div class="wrap wp-premium-platform max-w-[1400px] mx-auto p-4 md:p-6 bg-slate-50 min-h-screen text-slate-900 rounded-2xl shadow-sm border border-slate-200/60 mt-4 leading-normal">
        
        <!-- Welcome Hub Panel with gorgeous text and layout -->
        <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 text-white rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden mb-6">
            <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10">
                <span class="text-9xl">📞</span>
            </div>
            
            <div class="relative z-10 space-y-4 text-left">
                <div class="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 py-1 px-3.5 rounded-full text-[11px] font-black uppercase tracking-wider">
                    <span>✨ WordPress Integration Hub</span>
                </div>
                
                <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight Bengali-title">
                    স্বাগতম, এডমিন ও ডেভেলাপার হাব-এ!
                </h2>
                
                <p class="text-xs md:text-xs text-slate-300 max-w-3xl leading-relaxed">
                    এখানে আপনি আপনার তৈরি করা ল্যান্ডিং পেইজ থেকে সংগৃহীত অর্ডার বা তথ্য দেখতে পারবেন এবং কুরিয়ার স্ট্যাটাস বুকিং করতে পারবেন। বিদ্যুৎ গতিতে আপনার ই-কমার্স লিডস ও উকমার্স অর্ডার ম্যানেজ করুন।
                </p>
            </div>
            
            <!-- Quick Top-Level Statistics Grid (Four Cards) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <!-- Stat Card 1 -->
                <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-left">
                    <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">সর্বমোট লিড সংখ্যা (Total Leads)</p>
                    <div class="flex items-baseline gap-1 mt-1">
                        <span class="text-2xl font-black text-white"><?php echo count($leads); ?></span>
                        <span class="text-[9px] text-emerald-400">● Live Orders</span>
                    </div>
                </div>
                <!-- Stat Card 2 -->
                <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-left">
                    <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">মোট ভেরিফাইড অর্ডার (Verified)</p>
                    <div class="flex items-baseline gap-1 mt-1">
                        <span class="text-2xl font-black text-white"><?php echo $verified_leads_count; ?></span>
                        <span class="text-[9px] text-indigo-400">Processed</span>
                    </div>
                </div>
                <!-- Stat Card 3 -->
                <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-left">
                    <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">মোট বিক্রয়ের পরিমাণ (Grand Total)</p>
                    <div class="flex items-baseline gap-1 mt-1">
                        <span class="text-2xl font-black text-emerald-400 font-mono">৳<?php echo number_format($total_earnings); ?></span>
                        <span class="text-[9px] text-slate-450">BDT Cashflow</span>
                    </div>
                </div>
                <!-- Stat Card 4 -->
                <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-left">
                    <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">লাইসেন্সিং প্ল্যান (Active Plan)</p>
                    <div class="flex items-baseline gap-1 mt-1">
                        <span class="text-sm font-black text-indigo-300 uppercase">
                            <?php 
                                if($current_plan === 'plan_business' || $current_plan === 'pkg_3') echo 'Business Pro';
                                else if($current_plan === 'plan_growth' || $current_plan === 'pkg_2') echo 'Growth Plan';
                                else echo 'Starter tier';
                            ?>
                        </span>
                        <span class="text-[9px] bg-emerald-500 text-white rounded-full px-1.5 font-bold">ACTIVE</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- MAIN NAVIGATION TAB BAR -->
        <div class="flex border-b border-slate-200 gap-2 overflow-x-auto bg-white p-2 rounded-2xl shadow-sm mb-6 font-sans">
            <button
                id="btn-dashboard"
                onclick="switchTab('dashboard')"
                class="wp-tab-btn px-4 py-3 rounded-xl border-b-2 border-indigo-600 text-indigo-650 bg-indigo-50/20 font-black text-xs md:text-sm whitespace-nowrap cursor-pointer transition-all flex items-center gap-2"
            >
                <span>📊</span>
                <span>ওয়ার্ডপ্রেস এডমিন (পেজ সিমুলেটর)</span>
            </button>
            <button
                id="btn-products"
                onclick="switchTab('products')"
                class="wp-tab-btn px-4 py-3 rounded-xl border-b-2 border-transparent text-slate-550 hover:text-slate-900 font-semibold text-xs md:text-sm whitespace-nowrap cursor-pointer transition-all flex items-center gap-2"
            >
                <span>📦</span>
                <span>ম্যানেজ প্রোডাক্টস (<?php echo count($products_list); ?> / <?php echo $p_limit; ?>)</span>
            </button>
            <button
                id="btn-landers"
                onclick="switchTab('landers')"
                class="wp-tab-btn px-4 py-3 rounded-xl border-b-2 border-transparent text-slate-550 hover:text-slate-900 font-semibold text-xs md:text-sm whitespace-nowrap cursor-pointer transition-all flex items-center gap-2"
            >
                <span>🌐</span>
                <span>ল্যান্ডিং পেজ মেকার (<?php echo count($landers_list); ?>)</span>
            </button>
            <button
                id="btn-posts"
                onclick="switchTab('posts')"
                class="wp-tab-btn px-4 py-3 rounded-xl border-b-2 border-transparent text-slate-550 hover:text-slate-900 font-semibold text-xs md:text-sm whitespace-nowrap cursor-pointer transition-all flex items-center gap-2"
            >
                <span>📝</span>
                <span>ব্লগ ও পোস্টস (<?php echo $wPosts_count; ?>)</span>
            </button>
            <button
                id="btn-media"
                onclick="switchTab('media')"
                class="wp-tab-btn px-4 py-3 rounded-xl border-b-2 border-transparent text-slate-550 hover:text-slate-900 font-semibold text-xs md:text-sm whitespace-nowrap cursor-pointer transition-all flex items-center gap-2"
            >
                <span>🖼️</span>
                <span>মিডিয়া লাইব্রেরি (<?php echo $wpMedia_count; ?>)</span>
            </button>
            <button
                id="btn-courier"
                onclick="switchTab('courier')"
                class="wp-tab-btn px-4 py-3 rounded-xl border-b-2 border-transparent text-slate-550 hover:text-slate-900 font-semibold text-xs md:text-sm whitespace-nowrap cursor-pointer transition-all flex items-center gap-2"
            >
                <span>🚚</span>
                <span>কুরিয়ার বুকিং পোর্টাল</span>
            </button>
            <button
                id="btn-plans"
                onclick="switchTab('plans')"
                class="wp-tab-btn px-4 py-3 rounded-xl border-b-2 border-transparent text-slate-550 hover:text-slate-900 font-semibold text-xs md:text-sm whitespace-nowrap cursor-pointer transition-all flex items-center gap-2"
            >
                <span>💎</span>
                <span>সাবস্ক্রিপশন ও প্লাগইন লাইসেন্স</span>
            </button>
        </div>

        <!-- --------------------------------------- -->
        <!-- TAB 1 CONTENT: MAIN LEADS DATABASE & SIMULATOR -->
        <!-- --------------------------------------- -->
        <div id="tab-dashboard" class="wp-tab-content space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Leads Table Section -->
                <div class="lg:col-span-2 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm text-left">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4 mb-4">
                        <div>
                            <h3 class="font-bold text-slate-900 text-base">অর্ডার ও কাস্টমার লিডস ডাটাবেজ</h3>
                            <p class="text-xs text-slate-500">আপনার ল্যান্ডিং পেইজ থেকে সংগৃহীত রিয়েল-টাইম লিডস ও কাস্টমার কোড বুকিং এন্ট্রি সমূহ।</p>
                        </div>
                        <input type="text" id="leads-search-input" onkeyup="searchLeads()" placeholder="খুঁজুন (নাম বা ফোন)..." class="text-xs border border-slate-200 rounded-xl px-4 py-2 w-full sm:w-48 bg-slate-50/50" />
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs border-collapse" id="leads-data-table">
                            <thead>
                                <tr class="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
                                    <th class="p-3">Order Code</th>
                                    <th class="p-3">Customer Details</th>
                                    <th class="p-3">Item Pack</th>
                                    <th class="p-3">District & Address</th>
                                    <th class="p-3">Total BDT</th>
                                    <th class="p-3 text-center">Status</th>
                                    <th class="p-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if ( empty($leads) ) : ?>
                                    <tr class="border-b border-slate-100">
                                        <td colspan="7" class="text-center p-8 text-slate-450 font-medium">কোনো লাইভ লিড পাওয়া যায়নি। ল্যান্ডিং পেজে কাস্টমার অর্ডার টেস্ট করুন!</td>
                                    </tr>
                                <?php else : ?>
                                    <?php foreach ( $leads as $l ) : ?>
                                        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-all font-sans lead-row-item">
                                            <td class="p-3 font-semibold text-indigo-750">
                                                <strong><?php echo esc_html($l->order_ref); ?></strong>
                                            </td>
                                            <td class="p-3">
                                                <b class="text-slate-900 font-bold search-field-name"><?php echo esc_html($l->customer_name); ?></b><br/>
                                                <span class="text-[10px] text-slate-500 font-mono search-field-phone"><?php echo esc_html($l->phone_number); ?></span>
                                            </td>
                                            <td class="p-3 text-slate-700 font-medium max-w-[150px] truncate" title="<?php echo esc_attr($l->offer_name); ?>">
                                                <?php echo esc_html($l->offer_name); ?>
                                            </td>
                                            <td class="p-3 text-slate-600 max-w-[150px] truncate" title="<?php echo esc_attr($l->address); ?>">
                                                <b class="text-slate-800 text-[10px] bg-slate-100 rounded px-1.5 font-bold block w-fit mb-0.5"><?php echo esc_html($l->district); ?></b>
                                                <?php echo esc_html($l->address); ?>
                                            </td>
                                            <td class="p-3 font-bold text-slate-900 font-mono">
                                                ৳<?php echo esc_html($l->total_price); ?>
                                            </td>
                                            <td class="p-3 text-center">
                                                <?php 
                                                    $st_color = 'bg-amber-50 text-amber-700 border-amber-200';
                                                    if ($l->status === 'Verified' || $l->status === 'Verified & Packed' || $l->status === 'Delivered') {
                                                        $st_color = 'bg-emerald-50 text-emerald-700 border-emerald-250';
                                                    } else if ($l->status === 'Cancelled') {
                                                        $st_color = 'bg-rose-50 text-rose-700 border-rose-200';
                                                    }
                                                ?>
                                                <span class="px-2 py-0.5 border rounded-full text-[9px] font-black uppercase <?php echo $st_color; ?>">
                                                    <?php echo esc_html($l->status); ?>
                                                </span>
                                            </td>
                                            <td class="p-3 text-right">
                                                <div class="flex items-center justify-end gap-1.5">
                                                    <!-- Fast verification trigger -->
                                                    <form method="post" action="" style="display:inline-block; margin:0;">
                                                        <input type="hidden" name="lead_id" value="<?php echo $l->id; ?>" />
                                                        <input type="hidden" name="new_status" value="Verified & Packed" />
                                                        <button type="submit" name="update_lead_status_action" title="অর্ডার ভেরিফাই করুন" class="p-1 px-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-500 text-emerald-800 hover:text-white transition-all cursor-pointer font-bold text-[10px]">
                                                            ✓
                                                        </button>
                                                    </form>
                                                    <!-- Delete trigger -->
                                                    <form method="post" action="" onsubmit="return confirm('আপনি কি এই কাস্টমার লিডটি মুছে ফেলতে চান?');" style="display:inline-block; margin:0;">
                                                        <input type="hidden" name="lead_id" value="<?php echo $l->id; ?>" />
                                                        <button type="submit" name="delete_lead_action" title="অর্ডার মুছুন" class="p-1 px-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-500 text-rose-800 hover:text-white transition-all cursor-pointer font-bold text-[10px]">
                                                            🗑️
                                                        </button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Right Sidebar inside WordPress for Credentials & Sub Plans -->
                <div class="space-y-6">
                    <!-- Quick Licensing Status Panel -->
                    <div class="bg-gradient-to-b from-indigo-50 to-white border border-indigo-200 rounded-2xl p-5 shadow-sm space-y-3 text-left">
                        <div class="flex justify-between items-center pb-2 border-b border-indigo-150">
                            <h4 class="font-extrabold text-indigo-950 text-xs flex items-center gap-1">
                                <span>💎</span>
                                <span>প্লাগইন সাবস্ক্রিপশন (Subscription Center)</span>
                            </h4>
                            <span class="text-[9px] bg-indigo-600 text-white font-black px-2 py-0.5 rounded-full uppercase">SECURED</span>
                        </div>
                        <p class="text-[11px] text-slate-600 leading-normal font-medium">
                            আপনার প্লাগইনটির সিঙ্ক লিমিট বাড়ানোর জন্য সঠিক প্ল্যান সিলেক্ট করুন। এবং পরিবর্তনগুলো সংরক্ষণ করুন।
                        </p>
                        <form method="post" action="" class="space-y-3 font-sans">
                            <div>
                                <select name="ff_plan" class="w-full text-xs border border-slate-250 bg-white/50 rounded-xl px-3.5 py-2.5 font-bold focus:ring-2 focus:ring-indigo-500">
                                    <option value="plan_starter" <?php selected($current_plan, 'plan_starter'); ?>>Starter Plan (178 BDT/mo - Max 2 Products)</option>
                                    <option value="plan_growth" <?php selected($current_plan, 'plan_growth'); ?>>Growth Plan (299 BDT/mo - Max 5 Products)</option>
                                    <option value="plan_business" <?php selected($current_plan, 'plan_business'); ?>>Business Pro (399 BDT/mo - Max 10 Products)</option>
                                    <option value="pkg_1" <?php selected($current_plan, 'pkg_1'); ?>>Starter Plan (178 BDT/mo - Max 2 Products)</option>
                                    <option value="pkg_2" <?php selected($current_plan, 'pkg_2'); ?>>Growth Plan (299 BDT/mo - Max 5 Products)</option>
                                    <option value="pkg_3" <?php selected($current_plan, 'pkg_3'); ?>>Business Pro (399 BDT/mo - Max 10 Products)</option>
                                </select>
                            </div>
                            <button type="submit" name="save_ff_settings" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all shadow-md shadow-indigo-900/40 cursor-pointer border-0">
                                Validate & Save License key
                            </button>
                        </form>
                    </div>

                    <!-- Courier Setup Setup Panel -->
                    <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 text-left">
                        <h4 class="font-bold text-slate-900 text-xs flex items-center gap-1.5 border-b border-slate-100 pb-2">
                            <span>🚚</span>
                            <span>কুরিয়ার এপিআই সেটিংস (Courier API Gateway)</span>
                        </h4>
                        <form method="post" action="" class="space-y-3.5">
                            <div>
                                <label class="text-[10px] font-bold text-slate-550 block mb-1">Pathao Store / Merchant ID:</label>
                                <input type="text" name="ff_pathao_store" value="<?php echo esc_attr(get_option('ff_pathao_store', '14925')); ?>" class="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50" />
                            </div>
                            <div>
                                <label class="text-[10px] font-bold text-slate-550 block mb-1">Steadfast API Token Client:</label>
                                <input type="password" name="ff_steadfast_key" value="<?php echo esc_attr(get_option('ff_steadfast_key', 'sf_key_******')); ?>" class="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50" />
                            </div>
                            <p class="text-[10px] text-slate-450 leading-relaxed font-sans">
                                Pathao ও Steadfast কুরিয়ার গেটওয়ে এমার্জেন্সি বুকিং ও লেবেল বানাতে এই ক্রেডেনশিয়াল ব্যবহার করা হয়।
                            </p>
                            <button type="submit" name="save_courier_settings" class="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 px-4 rounded-xl transition-all cursor-pointer border-0 text-center">
                                Sync API Credentials
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- --------------------------------------- -->
        <!-- TAB 2 CONTENT: MANAGE PRODUCTS -->
        <!-- --------------------------------------- -->
        <div id="tab-products" class="wp-tab-content hidden space-y-6 text-left">
            <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4 mb-6">
                    <div>
                        <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
                            <span>📦</span>
                            <span>ম্যানেজ প্রোডাক্টস ও প্রাইসিং প্যাক</span>
                        </h3>
                        <p class="text-xs text-slate-500">আপনার ল্যান্ডিং পেজে কাস্টমারদের দেখানোর জন্য প্রোডাক্ট এবং প্রাইসিং ডিল প্যাক সেটআপ করুন।</p>
                    </div>
                    <button onclick="toggleProductAddForm()" class="bg-indigo-650 hover:bg-indigo-750 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border-0">
                        <span>＋</span> নতুন প্রোডাক্ট যুক্ত করুন
                    </button>
                </div>

                <!-- Hidden form to Add Product -->
                <div id="product-add-form-container" class="hidden mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 select-none">
                    <h4 class="font-black text-xs text-indigo-900 mb-3">নতুন প্রোডাক্ট প্যাক যোগ করুন:</h4>
                    <form method="post" action="" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="text-[10px] font-bold text-slate-600 block mb-1">Product Name (প্রোডাক্ট এর নাম):</label>
                            <input type="text" name="prod_name" required placeholder="যেমন: ১টি সোলার লাইট" class="w-full text-xs border border-slate-200 rounded-xl p-2.5 bg-white" />
                        </div>
                        <div>
                            <label class="text-[10px] font-bold text-slate-600 block mb-1">Sale Price BDT (মূল্য):</label>
                            <input type="number" name="prod_price" required placeholder="1490" class="w-full text-xs border border-slate-200 rounded-xl p-2.5 bg-white" />
                        </div>
                        <div>
                            <label class="text-[10px] font-bold text-slate-600 block mb-1">Original Price BDT (পূর্বের মূল্য):</label>
                            <input type="number" name="prod_original_price" required placeholder="2500" class="w-full text-xs border border-slate-200 rounded-xl p-2.5 bg-white" />
                        </div>
                        <div>
                            <label class="text-[10px] font-bold text-slate-600 block mb-1">SKU Code (এসকিউ কোড):</label>
                            <input type="text" name="prod_sku" required placeholder="SL-101" class="w-full text-xs border border-slate-200 rounded-xl p-2.5 bg-white" />
                        </div>
                        <div class="md:col-span-2">
                            <label class="text-[10px] font-bold text-slate-600 block mb-1">Badge offer text (ডিসকাউন্ট অফার টেক্সট):</label>
                            <input type="text" name="prod_badge" required placeholder="৪০% ছাড় + ফ্রি শিপিং" class="w-full text-xs border border-slate-200 rounded-xl p-2.5 bg-white" />
                        </div>
                        <div class="md:col-span-3 text-right">
                            <button type="submit" name="add_product_action" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer border-0">
                                সেভ করুন (Save Product)
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Products Table representation -->
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr class="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
                                <th class="p-3">SKU</th>
                                <th class="p-3">প্রোডাক্ট প্যাক এর নাম (Product Name)</th>
                                <th class="p-3">বর্তমান অফার মূল্য</th>
                                <th class="p-3">আসল মূল্য</th>
                                <th class="p-3">অফার ব্যাজ</th>
                                <th class="p-3 text-center">স্টক স্ট্যাটাস</th>
                                <th class="p-3 text-right">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if ( empty($products_list) ) : ?>
                                <tr>
                                    <td colspan="7" class="text-center p-6 text-slate-400">কোনো প্রোডাক্ট পাওয়া যায়নি। অনুগ্রহ করে নতুন প্রোডাক্ট যুক্ত করুন।</td>
                                </tr>
                            <?php else : ?>
                                <?php foreach ( $products_list as $prod ) : ?>
                                    <tr class="border-b border-slate-100 hover:bg-slate-55 transition-all">
                                        <td class="p-3 font-mono font-bold text-indigo-800"><?php echo esc_html($prod['sku'] ?? 'N/A'); ?></td>
                                        <td class="p-3 font-bold text-slate-900"><?php echo esc_html($prod['name']); ?></td>
                                        <td class="p-3 font-mono font-bold text-slate-900">৳<?php echo esc_html($prod['price']); ?></td>
                                        <td class="p-3 text-slate-400 line-through font-mono">৳<?php echo esc_html($prod['original_price'] ?? $prod['originalPrice'] ?? 'N/A'); ?></td>
                                        <td class="p-3">
                                            <span class="bg-indigo-50 text-indigo-700 rounded-full px-2.5 py-0.5 border border-indigo-100 font-bold text-[9px]">
                                                <?php echo esc_html($prod['badge'] ?? 'N/A'); ?>
                                            </span>
                                        </td>
                                        <td class="p-3 text-center">
                                            <span class="bg-emerald-50 text-emerald-700 rounded-md px-2 py-0.5 border border-emerald-100 font-black text-[9px]">
                                                In Stock
                                            </span>
                                        </td>
                                        <td class="p-3 text-right">
                                            <form method="post" action="" onsubmit="return confirm('আপনি কি এই প্রোডাক্টটি ডিলিট করতে চান?');">
                                                <input type="hidden" name="prod_id" value="<?php echo esc_attr($prod['id']); ?>" />
                                                <button type="submit" name="delete_product_action" class="border border-rose-200 bg-rose-50 hover:bg-rose-500 text-rose-805 hover:text-white transition-all cursor-pointer text-[10px] font-bold p-1 px-2.5 rounded-lg">
                                                    ডিলিট
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>

        <!-- --------------------------------------- -->
        <!-- TAB 3 CONTENT: LANDING PAGE CAMPAIGNS -->
        <!-- --------------------------------------- -->
        <div id="tab-landers" class="wp-tab-content hidden space-y-6 text-left">
            <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4 mb-6">
                    <div>
                        <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
                            <span>🌐</span>
                            <span>ল্যান্ডিং পেজ মেকার ও ক্যাম্পেইন ম্যানেজার</span>
                        </h3>
                        <p class="text-xs text-slate-500">আপনার ওয়ার্ডপ্রেসের জন্য আলাদা আলাদা স্ল্যাগে একাধিক ওয়ান-পেজ ল্যান্ডিং ক্যাম্পেইন তৈরি করুন।</p>
                    </div>
                    <button onclick="toggleLanderAddForm()" class="bg-indigo-650 hover:bg-indigo-750 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border-0">
                        <span>＋</span> নতুন ক্যাম্পেইন ল্যান্ডার বানান
                    </button>
                </div>

                <!-- Hidden form to Add Campaign Lander -->
                <div id="lander-add-form-container" class="hidden mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 select-none">
                    <h4 class="font-black text-xs text-indigo-900 mb-3">নতুন ক্যাম্পেইন ল্যান্ডিং পেজ যোগ করুন:</h4>
                    <form method="post" action="" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="text-[10px] font-bold text-slate-600 block mb-1">Campaign Title (ক্যাম্পেইন শিরোনাম):</label>
                            <input type="text" name="lander_name" required placeholder="যেমন: Solar Light Promo 2026" class="w-full text-xs border border-slate-200 rounded-xl p-2.5 bg-white" />
                        </div>
                        <div>
                            <label class="text-[10px] font-bold text-slate-600 block mb-1">Target Slug Route (পেজ স্ল্যাগ):</label>
                            <input type="text" name="lander_slug" required placeholder="যেমন: /solar-light-pro" class="w-full text-xs border border-slate-200 rounded-xl p-2.5 bg-white" />
                        </div>
                        <div>
                            <label class="text-[10px] font-bold text-slate-600 block mb-1">Template Style Layout (থিম লেআউট):</label>
                            <select name="lander_temp" class="w-full text-xs border border-slate-200 rounded-xl p-2.5 bg-white">
                                <option value="Space Grotesk Modern">Space Grotesk Modern</option>
                                <option value="Rustic Eco Theme">Rustic Eco Theme</option>
                                <option value="Minimal Elegant Carbon">Minimal Elegant Carbon</option>
                            </select>
                        </div>
                        <div class="md:col-span-3 text-right">
                            <button type="submit" name="add_lander_action" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer border-0">
                                প্লাগইনে সিঙ্ক ও পাবলিশ করুন (Publish Campaign)
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Landers campaign listing -->
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr class="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
                                <th class="p-3">ক্যাম্পেইন নাম (Campaign Name)</th>
                                <th class="p-3">পেজ স্ল্যাগ লিংক (Sub Slug URL)</th>
                                <th class="p-3">ব্যবহৃত টেমপ্লেট মেকার</th>
                                <th class="p-3 text-center">ভিজিটর সংখ্যা (Views)</th>
                                <th class="p-3 text-center">অর্ডার সংখ্যা (Orders)</th>
                                <th class="p-3 text-center">ক্যাম্পেইন স্ট্যাটাস</th>
                                <th class="p-3 text-right">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if ( empty($landers_list) ) : ?>
                                <tr>
                                    <td colspan="7" class="text-center p-6 text-slate-450">কোনো ল্যান্ডিং পেজ ক্যাম্পেইন পাওয়া যায়নি। নতুন ক্যাম্পেইন তৈরি করুন।</td>
                                </tr>
                            <?php else : ?>
                                <?php foreach ( $landers_list as $lnd ) : ?>
                                    <tr class="border-b border-slate-100 hover:bg-slate-55 transition-all font-sans">
                                        <td class="p-3 font-bold text-slate-900"><?php echo esc_html($lnd['name']); ?></td>
                                        <td class="p-3 font-mono text-indigo-750 font-bold">
                                            <a href="<?php echo home_url($lnd['slug']); ?>" target="_blank" class="hover:underline">
                                                <?php echo esc_html($lnd['slug']); ?> ↗
                                            </a>
                                        </td>
                                        <td class="p-3 text-slate-600 font-mono"><?php echo esc_html($lnd['template']); ?></td>
                                        <td class="p-3 text-center font-mono font-bold text-slate-700"><?php echo esc_html($lnd['views']); ?></td>
                                        <td class="p-3 text-center font-mono font-bold text-indigo-600"><?php echo esc_html($lnd['orders']); ?></td>
                                        <td class="p-3 text-center">
                                            <span class="bg-emerald-50 text-emerald-700 rounded-md px-2 py-0.5 border border-emerald-100 font-black text-[9px] uppercase">
                                                <?php echo esc_html($lnd['status']); ?>
                                            </span>
                                        </td>
                                        <td class="p-3 text-right">
                                            <form method="post" action="" onsubmit="return confirm('আপনি কি এই ক্যাম্পেইন ল্যান্ডারটি ডিলিট করতে চান?');">
                                                <input type="hidden" name="lander_id" value="<?php echo esc_attr($lnd['id']); ?>" />
                                                <button type="submit" name="delete_lander_action" class="border border-rose-200 bg-rose-50 hover:bg-rose-500 text-rose-805 hover:text-white transition-all cursor-pointer text-[10px] font-bold p-1 px-2.5 rounded-lg">
                                                    রিমুভ
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>

        <!-- --------------------------------------- -->
        <!-- TAB 4 CONTENT: BLOG & POSTS -->
        <!-- --------------------------------------- -->
        <div id="tab-posts" class="wp-tab-content hidden space-y-6 text-left">
            <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div class="border-b border-slate-100 pb-4 mb-6">
                    <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
                        <span>📝</span>
                        <span>রিয়েল ওয়ার্ডপ্রেস পোস্টস লাইব্রেরি (Live WP Posts Hub)</span>
                    </h3>
                    <p class="text-xs text-slate-500">আপনার ওয়ার্ডপ্রেস সাইটে লাইভ প্রকাশিত করা ব্লগ পোস্ট এর তালিকা।</p>
                </div>

                <?php 
                    $wp_posts_query = get_posts(array('post_type' => 'post', 'numberposts' => 10));
                    if ( empty($wp_posts_query) ) :
                ?>
                    <div class="text-center p-8 bg-slate-50 border border-dashed rounded-xl text-slate-450 font-medium">
                        কোনো পোস্ট পাওয়া যায়নি। আপনার সাইটের 'পোস্টস' মেনু থেকে পোস্ট তৈরি করলে তা এখানে রিয়েল-টাইমে সিঙ্ক হবে।
                    </div>
                <?php else : ?>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <?php foreach ( $wp_posts_query as $pst ) : ?>
                            <div class="border border-slate-200 hover:border-indigo-400 p-4 rounded-2xl shadow-sm hover:shadow bg-slate-50/40 relative">
                                <div class="flex items-center gap-2 mb-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                    <span>📅 <?php echo esc_html(get_the_date('', $pst->ID)); ?></span>
                                    <span>• Author: <?php echo esc_html(get_the_author_meta('display_name', $pst->post_author)); ?></span>
                                </div>
                                <h4 class="font-black text-slate-900 text-sm limit-2-lines mb-2"><?php echo esc_html($pst->post_title); ?></h4>
                                <p class="text-xs text-slate-500 mb-4"><?php echo esc_html(wp_strip_all_tags(wp_trim_words($pst->post_content, 12))); ?></p>
                                <a href="<?php echo esc_url(get_permalink($pst->ID)); ?>" target="_blank" class="text-indigo-600 hover:text-indigo-850 font-bold text-xs flex items-center gap-1">
                                    পোস্ট দেখতে ক্লিক করুন ↗
                                </a>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>

        <!-- --------------------------------------- -->
        <!-- TAB 5 CONTENT: MEDIA LIBRARY -->
        <!-- --------------------------------------- -->
        <div id="tab-media" class="wp-tab-content hidden space-y-6 text-left">
            <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div class="border-b border-slate-100 pb-4 mb-6">
                    <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
                        <span>🖼️</span>
                        <span>রিয়েল ওয়ার্ডপ্রেস মিডিয়া গ্যালারি (Live WP Media Hub)</span>
                    </h3>
                    <p class="text-xs text-slate-500">আপনার ওয়ার্ডপ্রেসের মিডিয়া লাইব্রেরি থেকে ইমেজ এবং ব্যানার সিঙ্ক লিস্ট।</p>
                </div>

                <?php 
                    $wp_media_attachments = get_posts(array(
                        'post_type' => 'attachment',
                        'post_mime_type' => 'image',
                        'post_status' => 'inherit',
                        'posts_per_page' => 12
                    ));
                    if ( empty($wp_media_attachments) ) :
                ?>
                    <div class="text-center p-8 bg-slate-50 border border-dashed rounded-xl text-slate-450 font-medium select-none">
                        কোনো মিডিয়া ফাইল আপলোড করা পাওয়া যায়নি। মিডিয়া আপলোড করলে তা স্বয়ংক্রিয়ভাবে এখানে লোড হবে।
                    </div>
                <?php else : ?>
                    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        <?php foreach ( $wp_media_attachments as $media ) : ?>
                            <div class="border border-slate-200.5 p-3 rounded-2xl bg-white flex flex-col justify-between">
                                <div class="aspect-square bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center p-2 mb-2">
                                    <img src="<?php echo esc_url(wp_get_attachment_thumb_url($media->ID)); ?>" class="object-cover h-24 max-w-full rounded" />
                                </div>
                                <div class="space-y-1">
                                    <p class="font-bold text-slate-800 text-[10px] truncate max-w-full" title="<?php echo esc_attr($media->post_title); ?>">
                                        <?php echo esc_html($media->post_title); ?>
                                    </p>
                                    <p class="text-[9px] text-slate-400 font-mono"><?php echo esc_html($media->post_mime_type); ?></p>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>

        <!-- --------------------------------------- -->
        <!-- TAB 6 CONTENT: COURIER API GATEWAY SYNC -->
        <!-- --------------------------------------- -->
        <div id="tab-courier" class="wp-tab-content hidden space-y-6 text-left">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <div class="border-b border-slate-100 pb-3 mb-2">
                        <h3 class="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                            <span>🚚</span>
                            <span>বাংলাদেশ এক্সপ্রেস কুরিয়ার বুকিং প্যানেল</span>
                        </h3>
                        <p class="text-xs text-slate-550">এখানে থেকে ১-ক্লিকে কাস্টমারদের নাম-ঠিকানা সরাসরি পাঠাও ও স্টিডফাস্ট কুরিয়ারে বুকিং করে পার্সেল ট্র্যাকিং আইডি বের করুন।</p>
                    </div>

                    <div class="bg-indigo-50 border border-indigo-150 p-4 rounded-2xl flex items-start gap-3 select-none">
                        <span class="text-base">💡</span>
                        <div class="space-y-1">
                            <span class="font-bold text-indigo-950 text-xs block">কিভাবে ১-ক্লিকে কুরিয়ার বুকিং কাজ করবে?</span>
                            <p class="text-[11px] text-slate-600 leading-normal">
                                ড্যাশবোর্ডের লিডস টেবিলের পাশে বুকিং আইকনে ক্লিক করলেই এই কুরিয়ার প্যানেল কাস্টমারের ডেটা সিঙ্ক করে নেবে। আপনাকে আলাদাভাবে কাস্টমারের নাম-ঠিকানা আর কপি-পেস্ট করতে হবে না!
                            </p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="p-5 border border-slate-200 bg-slate-50/50 rounded-2xl">
                            <h4 class="font-black text-rose-650 text-xs uppercase flex items-center gap-1 mb-2">
                                <span>🚀</span> Pathao Express (ক্যাশ অন ডেলিভারি)
                            </h4>
                            <ul class="text-[11px] text-slate-600 space-y-1 pl-4 list-disc font-medium">
                                <li>অটো পার্সেল ট্র্যাকিং জেনারেটর</li>
                                <li>৬৪টি জেলায় ২৪ ঘণ্টার মধ্যে পার্সেল ড্রপব্যাক</li>
                                <li>API ইন্টিগ্রেশন স্ট্যাটাস: <strong class="text-emerald-600">CONNECTED</strong></li>
                            </ul>
                        </div>
                        <div class="p-5 border border-slate-200 bg-slate-50/50 rounded-2xl">
                            <h4 class="font-black text-indigo-755 text-xs uppercase flex items-center gap-1 mb-2">
                                <span>⚡</span> Steadfast Courier Group
                            </h4>
                            <ul class="text-[11px] text-slate-600 space-y-1 pl-4 list-disc font-medium">
                                <li>দ্রুততম শিপিং লেবেল জেনারেটর</li>
                                <li>রিয়েল-টাইম ক্যাশ অন কালেকশন ও bKash উইথড্রল</li>
                                <li>API ইন্টিগ্রেশন স্ট্যাটাস: <strong class="text-emerald-600">CONNECTED</strong></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h4 class="font-bold text-slate-900 text-xs flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-4">
                        <span>🛡️</span>
                        <span>ক্যালকুলেশন সেটিংস</span>
                    </h4>
                    <div class="space-y-4">
                        <div>
                            <label class="text-[10px] font-bold text-slate-600 block mb-1">ঢাকা সিটির ভেতর ডেলিভারি ফি (৳):</label>
                            <input type="number" value="70" class="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50" />
                        </div>
                        <div>
                            <label class="text-[10px] font-bold text-slate-600 block mb-1">ঢাকা সিটির বাইরে এক্সপ্রেস ডেলিভারি ফি (৳):</label>
                            <input type="number" value="120" class="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50" />
                        </div>
                        <div>
                            <label class="text-[10px] font-bold text-slate-600 block mb-1">অটো ক্যাশ হ্যান্ডলিং চার্জ পার্সেন্টেজ (%):</label>
                            <input type="text" value="1%" readonly class="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-100 font-mono text-slate-500" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- --------------------------------------- -->
        <!-- TAB 7 CONTENT: SUBSCRIPTION & CONTRACTS -->
        <!-- --------------------------------------- -->
        <div id="tab-plans" class="wp-tab-content hidden space-y-6 text-left">
            <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div class="text-center mb-6">
                    <h3 class="text-sm font-bold uppercase tracking-widest text-indigo-650">প্রিমিয়াম লাইসেন্সিং সেন্টার</h3>
                    <h4 class="text-2xl font-black text-slate-900 mt-1 Bengali-title">আপনার সাবস্ক্রিপশন প্ল্যান ও কোটা লিমিট</h4>
                    <p class="text-xs text-slate-500 mt-1 max-w-md mx-auto">ওয়ার্ডপ্রেসের জন্য উপযুক্ত প্ল্যানটি এক্টিভেট করে আনলিমিটেড ফোন কাস্টমার ও কুরিয়ার সিঙ্ক উপভোগ করুন।</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                    <!-- Pricing Card 1 -->
                    <div class="border border-slate-200 rounded-3xl p-5 hover:border-indigo-400 bg-slate-50/50 flex flex-col justify-between">
                        <div class="space-y-3">
                            <span class="text-[9px] font-black text-rose-700 bg-rose-50 border border-rose-200 rounded-full px-2 py-0.5 uppercase">৪৩% ছাড়</span>
                            <h4 class="font-black text-sm text-slate-900">১টি প্লাগইন লাইসেন্স ডিল (Starter Plan)</h4>
                            <p class="text-[11px] text-slate-500 leading-normal">ছোট ডিল ক্যাস্পেইনের জন্য সেরা স্টার্টার ব্যাকআপ সাপোর্ট।</p>
                            <div class="pt-4 border-t border-slate-200 mt-4">
                                <span class="text-2xl font-black text-indigo-600">৳১৭৮</span> <span class="text-xs text-slate-400 font-mono">/ মাস</span>
                            </div>
                        </div>
                        <ul class="text-[10px] text-slate-600 space-y-2 mt-4 font-semibold">
                            <li>✔ ২ সর্বোচ্চ প্রোডাক্ট সীমা (Product limit)</li>
                            <li>✔ ৫ ভেরিফাইড ক্যাম্পেইন স্ল্যাগ</li>
                            <li>✔ রিয়েল-টাইম Leads Sync</li>
                        </ul>
                    </div>

                    <!-- Pricing Card 2 (Growth) -->
                    <div class="border-2 border-indigo-500 rounded-3xl p-5 bg-indigo-50/10 flex flex-col justify-between shadow-md shadow-indigo-100">
                        <div class="space-y-3">
                            <span class="text-[9px] font-black text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-full px-2 py-0.5 uppercase">বেস্ট সেলার (Best Seller)</span>
                            <h4 class="font-black text-sm text-slate-900">৩টি মাল্টি-ল্যান্ডার লাইসেন্স (Growth Plan)</h4>
                            <p class="text-[11px] text-slate-500 leading-normal">নিয়মিত সোলার ও ক্যাম্পিং পণ্য বিক্রেতাদের জন্য চরম সমাধান।</p>
                            <div class="pt-4 border-t border-slate-250 mt-4">
                                <span class="text-2xl font-black text-indigo-600">৳২৯৯</span> <span class="text-xs text-slate-400 font-mono">/ মাস</span>
                            </div>
                        </div>
                        <ul class="text-[10px] text-slate-600 space-y-2 mt-4 font-semibold">
                            <li>✔ ৫ প্রোডাক্ট এডমিন ডিল সীমা</li>
                            <li>✔ ১০ ল্যান্ডিং ক্যাম্পেইন স্ল্যাগ</li>
                            <li>✔ ১-ক্লিক Pathao কুরিয়ার সিঙ্ক</li>
                            <li>✔ ৫ বছর ফাস্ট সার্ভিস সাপোর্ট</li>
                        </ul>
                    </div>

                    <!-- Pricing Card 3 (Business) -->
                    <div class="border border-slate-200 rounded-3xl p-5 hover:border-indigo-400 bg-slate-50/50 flex flex-col justify-between">
                        <div class="space-y-3">
                            <span class="text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-250 rounded-full px-2 py-0.5 uppercase">মেগা অফার</span>
                            <h4 class="font-black text-sm text-slate-900">আনলিমিটেড সর্টজিল প্যাক (Business Pro)</h4>
                            <p class="text-[11px] text-slate-500 leading-normal">একাধিক বিজনেস ফ্র্যাঞ্চাইজি ও এজেন্সির জন্য আল্টিমেট ডিল।</p>
                            <div class="pt-4 border-t border-slate-200 mt-4">
                                <span class="text-2xl font-black text-indigo-600">৳৩৯৯</span> <span class="text-xs text-slate-400 font-mono">/ মাস</span>
                            </div>
                        </div>
                        <ul class="text-[10px] text-slate-605 space-y-2 mt-4 font-semibold">
                            <li>✔ ১০ প্রোডাক্ট সীমা (Product pack)</li>
                            <li>✔ আনলিমিটেড ক্যাম্পেইন ল্যান্ডার্স</li>
                            <li>✔ ১-ক্লিক Pathao ও Steadfast কুরিয়ার সিঙ্ক</li>
                            <li>✔ ৫ বছরের প্রিমিয়াম সার্ভিসিং ওয়ারেন্টি</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <!-- Vanilla Javascript to support instant SPA tab-switching & Leads Filtering inside WordPress dashboard -->
    <script>
        function switchTab(tabId) {
            // Hide all tab components
            document.querySelectorAll('.wp-tab-content').forEach(function(el) {
                el.classList.add('hidden');
            });
            // Show target tab component
            document.querySelector('#tab-' + tabId).classList.remove('hidden');
            
            // Adjust active CSS styles in navigation buttons
            document.querySelectorAll('.wp-tab-btn').forEach(function(btn) {
                btn.classList.remove('border-indigo-600', 'text-indigo-650', 'bg-indigo-50/20', 'font-black');
                btn.classList.add('border-transparent', 'text-slate-550', 'font-semibold');
            });
            
            const activeBtn = document.querySelector('#btn-' + tabId);
            if (activeBtn) {
                activeBtn.classList.add('border-indigo-600', 'text-indigo-650', 'bg-indigo-50/20', 'font-black');
                activeBtn.classList.remove('border-transparent', 'text-slate-550', 'font-semibold');
            }
        }

        function toggleProductAddForm() {
            const form = document.getElementById('product-add-form-container');
            if (form) {
                form.classList.toggle('hidden');
            }
        }

        function toggleLanderAddForm() {
            const form = document.getElementById('lander-add-form-container');
            if (form) {
                form.classList.toggle('hidden');
            }
        }

        // Live leads search algorithm
        function searchLeads() {
            const input = document.getElementById('leads-search-input');
            const filter = input.value.toLowerCase();
            const rows = document.querySelectorAll('.lead-row-item');
            
            rows.forEach(function(row) {
                const nameEl = row.querySelector('.search-field-name');
                const phoneEl = row.querySelector('.search-field-phone');
                if (nameEl || phoneEl) {
                    const textName = nameEl ? nameEl.textContent.toLowerCase() : '';
                    const textPhone = phoneEl ? phoneEl.textContent.toLowerCase() : '';
                    if (textName.includes(filter) || textPhone.includes(filter)) {
                        row.style.display = "";
                    } else {
                        row.style.display = "none";
                    }
                }
            });
        }
    </script>
    <?php
}
`;

      // 2. readme.txt installer guide
      const readmeContent = `=== Phone Funnel Leads & Product Manager Pro ===
Contributors: Phone Funnel Team
Tags: woocommerce, checkout, leads tracker, mobile phone funnel, bangladesh, bkash
Requires PHP: 7.2
Tested up to: 6.5
Version: 1.0.0
License: GPL2

Track high-converting 1-Click Phone Funnels and standard checkout orders in a unified, beautifully organized WordPress administrative page. Employs subscription structures enforcing product licensing limit.

== Description ==
Designed especially for Bangladeshi e-commerce landing pages, this plugin registers a custom database table to collect phone-funnel leads safely. Provides automatic API endpoint support to register lead actions in 1-click.

== Plans & Pricing limits ==
* Starter (178 BDT/mo) : Supports up to 2 active products
* Growth (299 BDT/mo) : Supports up to 5 products
* Business (399 BDT/mo) : Up to 10 products

== Installation ==
1. Upload the entire 'phone-funnel-pro' directory to your WordPress plugin folder (normally \`/wp-content/plugins/\`).
2. Activate the plugin through the 'Plugins' menu in WordPress Admin panel.
3. Access 'Phone Funnels Pro' inside your left admin bar to review leads database.
4. Set up incoming webhook target pointer using provided REST URL details.
`;

      zip.folder("phone-funnel-pro")
         .file("phone-funnel-pro.php", phpContent)
         .file("readme.txt", readmeContent);

      const contentBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(contentBlob);
      setZipDownloadUrl(downloadUrl);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'phone-funnel-pro.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSuccessMsg('WordPress Plugin Installer (.zip) generated and downloaded successfully!');
    } catch (err: any) {
      setErrorMsg(`Failed to package plugin zip: ${err?.message || err}`);
    } finally {
      setZipping(false);
    }
  };

  // Generate real WordPress parent/child theme zip
  const generateThemeZip = async () => {
    setZipping(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const zip = new JSZip();
      
      // 1. style.css metadata
      const styleContent = `/*
Theme Name: Phone Funnel Premium Landing Theme
Theme URI: https://yourfunnels.com/theme
Author: Phone Funnels Pro Team
Author URI: https://yourfunnels.com/team
Description: A companion high performance theme designed to programmatically instantiate the premium landing pages. Includes custom layout templates with zero-layout overrides.
Version: 1.0.0
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: phone-funnel-theme
*/`;

      // 2. index.php safety fallback
      const indexContent = `<?php
// Fallback WordPress rendering loop
get_header();
if (have_posts()) :
    while (have_posts()) : the_post();
        the_content();
    endwhile;
endif;
get_footer();`;

      // 3. page-solar-pro.php - template file containing the entire dynamic responsive HTML
      const templateContent = `<?php
/**
 * Template Name: Phone Funnel Premium Light-Slate Solar Lander
 * Description: Fully responsive high-converting single-click phone checkout and WooCommerce synchronized landing page template.
 */
?>
${rawHtmlCode}`;

      // 4. functions.php automatic theme setup triggers
      const functionsContent = `<?php
/**
 * Automatically create the Landing page on switch theme hook
 */
add_action('after_switch_theme', 'phone_funnel_auto_create_landing_page');

function phone_funnel_auto_create_landing_page() {
    $page_title = 'Solar Charging Searchlight Landing Page';
    
    // Check if page already exists
    $page_id = get_page_by_path('solar-led-searchlight', OBJECT, 'page');
    
    if (!$page_id) {
        $new_page = array(
            'post_type'     => 'page',
            'post_title'    => $page_title,
            'post_content'  => '<!-- Custom landing page layout injected on theme activation by Phone Funnel Theme -->',
            'post_status'   => 'publish',
            'post_name'     => 'solar-led-searchlight'
        );
        $inserted_id = wp_insert_post($new_page);
        if ($inserted_id && !is_wp_error($inserted_id)) {
            // Force template selection
            update_post_meta($inserted_id, '_wp_page_template', 'page-solar-pro.php');
        }
    }
}`;

      zip.folder("phone-funnel-theme")
         .file("style.css", styleContent)
         .file("index.php", indexContent)
         .file("page-solar-pro.php", templateContent)
         .file("functions.php", functionsContent);

      const contentBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(contentBlob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'phone-funnel-theme.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSuccessMsg('WordPress Theme Installer (.zip) generated and downloaded successfully! Once activated, it programmatically sets up a landing page assigned to standard premium templates.');
    } catch (err: any) {
      setErrorMsg(`Failed to package theme zip: ${err?.message || err}`);
    } finally {
      setZipping(false);
    }
  };

  // Download Elementor JSON export standalone template
  const handleDownloadElementor = () => {
    try {
      const elementorJsonTemplate = JSON.stringify({
        version: "0.4",
        title: "Solar Camping LED Searchlight Phone Funnel Template",
        type: "section",
        content: [
          {
            id: "solar-landing-section",
            elType: "section",
            settings: {
              structure: "10"
            },
            elements: [
              {
                id: "solar-landing-column",
                elType: "column",
                settings: {
                  _column_size: 100
                },
                elements: [
                  {
                    id: "solar-widget-html",
                    elType: "widget",
                    widgetType: "html",
                    settings: {
                      html: rawHtmlCode
                    }
                  }
                ]
              }
            ]
          }
        ]
      }, null, 2);

      const blob = new Blob([elementorJsonTemplate], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'elementor-solar-camping-light-template.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setSuccessMsg('Elementor JSON Template exported and downloaded successfully! You can import this directly into Elementor templates.');
    } catch (err: any) {
      setErrorMsg(`Failed to export Elementor JSON: ${err?.message || err}`);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-slate-800">
      
      {/* Visual Header Hub Banner */}
      <div className="p-6 bg-slate-900 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 py-1 px-3 rounded-full text-[11px] font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>WordPress Integration Hub</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
            <span>WordPress Plugin Manager & Live Admin Simulator</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            আপনার ল্যান্ডিং পেজে ক্রেতারা ১-ক্লিকে ফোন অর্ডার বা WooCommerce চেকআউট সম্পন্ন করলে সকল ডাটা সরাসরি ওয়ার্ডপ্রেস ও উকমার্স ডাটাবেজে রিয়েল-টাইমে সিঙ্ক হবে।
          </p>
        </div>

        <button
          onClick={generatePluginZip}
          disabled={zipping}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs md:text-sm rounded-xl transition-all shadow-md shadow-indigo-900/40 flex items-center justify-center gap-2 cursor-pointer shrink-0 self-stretch md:self-auto min-w-[210px]"
        >
          <HardDriveDownload className={`w-4 h-4 ${zipping && 'animate-spin'}`} />
          <span>{zipping ? 'প্যাকেজিং হচ্ছে...' : 'ওয়ার্ডপ্রেস প্লাগইন ডাউনলোড (.ZIP)'}</span>
        </button>
      </div>

      {/* Internal Interactive Alert banner */}
      {successMsg && (
        <div className="m-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 text-xs md:text-sm font-semibold select-none animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="flex-1">
            <p>{successMsg}</p>
            {zipDownloadUrl && (
              <p className="text-[11px] text-emerald-600 mt-0.5">
                যদি ডাউনলোড নিজে থেকেই চালু না হয়, <a href={zipDownloadUrl} download="phone-funnel-pro.zip" className="underline font-bold">এখানে ক্লিক করে ম্যানুয়ালি ইনস্টলার জিপ সেভ করুন</a>।
              </p>
            )}
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="m-6 p-4 bg-rose-50 border border-rose-250 text-rose-800 rounded-xl flex items-center gap-3 text-xs md:text-sm font-semibold select-none animate-fadeIn">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Main Tabs Area */}
      <div className="px-6 border-b border-slate-100 flex gap-4 overflow-x-auto bg-slate-50/50">
        <button
          onClick={() => { setActiveTab('dashboard'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`py-3.5 px-1 bg-transparent border-b-2 font-bold text-xs md:text-sm transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'dashboard' 
              ? 'border-indigo-600 text-indigo-600 font-black' 
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>ওয়ার্ডপ্রেস এডমিন পেজ সিমুলেটর (WP Sandbox)</span>
        </button>
        <button
          onClick={() => { setActiveTab('products'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`py-3.5 px-1 bg-transparent border-b-2 font-bold text-xs md:text-sm transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'products' 
              ? 'border-indigo-600 text-indigo-600 font-black' 
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>ম্যানেজ প্রোডাক্টস ({wpProducts.length} / {activePlan.productLimit})</span>
        </button>
        <button
          onClick={() => { setActiveTab('landers'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`py-3.5 px-1 bg-transparent border-b-2 font-bold text-xs md:text-sm transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'landers' 
              ? 'border-indigo-600 text-indigo-600 font-black' 
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>ল্যান্ডিং পেজ মেকার ({wpLanders.length} / {activePlan.landingPageLimit})</span>
        </button>
        <button
          onClick={() => { setActiveTab('posts'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`py-3.5 px-1 bg-transparent border-b-2 font-bold text-xs md:text-sm transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'posts' 
              ? 'border-indigo-600 text-indigo-600 font-black' 
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>ব্লগ ও পোস্টস ({wpPosts.length})</span>
        </button>
        <button
          onClick={() => { setActiveTab('media'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`py-3.5 px-1 bg-transparent border-b-2 font-bold text-xs md:text-sm transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'media' 
              ? 'border-indigo-600 text-indigo-600 font-black' 
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Image className="w-4 h-4" />
          <span>মিডিয়া লাইব্রেরি ({wpMedia.length})</span>
        </button>
        <button
          onClick={() => { setActiveTab('courier'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`py-3.5 px-1 bg-transparent border-b-2 font-bold text-xs md:text-sm transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'courier' 
              ? 'border-indigo-600 text-indigo-600 font-black' 
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>🚚 কুরিয়ার বুকিং পোর্টাল</span>
        </button>
        <button
          onClick={() => { setActiveTab('plans'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`py-3.5 px-1 bg-transparent border-b-2 font-bold text-xs md:text-sm transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'plans' 
              ? 'border-indigo-600 text-indigo-600 font-black' 
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>সাবস্ক্রিপশন ও প্লাগইন লাইসেন্স</span>
        </button>
        <button
          onClick={() => { setActiveTab('live_preview'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`py-3.5 px-1 bg-transparent border-b-2 font-bold text-xs md:text-sm transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'live_preview' 
              ? 'border-indigo-600 text-indigo-600 font-black' 
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Globe className="w-4 h-4 text-purple-600 font-extrabold animate-pulse" />
          <span>🌐 লাইভ পেজ প্রিভিউ (Live Preview)</span>
        </button>
        <button
          onClick={() => { setActiveTab('raw_export'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`py-3.5 px-1 bg-transparent border-b-2 font-bold text-xs md:text-sm transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'raw_export' 
              ? 'border-indigo-600 text-indigo-600 font-black' 
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Download className="w-4 h-4 text-emerald-600" />
          <span>📥 HTML ও এলিমেন্টর এক্সপোর্টার</span>
        </button>
      </div>

      {/* Content Panels */}
      <div className="p-6">
        
        {/* TAB 1: WP Admin Simulator Dashboard with Swagotom Hub Header */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">

            {/* CRITICAL INSTALLATION ERROR PREVENTION WARNING BANNER FOR WP USERS */}
            <div className="bg-rose-50 border-2 border-rose-500 rounded-2xl p-5 shadow-sm space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-rose-500 text-white rounded-lg">
                  <AlertTriangle className="w-5 h-5 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-rose-950 flex items-center gap-2">
                    <span>🛑 ওয়ার্ডপ্রেস প্লাগইন ইনস্টলেশন এর গুরুত্বপূর্ণ নির্দেশনাবলী (Important WordPress Installation Guide)</span>
                  </h4>
                  <p className="text-xs text-rose-800 leading-relaxed font-semibold">
                    আপনি কি ওয়ার্ডপ্রেস ড্যাশবোর্ডে প্লাগইন ইন্সটল করার সময় <b className="font-mono text-indigo-900 bg-white px-1 py-0.5 rounded border border-rose-200">"No valid plugins were found"</b> এরর বা ইন্সটলেশন ব্যর্থতার সম্মুখীন হয়েছেন? 
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    ওয়ার্ডপ্রেসের প্লাগইন মেনু থেকে ভুল করে আমাদের এই AI Studio-এর মেইন সোর্স কোডের জিপ ফাইলটি <b className="font-mono text-rose-700 bg-rose-100/50 px-1 rounded">"solar-camping-light-landing-page.zip"</b> আপলোড করার কারণে এই সমস্যাটি হয়েছে। ওই জিপ ফাইলটি হচ্ছে একটি রিয়্যাক্ট (React JS + Vite) ফ্রন্টএন্ড কোডবেস, যা সরাসরি ওয়ার্ডপ্রেসে চলতে পারে না।
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/75 p-4 rounded-xl border border-rose-200 text-xs text-slate-800 leading-relaxed font-medium">
                <div className="space-y-2">
                  <p className="font-bold text-rose-600 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <span>❌ ভুল পদ্ধতি (DO NOT DO THIS)</span>
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                    <li>AI Studio-এর ডিরেক্টরি ডাউনলোডার বা প্রজেক্ট সোর্স কোড (.zip) ফাইল সরাসরি ওয়ার্ডপ্রেসে আপলোড করা।</li>
                    <li>ফাইলনেম: <b className="font-mono text-rose-700">solar-camping-light-landing-page.zip</b></li>
                  </ul>
                </div>
                <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-200 pt-2 md:pt-0 md:pl-4">
                  <p className="font-bold text-emerald-600 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <span>✔ সঠিক সমাধান (CORRECT WORKFLOW)</span>
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                    <li>এই ড্যাশবোর্ড থেকে ডাউনলোড বাটনগুলোতে ক্লিক করে আলাদাভাবে <b className="font-mono text-emerald-700">phone-funnel-pro.zip</b> ফাইলটি সেভ করুন।</li>
                    <li>ডাউনলোড করা সঠিক প্লাগইন ফাইলটি ওয়ার্ডপ্রেস সাইটের <b className="font-sans">Plugins &gt; Add New &gt; Upload Plugin</b> সেকশনে গিয়ে আপলোড করুন।</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  onClick={generatePluginZip}
                  disabled={zipping}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs py-3 px-4 rounded-xl transition-all shadow-md shadow-emerald-900/40 flex items-center justify-center gap-2 cursor-pointer border-0"
                >
                  <HardDriveDownload className={`w-4 h-4 ${zipping && 'animate-spin'}`} />
                  <span>{zipping ? 'প্যাকেজিং হচ্ছে...' : 'প্লাগইন জিপ ফাইল ডাউনলোড করুন (phone-funnel-pro.zip)'}</span>
                </button>
                <button
                  onClick={generateThemeZip}
                  disabled={zipping}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs py-3 px-4 rounded-xl transition-all shadow-md shadow-indigo-900/40 flex items-center justify-center gap-2 cursor-pointer border-0"
                >
                  <Layers className="w-4 h-4" />
                  <span>কম্প্যানিয়ন থিম ডাউনলোড করুন (phone-funnel-theme.zip)</span>
                </button>
              </div>
            </div>

            {/* Dynamic Swagotom Hub Welcome Panel */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10">
                <Terminal className="w-64 h-64 text-indigo-400" />
              </div>
              <div className="relative space-y-3 max-w-4xl">
                <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 py-1 px-3.5 rounded-full text-xs font-black uppercase tracking-widest leading-none">
                  স্বাগতম, এডমিন ও ডেভেলপার হাব-এ!
                </span>
                <h3 className="text-xl md:text-2xl font-black tracking-tight leading-snug">
                  ওয়ার্ডপ্রেস এবং রিয়েল-টাইম উকমার্স লিডস সিনক্রোনাইজার
                </h3>
                <p className="text-xs text-slate-350 leading-relaxed max-w-3xl">
                  আপনার ল্যান্ডিং পেজে ক্রেতারা ১-ক্লিকে ফোন অর্ডার বা উকমার্স চেকআউটের মাধ্যমে কোনো অর্ডার সাবমিট করলেই তা স্বয়ংক্রিয়ভাবে এখানে ওয়ার্ডপ্রেসের ডাটাবেজে সিঙ্ক হয়। আপনি এখান থেকে রিয়েল-টাইম লাইভ ট্রাফিকের সিঙ্কিং স্ট্যান্ট পরীক্ষা করতে পারবেন, ডিল পরিবর্তন করতে পারবেন এবং সাবস্ক্রিপশন প্ল্যান আপডেট করতে পারবেন।
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 p-3 rounded-xl flex items-center gap-3 animate-fadeIn">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                    <span className="text-[11px] font-mono text-slate-300"><b>Sync Service:</b> Connected to WooCommerce DB & WP Orders</span>
                  </div>
                  <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 p-3 rounded-xl flex items-center gap-3 animate-fadeIn">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0"></span>
                    <span className="text-[11px] font-mono text-slate-300"><b>Active Plan:</b> {activePlan.name} • ৳{activePlan.price}/Mo</span>
                  </div>
                  <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 p-3 rounded-xl flex items-center gap-3 animate-fadeIn">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0 animate-ping"></span>
                    <span className="text-[11px] font-mono text-slate-300"><b>Courier API:</b> Pathao ({pathaoConnected ? 'Connected' : 'Offline'}) & Steadfast ({steadfastConnected ? 'Connected' : 'Offline'})</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Fake WordPress Bar info */}
            <div className="bg-slate-100 rounded-xl border border-slate-200 p-4 font-mono text-xs flex gap-2 items-center justify-between shadow-inner select-none overflow-x-auto">
              <div className="flex gap-2.5 items-center shrink-0">
                <span className="text-slate-500 font-bold">&#9776; WP Admin Bar Menu</span>
                <span className="text-slate-300">|</span>
                <span className="font-bold text-indigo-650 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-650 animate-pulse"></span> WooCommerce Live Sync Panel
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0 text-[11px]">
                <span className="bg-indigo-100 text-indigo-800 border border-indigo-200 font-bold px-2 py-0.5 rounded">
                  Active Tier: {activePlan.name} ({activePlan.productLimit} Max Products)
                </span>
                <span className="text-slate-500 font-medium">Howdy, <b>Admin user (rahatbappa)</b></span>
              </div>
            </div>

            {/* Simulated WordPres Native Panel Grid wrapper */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Column 1: Left navigation sidebar simulator (col-span-2) */}
              <div className="lg:col-span-2 bg-slate-950 text-slate-300 rounded-xl p-4 space-y-4 shadow-md font-mono text-[11px] selection:bg-slate-800">
                <div className="font-bold text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-2 mb-2 flex justify-between items-center text-[9px]">
                  <span>WP NAVIGATION</span>
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></span>
                </div>
                
                <div className="space-y-1">
                  <button onClick={() => { setActiveTab('dashboard'); setErrorMsg(''); setSuccessMsg(''); }} className="w-full text-left p-2 hover:bg-slate-900 text-slate-400 hover:text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer font-mono font-bold border-0 bg-transparent">
                    <span className="text-xs">📊</span> <span>Dashboard</span>
                  </button>
                  <button onClick={() => { setActiveTab('posts'); setErrorMsg(''); setSuccessMsg(''); }} className="w-full text-left p-2 hover:bg-slate-900 text-slate-400 hover:text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer font-mono font-bold border-0 bg-transparent">
                    <span className="text-xs">📝</span> <span>Posts Blog</span>
                  </button>
                  <button onClick={() => { setActiveTab('media'); setErrorMsg(''); setSuccessMsg(''); }} className="w-full text-left p-2 hover:bg-slate-900 text-slate-400 hover:text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer font-mono font-bold border-0 bg-transparent">
                    <span className="text-xs">🖼</span> <span>Media Library</span>
                  </button>
                  <button onClick={() => { setActiveTab('landers'); setErrorMsg(''); setSuccessMsg(''); }} className="w-full text-left p-2 hover:bg-slate-900 text-slate-400 hover:text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer font-mono font-bold border-0 bg-transparent">
                    <span className="text-xs">📄</span> <span>Pages (Landers)</span>
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-900 space-y-1">
                  <div className="p-2 bg-indigo-950 font-bold text-indigo-300 border-l-4 border-indigo-500 rounded-r-lg flex items-center gap-1.5 animate-pulse">
                    <span className="text-xs">📞</span> <span>Phone Funnel Pro</span>
                  </div>
                  <button className="w-full text-left pl-6 p-1 hover:text-white text-slate-400 font-medium text-[10px] cursor-pointer border-0 bg-transparent" onClick={() => { setActiveTab('dashboard'); setErrorMsg(''); setSuccessMsg(''); }}>
                    🗃️ Leads Logs
                  </button>
                  <button className="w-full text-left pl-6 p-1 hover:text-white text-slate-400 font-medium text-[10px] cursor-pointer border-0 bg-transparent" onClick={() => { setActiveTab('products'); setErrorMsg(''); setSuccessMsg(''); }}>
                    📦 Manage Products
                  </button>
                  <button className="w-full text-left pl-6 p-1 hover:text-white text-slate-400 font-medium text-[10px] cursor-pointer border-0 bg-transparent" onClick={() => { setActiveTab('plans'); setErrorMsg(''); setSuccessMsg(''); }}>
                    💳 Licensing Plans
                  </button>
                  <button className="w-full text-left pl-6 p-1 hover:text-white text-slate-400 font-medium text-[10px] cursor-pointer border-0 bg-transparent" onClick={() => { setActiveTab('courier'); setErrorMsg(''); setSuccessMsg(''); }}>
                    🚚 Courier Booking
                  </button>
                  <button className="w-full text-left pl-6 p-1 hover:text-white text-slate-400 font-medium text-[10px] cursor-pointer border-0 bg-transparent" onClick={() => { setActiveTab('live_preview'); setErrorMsg(''); setSuccessMsg(''); }}>
                    🌐 Live Lander Preview
                  </button>
                  <button className="w-full text-left pl-6 p-1 hover:text-white text-slate-400 font-medium text-[10px] cursor-pointer border-0 bg-transparent" onClick={() => { setActiveTab('raw_export'); setErrorMsg(''); setSuccessMsg(''); }}>
                    📥 Code Exporter
                  </button>
                </div>
              </div>

              {/* Column 2: Middle panel (The administrative orders datatable (col-span-7)) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Visual stats cards inside wordpress dashboard */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1 shadow-sm">
                    <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">Total Orders Sync</p>
                    <p className="text-2xl font-black text-indigo-600">{orders.length || 0} Leads</p>
                    <p className="text-[10px] text-slate-400 font-medium font-mono">Live Database</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1 shadow-sm">
                    <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">1-Click Mobile Orders</p>
                    <p className="text-2xl font-black text-purple-700">
                      {orders.filter(o => o.checkoutType === 'phone_1click').length || 0} Leads
                    </p>
                    <p className="text-[10px] text-emerald-600 font-bold font-mono">৳{orders.reduce((acc, curr) => acc + curr.total, 0)} Total Sales</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1 shadow-sm flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider font-sans">Enforced products limit</p>
                      <p className="text-xs font-black text-indigo-605 mt-1">{activePlan.name} (৳{activePlan.price}/Mo)</p>
                    </div>
                    <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-mono font-bold w-fit mt-1">Products: {wpProducts.length} / {activePlan.productLimit}</span>
                  </div>
                </div>

                {/* Simulated Order Leads Table */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-4">
                  <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Phone Funnel Leads database (WordPress Database Sync)</h4>
                      <p className="text-[11px] text-slate-500">Real-time synchronized database records matching your customer flow.</p>
                    </div>
                    <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[9px] font-black py-1 px-3 rounded-full uppercase tracking-widest font-mono">
                      Connected DB
                    </span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-700">কোনো সিঙ্কড অর্ডার পাওয়া যায়নি!</p>
                      <p className="text-[11px] text-slate-400">ল্যান্ডিং পেজে ডেমো অর্ডার করুন অথবা ডানদিকের "টেস্ট ল্যান্ডার সিমুলেটর" ব্যবহার করুন।</p>
                      <button 
                        onClick={() => {
                          const testLead: LeadOrder = {
                            id: "WP-" + Math.floor(100000 + Math.random() * 900000),
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
                            createdAt: new Date().toISOString()
                          };
                          onAddOrder(testLead);
                          setSuccessMsg('ডেমো লিড সফলভাবে সিঙ্ক করা হয়েছে!');
                        }}
                        className="mt-3 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold"
                      >
                        পপুলেট ডেমো স্যাম্পল লিডস
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                            <th className="py-2.5 px-3">Order Ref</th>
                            <th className="py-2.5 px-3">Customer Info</th>
                            <th className="py-2.5 px-3">Target Offer / Price</th>
                            <th className="py-2.5 px-3">Channel</th>
                            <th className="py-2.5 px-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {orders.map((o) => (
                            <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-3 px-3 font-mono font-bold text-slate-900">{o.id}</td>
                              <td className="py-3 px-3">
                                <div>
                                  <p className="font-bold text-slate-900">{o.customerName}</p>
                                  <p className="font-mono text-slate-500 text-[11px]">{o.phoneNumber}</p>
                                  <p className="text-slate-400 text-[10px] max-w-[130px] truncate">{o.address}, {o.district}</p>
                                </div>
                              </td>
                              <td className="py-3 px-3 font-medium text-slate-800">
                                <p className="truncate max-w-[150px]">{o.offerName}</p>
                                <b className="font-mono text-indigo-600">৳{o.total}</b>
                              </td>
                              <td className="py-3 px-3">
                                <span className={`inline-flex items-center gap-1 py-0.5 px-2 rounded-full text-[9px] font-bold ${
                                  o.checkoutType === 'phone_1click' 
                                    ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                                    : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                }`}>
                                  {o.checkoutType === 'phone_1click' ? (
                                    <>
                                      <Smartphone className="w-2.5 h-2.5 text-purple-600" />
                                      <span>1-Click</span>
                                    </>
                                  ) : (
                                    <>
                                      <ShoppingBag className="w-2.5 h-2.5 text-indigo-600" />
                                      <span>WooCommerce</span>
                                    </>
                                  )}
                                </span>
                              </td>
                              <td className="py-3 px-3">
                                <select
                                  id={`wp-status-selector-${o.id}`}
                                  value={o.status}
                                  onChange={(e) => onUpdateStatus(o.id, e.target.value as LeadOrder['status'])}
                                  className={`text-[10px] font-bold rounded px-1.5 py-0.5 border outline-none bg-white cursor-pointer ${
                                    o.status === 'Pending Verification' 
                                      ? 'text-amber-700 border-amber-200 bg-amber-50/50' 
                                      : o.status === 'Processing' 
                                        ? 'text-sky-700 border-sky-200 bg-sky-50/50' 
                                        : o.status === 'Shipped' 
                                          ? 'text-emerald-700 border-emerald-200 bg-emerald-50/50' 
                                          : 'text-rose-700 border-rose-200 bg-rose-50/50'
                                  }`}
                                >
                                  <option value="Pending Verification">⏳ Pending</option>
                                  <option value="Processing">⚙️ Processing</option>
                                  <option value="Shipped">🚚 Shipped</option>
                                  <option value="Cancelled">❌ Cancelled</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-500">
                    <p><i>* This simulator directly updates the browser local storage leads database.</i></p>
                    <button 
                      onClick={() => {
                        const testLead: LeadOrder = {
                          id: "WP-" + Math.floor(100000 + Math.random() * 900000),
                          customerName: "মোঃ আসাদুল হক শান্ত",
                          phoneNumber: "01755123456",
                          address: "রুম-৫০২, রহমান প্লাজা, লালবাগ",
                          district: "Dhaka",
                          offerName: "১টি সোলার এমার্জেন্সি লাইট (Standard Deal)",
                          itemsQuantity: 1,
                          subtotal: 1490,
                          shippingCost: 0,
                          discount: 0,
                          total: 1490,
                          checkoutType: "phone_1click",
                          paymentMethod: "Cash On Delivery (ক্যাশ অন ডেলিভারি)",
                          status: "Pending Verification",
                          createdAt: new Date().toISOString()
                        };
                        onAddOrder(testLead);
                        setSuccessMsg('১-ক্লিক ফোন অর্ডার সরাসরি উকমার্স সিস্টেমে সফলভাবে সিঙ্ক হয়েছে!');
                      }}
                      className="text-indigo-600 font-bold hover:underline"
                    >
                      + নতুন ১-ক্লিক অর্ডার (Simulate Lead)
                    </button>
                  </div>
                </div>

              </div>

              {/* Column 3: Right sidebar panel (Subscription control center & Landing Page Simulation (col-span-3)) */}
              <div className="lg:col-span-3 space-y-6">

                {/* Direct WordPress & Theme Zip Downloader Core Package block */}
                <div className="bg-gradient-to-b from-indigo-50 to-white border border-indigo-200 rounded-xl p-4 shadow-sm space-y-3.5">
                  <div className="flex justify-between items-center pb-2 border-b border-indigo-100">
                    <h5 className="font-extrabold text-indigo-950 text-xs flex items-center gap-1.5">
                      <FolderLock className="w-3.5 h-3.5 text-indigo-650 animate-pulse" />
                      <span>ডাউনলোড জিপ প্যাকেজ (ZIP Center)</span>
                    </h5>
                    <span className="text-[9px] bg-indigo-600 text-white font-black px-2 py-0.5 rounded-full uppercase">INSTALL NOW</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal font-medium">
                    ওয়ার্ডপ্রেসের প্লাগইন ডিরেক্টরিতে আপলোড করার জন্য চূড়ান্ত জিপ ফাইলগুলো এখান থেকে সরাসরি ১-ক্লিকে ডাউনলোড করুন:
                  </p>

                  <div className="space-y-2 pt-1 font-sans">
                    <button 
                      onClick={generatePluginZip}
                      disabled={zipping}
                      className="w-full flex items-center justify-between p-2.5 border border-indigo-200 hover:border-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all font-bold text-[11px] cursor-pointer bg-white text-indigo-950"
                    >
                      <span className="flex items-center gap-1.5">
                        <FolderLock className="w-3.5 h-3.5" />
                        <span>১-ক্লিক প্লাগইন জিপ (.zip)</span>
                      </span>
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button 
                      onClick={generateThemeZip}
                      disabled={zipping}
                      className="w-full flex items-center justify-between p-2.5 border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 rounded-xl transition-all font-semibold text-[11px] cursor-pointer bg-white"
                    >
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-emerald-600" />
                        <span>কম্প্যানিয়ন থিম জিপ (.zip)</span>
                      </span>
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button 
                      onClick={handleDownloadElementor}
                      className="w-full flex items-center justify-between p-2.5 border border-slate-200 hover:border-indigo-600 hover:bg-slate-50 text-slate-705 hover:text-indigo-800 rounded-xl transition-all font-medium text-[11px] cursor-pointer bg-white"
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>এলিমেন্টর টেমপ্লেট (.json)</span>
                      </span>
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="bg-slate-100 p-2 rounded-lg text-[10px] text-slate-500 font-mono text-center">
                    {zipping ? (
                      <span className="text-indigo-600 font-bold">প্যাকেজিং হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন</span>
                    ) : (
                      <span>Format: WordPress Repository Compliant</span>
                    )}
                  </div>
                </div>
                
                {/* 1. Quick Subscription Selector right on Home Tab */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-600" />
                      <span>প্লাগইন সাবস্ক্রিপশন</span>
                    </h5>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full uppercase">প্ল্যান</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    ওয়ার্ডপ্রেসের প্রোডাক্ট লিমিট বাড়ানোর জন্য প্ল্যান পরিবর্তন করুন:
                  </p>
                  
                  <div className="space-y-2">
                    {plans.map(p => (
                      <button
                        key={p.id}
                        onClick={() => { 
                          setSelectedPlanId(p.id); 
                          setSuccessMsg(`WordPress license updated to ${p.name}! (Limit: ${p.productLimit} Products)`); 
                        }}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs flex justify-between items-center ${
                          selectedPlanId === p.id 
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-extrabold shadow-sm' 
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-bold flex items-center gap-1.5">
                            <span>{p.name}</span>
                            {p.id === selectedPlanId && <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>}
                          </div>
                          <p className="text-[10px] text-slate-500 font-normal mt-0.5">{p.productLimit}টি প্রোডাক্ট লিমিট</p>
                        </div>
                        <span className="font-mono font-black text-indigo-650">৳{p.price}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Interactive Landing Page Lead Simulator Form */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                      <span>ল্যান্ডিং পেজ সিমুলেটর</span>
                    </h5>
                    <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">Live API</span>
                  </div>
                  <p className="text-[11px] text-slate-505 text-slate-500 leading-relaxed">
                    নিচের ফর্মটি পূরণ করে ল্যান্ডিং পেজে ক্রেতার ১-ক্লিক অর্ডার সাবমিশনের দৃশ্য ও এপিআই কানেকশন পরীক্ষা করুন:
                  </p>

                  <form onSubmit={handleSimulateLanderSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">ক্রেতার নাম (Name)</label>
                      <input
                        required
                        type="text"
                        value={simName}
                        onChange={(e) => setSimName(e.target.value)}
                        placeholder="যেমনঃ মোঃ সাইদুর রহমান"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">মোবাইল নাম্বার (Phone)</label>
                      <input
                        required
                        type="text"
                        value={simPhone}
                        onChange={(e) => setSimPhone(e.target.value)}
                        placeholder="017xxxxxxxx"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">ঠিকানা ও জেলা</label>
                      <input
                        required
                        type="text"
                        value={simAddress}
                        onChange={(e) => setSimAddress(e.target.value)}
                        placeholder="ঠিকানা লিখুন"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">প্যাকেজ ডিল সিলেক্ট করুন</label>
                      <select
                        value={simOffer}
                        onChange={(e) => setSimOffer(e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg bg-slate-50 text-xs"
                      >
                        <option value="pkg_1">১টি সোলার এমার্জেন্সি লাইট (৳1490)</option>
                        <option value="pkg_2">২টি ফ্যামিলি জ্যাম্বো ক্যাম্পিং ডিল (৳2690)</option>
                        <option value="pkg_3">৩টি মেগা ট্র্যাভেলার ব্যাকআপ ডিল (৳3850)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={simulatingLanderPost}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold rounded-lg flex items-center justify-center gap-1.5 transition-all text-[11px] cursor-pointer shadow-sm text-center"
                    >
                      {simulatingLanderPost ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>এপিআই সেন্ডিং হচ্ছে...</span>
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-3.5 h-3.5" />
                          <span>টেস্ট অর্ডার পাঠান (API Post)</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* 3. WooCommerce sync configurations */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-[11px] text-slate-705 space-y-2.5">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>WooCommerce API Specs</span>
                  </div>
                  <div className="space-y-1 text-[11px] leading-relaxed">
                    <p>✔ <b>Database Table:</b> <code>wp_ff_leads</code></p>
                    <p>✔ <b>Auto Sync:</b> <span className="text-emerald-700 font-bold">Enabled</span></p>
                    <p>✔ <b>Target Endpoint:</b> <code>phone-funnel/v1/lead</code></p>
                    <p>✔ <b>Security:</b> <code>SSL/OAuth token active</code></p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* TAB 2: Multi-Product Manager (Enforces Sub limits) */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 p-4 border border-slate-200 rounded-xl select-none">
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <span>ওয়ার্ডপ্রেস প্রোডাক্ট ইন্টিগ্রেশন ম্যানেজার</span>
                  <span className="text-xs font-mono font-black py-0.5 px-2.5 bg-indigo-100 text-indigo-700 border border-indigo-150 rounded">Enforced Limit</span>
                </h4>
                <p className="text-xs text-slate-500">
                  আপনার ল্যান্ডিং পেজে একাধিক প্রোডাক্ট প্যাকেজ এবং সোলার ডিল পরিচালনা করার জন্য প্রোডাক্ট আইডি কাস্টমাইজ করুন।
                </p>
              </div>
              <div className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold shrink-0">
                Products Limit Action: <code className="text-indigo-600 font-bold">{wpProducts.length} / {activePlan.productLimit} Products Used</code>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${wpProducts.length >= activePlan.productLimit ? 'bg-amber-500' : 'bg-indigo-600'}`}
                    style={{ width: `${Math.min(100, (wpProducts.length / activePlan.productLimit) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Product Creator Form */}
              <form onSubmit={handleAddProduct} className="lg:col-span-5 bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm">
                <h5 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-2">++ নতুন প্রোডাক্ট ডিল যোগ করুন</h5>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">প্রোডাক্ট এর নাম (Product Name) *</label>
                  <input
                    id="new-prod-name"
                    required
                    type="text"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="যেমনঃ 4-LED Solar Super-Bright Searchlight"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">প্রোডাক্ট কোড বা SKU *</label>
                    <input
                      id="new-prod-sku"
                      required
                      type="text"
                      value={newProdSku}
                      onChange={(e) => setNewProdSku(e.target.value)}
                      placeholder="যেমনঃ SL-LAMP-JUMBO"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">দাম (Price BDT) *</label>
                    <input
                      id="new-prod-price"
                      required
                      type="number"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(Number(e.target.value))}
                      placeholder="1490"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ল্যান্ডিং পেজ কাস্টম ইউআরএল (Optional URL)</label>
                  <input
                    id="new-prod-url"
                    type="text"
                    value={newProdUrl}
                    onChange={(e) => setNewProdUrl(e.target.value)}
                    placeholder="যেমনঃ /solar-light-offer"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <button
                  id="submit-new-product-btn"
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-lg shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>ওয়ার্ডপ্রেস প্রোডাক্ট যুক্ত করুন (Add Product)</span>
                </button>
              </form>

              {/* Product Inventory Table List in simulation */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <h5 className="font-bold text-slate-900 border-b border-slate-100 pb-2 flex justify-between items-center">
                  <span>অ্যাক্টিভ প্রোডাক্টস ডাটাবেজ</span>
                  <span className="text-xs text-slate-500 font-mono font-medium">Used products: {wpProducts.length}</span>
                </h5>

                {wpProducts.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    <AlertTriangle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-600">কোনো প্রোডাক্ট যোগ করা হয়নি</p>
                    <p className="text-[11px] text-slate-400">বাঁদিকের ফরমটি পূরণ করে কাস্টম সোলার লাইট বা ডিল তৈরি করুন।</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto pr-1">
                    {wpProducts.map(p => (
                      <div key={p.id} className="py-3 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-slate-900">{p.name}</p>
                          <p className="font-mono text-slate-400 text-[10px] uppercase mt-0.5">SKU: <b>{p.sku}</b> • Landers: <span className="text-slate-500 font-semibold">{p.landingPageUrl}</span></p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-mono font-bold text-indigo-600">৳{p.price}</span>
                          <button
                            id={`delete-product-sim-${p.id}`}
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1 px-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-200 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB: Courier Portal (Pathao & Steadfast APIs) */}
        {activeTab === 'courier' && (
          <div className="space-y-6 animate-fadeIn text-slate-800">
            {/* 1. Header Banner */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 p-4 border border-slate-200 rounded-xl select-none">
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-indigo-600" />
                  <span>কুরিয়ার বুকিং ও অটো-ডিসপ্যাচ হাব (Courier API Gateway)</span>
                </h4>
                <p className="text-xs text-slate-500">
                  বাংলাদেশী কুরিয়ার কোম্পানি পাঠাও (Pathao) এবং স্টিডফাস্ট (Steadfast) এপিআই ব্যবহার করে ল্যান্ডিং পেইজের কাস্টমার অর্ডারসমূহ সরাসরি বুকিং ও ট্র্যাকিং করুন।
                </p>
              </div>
              <div className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-150 py-1.5 px-3 rounded-lg font-bold">
                কুরিয়ার বুকিং એపిআই স্ট্যাটাস: <span className="font-mono text-emerald-600">Active (v1.0)</span>
              </div>
            </div>

            {/* 2. Grid Layout with Credential Settings and Order Booker */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Column Left: Credentials Setup */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Selector Buttons */}
                <div className="bg-white border border-slate-200 p-1.5 rounded-xl flex gap-1 shadow-sm">
                  <button
                    onClick={() => setCourierBrand('pathao')}
                    className={`flex-1 py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      courierBrand === 'pathao'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-transparent text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    <span>Pathao Courier</span>
                  </button>
                  <button
                    onClick={() => setCourierBrand('steadfast')}
                    className={`flex-1 py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      courierBrand === 'steadfast'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-transparent text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Steadfast API</span>
                  </button>
                </div>

                {/* Pathao Setup Panel */}
                {courierBrand === 'pathao' && (
                  <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm relative overflow-hidden">
                    <div className="absolute right-0 top-0 -translate-y-2 translate-x-2 bg-red-100/50 py-1 px-3 text-[9px] text-red-600 font-bold uppercase rounded-bl-lg">
                      Official Aladdin API
                    </div>
                    <div>
                      <h5 className="font-black text-rose-600 text-sm flex items-center gap-1.5">
                        <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">1</span>
                        <span>পাঠাও এপিআই সেটআপ (Credentials)</span>
                      </h5>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                        পাঠাও মার্চেন্ট প্যানেল (Aladdin Courier) থেকে সংগৃহীত এপিআই কী-সমূহ বসিয়ে কানেকশন টেস্ট করুন।
                      </p>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">মার্চেন্ট বা স্টোর আইডি (Store ID)</label>
                        <input
                          type="text"
                          value={pathaoStoreId}
                          onChange={(e) => setPathaoStoreId(e.target.value)}
                          placeholder="e.g. 14925"
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1">Client ID</label>
                          <input
                            type="password"
                            value={pathaoClientId}
                            onChange={(e) => setPathaoClientId(e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1">Client Secret</label>
                          <input
                            type="password"
                            value={pathaoClientSecret}
                            onChange={(e) => setPathaoClientSecret(e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center bg-slate-50 p-2 border border-slate-200 rounded-lg">
                        <span className="text-[10px] font-bold text-slate-500">API Run Environment</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setPathaoMode('sandbox')}
                            className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase transition-colors cursor-pointer ${
                              pathaoMode === 'sandbox' ? 'bg-amber-100 text-amber-800 font-extrabold' : 'bg-transparent text-slate-400'
                            }`}
                          >
                            Sandbox
                          </button>
                          <button
                            type="button"
                            onClick={() => setPathaoMode('production')}
                            className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase transition-colors cursor-pointer ${
                              pathaoMode === 'production' ? 'bg-indigo-100 text-indigo-800 font-extrabold' : 'bg-transparent text-slate-400'
                            }`}
                          >
                            Production
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleTestCourierConnection('pathao')}
                          disabled={testingConnection}
                          className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] rounded-lg border border-slate-300 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        >
                          <RefreshCw className={`w-3 h-3 ${testingConnection && 'animate-spin'}`} />
                          <span>কানেকশন টেস্ট করুন</span>
                        </button>
                        <div className={`px-3 py-1.5 rounded-lg border text-[11px] font-black flex items-center gap-1 ${
                          pathaoConnected ? 'bg-emerald-50 border-emerald-250 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${pathaoConnected ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'}`}></span>
                          <span>{pathaoConnected ? 'Connected' : 'Offline'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Steadfast Setup Panel */}
                {courierBrand === 'steadfast' && (
                  <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm relative overflow-hidden">
                    <div className="absolute right-0 top-0 -translate-y-2 translate-x-2 bg-emerald-100/50 py-1 px-3 text-[9px] text-emerald-700 font-bold uppercase rounded-bl-lg">
                      Fastest Delivery BD
                    </div>
                    <div>
                      <h5 className="font-black text-emerald-700 text-sm flex items-center gap-1.5">
                        <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">1</span>
                        <span>স্টিডফাস্ট এপিআই সেটআপ (Credentials)</span>
                      </h5>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                        স্টিডফাস্ট মার্চেন্ট পোর্টাল থেকে সংগৃহীত এপিআই সিক্রেট বসিয়ে কানেকশন টেস্ট করুন।
                      </p>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">মার্চেন্ট এপিআই কি (API Key)</label>
                        <input
                          type="password"
                          value={steadfastApiKey}
                          onChange={(e) => setSteadfastApiKey(e.target.value)}
                          placeholder="e.g. sf_api_some_string"
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">সিক্রেট কি (Secret Key)</label>
                        <input
                          type="password"
                          value={steadfastSecretKey}
                          onChange={(e) => setSteadfastSecretKey(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
                        />
                      </div>

                      <div className="flex justify-between items-center bg-slate-50 p-2 border border-slate-200 rounded-lg">
                        <span className="text-[10px] font-bold text-slate-500">API Mode</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setSteadfastMode('sandbox')}
                            className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase transition-colors cursor-pointer ${
                              steadfastMode === 'sandbox' ? 'bg-amber-100 text-amber-800 font-extrabold' : 'bg-transparent text-slate-400'
                            }`}
                          >
                            Sandbox
                          </button>
                          <button
                            type="button"
                            onClick={() => setSteadfastMode('production')}
                            className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase transition-colors cursor-pointer ${
                              steadfastMode === 'production' ? 'bg-indigo-100 text-indigo-800 font-extrabold' : 'bg-transparent text-slate-400'
                            }`}
                          >
                            Production
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleTestCourierConnection('steadfast')}
                          disabled={testingConnection}
                          className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] rounded-lg border border-slate-300 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        >
                          <RefreshCw className={`w-3 h-3 ${testingConnection && 'animate-spin'}`} />
                          <span>কানেকশন টেস্ট করুন</span>
                        </button>
                        <div className={`px-3 py-1.5 rounded-lg border text-[11px] font-black flex items-center gap-1 ${
                          steadfastConnected ? 'bg-emerald-50 border-emerald-250 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${steadfastConnected ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'}`}></span>
                          <span>{steadfastConnected ? 'Connected' : 'Offline'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Simulated Terminal logs container */}
                {consoleOpen && (
                  <div className="bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[10px] rounded-xl p-3 shadow space-y-1">
                    <div className="flex justify-between items-center border-b border-slate-850 pb-1.5 mb-1.5 text-slate-500 text-[9px]">
                      <span className="flex items-center gap-1">
                        <Terminal className="w-3 h-3 text-emerald-400 animate-pulse" />
                        <span>LIVE API REQUEST CONSOLE LOGS</span>
                      </span>
                      <button onClick={() => setConsoleOpen(false)} className="hover:text-white uppercase font-bold text-[8px] cursor-pointer">Close ✕</button>
                    </div>
                    {apiConsoleRequest && (
                      <div className="space-y-1">
                        <p className="text-teal-400">⚡ API Request Headers & Payload POST:</p>
                        <pre className="p-1.5 bg-slate-950 rounded text-slate-300 max-h-[80px] overflow-y-auto whitespace-pre-wrap">{apiConsoleRequest}</pre>
                      </div>
                    )}
                    {apiConsoleResponse ? (
                      <div className="space-y-1 pt-1.5">
                        <p className="text-emerald-400">✔ API Success Response Payload RECEIVED:</p>
                        <pre className="p-1.5 bg-slate-950 rounded text-slate-350 max-h-[100px] overflow-y-auto whitespace-pre-wrap">{apiConsoleResponse}</pre>
                      </div>
                    ) : (
                      testingConnection || bookingInProgress ? (
                        <p className="text-amber-500 animate-pulse">⚙️ এপিআই রিকুয়েস্ট পাঠানো হচ্ছে... তথ্য যাচাই করা হচ্ছে...</p>
                      ) : null
                    )}
                  </div>
                )}

              </div>

              {/* Column Right: Dispatch Order & Consignment Management */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Order Booker Form panel */}
                <form onSubmit={handleDispatchCourier} className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm relative">
                  <div>
                    <h5 className="font-extrabold text-slate-950 text-sm flex items-center gap-1.5">
                      <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">2</span>
                      <span>নতুন কুরিয়ার বুকিং তৈরি করুন (Dispatch Lead)</span>
                    </h5>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                      ওয়ার্ডপ্রেস / উকমার্স ডাটাবেজের যে কোনো পেন্ডিং লিড নির্বাচন করে সরাসরি বুকিং পাঠান:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">অর্ডার চয়ন করুন (Select Lead Order)</label>
                      <select
                        required
                        value={selectedBookingOrderId}
                        onChange={(e) => setSelectedBookingOrderId(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                      >
                        <option value="">-- অর্ডার চয়ন করুন --</option>
                        {orders
                          .filter(o => o.status !== 'Shipped' && o.status !== 'Cancelled')
                          .map(o => (
                            <option key={o.id} value={o.id}>
                              {o.id} - {o.customerName} (৳{o.total} • Status: {o.status})
                            </option>
                          ))
                        }
                      </select>
                      {orders.filter(o => o.status !== 'Shipped' && o.status !== 'Cancelled').length === 0 && (
                        <p className="text-[10px] text-amber-600 font-bold mt-1">⏳ কোনো পেন্ডিং অর্ডার নেই! নতুন অর্ডার সিমুলেট করুন।</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">শিপিং কুরিয়ার কোম্পানি</label>
                      <div className="py-1.5 px-3 border border-slate-200 bg-slate-50 text-slate-750 font-extrabold rounded-lg text-xs font-black capitalize flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{courierBrand} Delivery API</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {courierBrand === 'pathao' ? (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">পাঠাও সার্ভিস টাইপ (Service Type)</label>
                        <select
                          value={courierServiceType}
                          onChange={(e) => setCourierServiceType(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                        >
                          <option value="normal">Normal Home Delivery (48 Hours)</option>
                          <option value="same_day">Same Day Express Delivery (Dhaka Only)</option>
                          <option value="next_day">Next Day Priority</option>
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-705 mb-1">স্টিডফাস্ট সার্ভিস টাইপ</label>
                        <div className="py-2 px-3 border border-slate-200 bg-slate-50 text-slate-600 rounded-lg italic">
                          Standard Cash On Delivery (COD)
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">প্যাকেজের ওজন (Parcel Weight - KG)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        max="10"
                        value={parcelWeight}
                        onChange={(e) => setParcelWeight(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-bold text-indigo-700"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={bookingInProgress || !selectedBookingOrderId}
                    className="w-full py-2 bg-indigo-650 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold rounded-lg flex items-center justify-center gap-1.5 transition-all text-xs cursor-pointer shadow"
                  >
                    {bookingInProgress ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>কুরিয়ার এপিআই বুকিং হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>কুরিয়ার এপিআই সাবমিট করুন (Dispatch to Courier)</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Consignment tracking list */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                  <h5 className="font-bold text-slate-900 border-b border-slate-100 pb-2 flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-slate-800">
                      <Activity className="w-4 h-4 text-rose-500 animate-pulse" />
                      <span>কুরিয়ার কনসাইনমেন্ট ট্র্যাকিং ট্র্যাকার</span>
                    </span>
                    <span className="text-xs text-slate-500 font-mono font-medium">Booked: {consignments.length} IDs</span>
                  </h5>

                  {consignments.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 border border-dashed rounded-lg border-slate-200">
                      <Truck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-650">কোনো বুকিং ট্র্যাক রেকর্ড নেই</p>
                      <p className="text-[10px] text-slate-400">ওপরের ফরমটি ব্যবহার করে অর্ডার বুক করুন।</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto pr-1">
                      {consignments.map(c => {
                        const feeColor = c.courier === 'Pathao' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-800 border-emerald-250';
                        return (
                          <div key={c.consignmentId} className="py-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-slate-900 font-mono">{c.consignmentId}</span>
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${feeColor}`}>
                                  {c.courier}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 mt-1">
                                order: <b className="text-indigo-650 font-mono font-bold">{c.orderId}</b> • {c.serviceType} • {c.weight} • Cost: ৳{c.fee}
                              </p>
                            </div>
                            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end shrink-0">
                              <span className="text-[10px] font-bold text-slate-500 italic shrink-0">
                                Status Sync:
                              </span>
                              <select
                                value={c.status}
                                onChange={(e) => handleChangeConsignmentStatus(c.consignmentId, e.target.value)}
                                className={`text-[10px] font-black rounded px-1.5 py-1 bg-white border border-slate-300 outline-none w-[110px] cursor-pointer ${
                                  c.status === 'Delivered' 
                                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
                                    : c.status === 'In Transit' 
                                      ? 'text-sky-700 bg-sky-50 border-sky-200' 
                                      : c.status === 'Returned' 
                                        ? 'text-rose-700 bg-rose-50 border-rose-200' 
                                        : 'text-amber-800 bg-amber-50 border-amber-200'
                                }`}
                              >
                                <option value="Dispatched">Dispatched</option>
                                <option value="In Transit">In Transit</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Returned">Returned</option>
                              </select>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* PHP REST integration references */}
                <div className="bg-slate-900 text-slate-300 p-5 rounded-xl space-y-3 shadow-inner">
                  <h6 className="font-bold text-xs text-white flex items-center gap-1.5 font-mono">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Real-World WordPress API Sync Hook (PHP) 🪝</span>
                  </h6>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    আপনার উকমার্স সাইটে ড্যাশবোর্ড বা অর্ডার কমপ্লিট হলে পাঠাও কুরিয়ার এপিআই বুকিং স্বয়ংক্রিয় করার অফিশিয়াল PHP কোড snippet:
                  </p>
                  <div className="bg-slate-950 p-3.5 rounded-lg font-mono text-[10px] overflow-x-auto text-slate-300 h-[100px] overflow-y-auto">
                    <pre>{`// WooCommerce Hook: Mark order dispatched to Pathao API
add_action('woocommerce_order_status_processing', 'auto_dispatch_to_pathao', 10, 1);
function auto_dispatch_to_pathao($order_id) {
    $order = wc_get_order($order_id);
    
    // 1. Get Access Token from Pathao Aladdin API
    $token_response = wp_remote_post('https://openapi.pathao.com/aladdin/api/v1/issue-token', [
        'body' => json_encode([
            'client_id' => '${pathaoClientId}',
            'client_secret' => '${pathaoClientSecret}',
            'grant_type' => 'client_credentials'
        ]),
        'headers' => ['Content-Type' => 'application/json']
    ]);
    
    $token_data = json_decode(wp_remote_retrieve_body($token_response));
    $token = $token_data->data->access_token;
    
    // 2. Dispatch consignment to Pathao
    $response = wp_remote_post('https://openapi.pathao.com/aladdin/api/v1/orders', [
        'headers' => [
            'Authorization' => 'Bearer ' . $token,
            'Content-Type' => 'application/json'
        ],
        'body' => json_encode([
            'store_id' => ${pathaoStoreId},
            'recipient_name' => $order->get_billing_first_name() . " " . $order->get_billing_last_name(),
            'recipient_phone' => $order->get_billing_phone(),
            'recipient_address' => $order->get_billing_address_1() . ", " . $order->get_billing_city(),
            'amount_to_collect' => (float)$order->get_total(),
            'item_quantity' => 1,
            'item_weight' => 0.5
        ])
    ]);
    
    $consignment = json_decode(wp_remote_retrieve_body($response));
    update_post_meta($order_id, '_pathao_consignment_id', $consignment->data->consignment_id);
    $order->add_order_note('Pathao API booking issued! Tracking Consignment ID: ' . $consignment->data->consignment_id);
}`}</pre>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* TAB 3: Plan Upgrade limits */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs uppercase tracking-widest text-indigo-600 font-extrabold">Funnels Subscription Pricing</span>
              <h4 className="text-xl md:text-2xl font-black text-slate-900 mt-1">
                আপনার ব্যবসার আকার অনুযায়ী সঠিক প্ল্যান বেছে নিন
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                পদ্ধতিটি সাশ্রয়ী রাখতে প্রতিটি প্ল্যানের চার্জ অত্যন্ত নিখুঁতভাবে নির্ধারণ করা হয়েছে।
              </p>
            </div>

            {/* Visual Pricing Grid cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map(p => (
                <div
                  key={p.id}
                  onClick={() => { setSelectedPlanId(p.id); setSuccessMsg(`WordPress license upgraded dynamically to ${p.name}!`); }}
                  className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedPlanId === p.id 
                      ? 'bg-indigo-50/50 border-indigo-600 shadow-md shadow-indigo-100' 
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  {p.badge && (
                    <span className="absolute -top-2.5 left-4 px-2.5 py-0.5 bg-indigo-600 text-white text-[9px] font-black uppercase rounded-full tracking-wider">
                      {p.badge}
                    </span>
                  )}

                  <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-extrabold text-sm uppercase text-slate-500">{p.name}</h5>
                        <p className="text-[11px] text-slate-400 mt-0.5">{p.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedPlanId === p.id ? 'bg-indigo-600 text-white' : 'text-transparent border-slate-300'
                      }`}>
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-3.5 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Monthly Price:</p>
                        <span className="text-2xl font-black text-slate-900 font-mono">৳{p.price}</span>
                        <span className="text-xs text-slate-500 font-medium"> / month</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
                    <p>✔ Active Products limit: <b>{p.productLimit} Max</b></p>
                    <p>✔ Active Landing Pages limit: <b>{p.landingPageLimit} Max</b></p>
                    <p>✔ Real-time Phone Funnel APIs: <b>Included</b></p>
                  </div>
                </div>
              ))}
            </div>

            {/* SaaS Developer Licensing Controls and Downloader Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Box 1: Downloader Buttons */}
              <div className="bg-white border text-slate-800 border-slate-200 p-5 rounded-xl shadow-sm space-y-4">
                <h5 className="font-bold text-slate-900 flex items-center gap-2">
                  <FolderLock className="w-5 h-5 text-indigo-600" />
                  <span>WordPress & Elementor ডিস্ট্রিবিউশন সামগ্রী</span>
                </h5>
                <p className="text-xs text-slate-500 leading-relaxed">
                  আপনার ক্লায়েন্ট সাইটে ইনস্টল করতে বা রিয়েল সার্ভার টেস্ট করতে জিপ এবং এলিমেন্টর টেমপ্লেট ফাইলগুলি ব্যবহার করুন।
                </p>
                <div className="space-y-2 pt-2">
                  <button onClick={generatePluginZip} className="w-full flex items-center justify-between p-3 border border-slate-200 hover:border-indigo-600 hover:bg-slate-50/20 text-slate-700 hover:text-indigo-800 rounded-xl transition-all font-semibold text-xs cursor-pointer bg-white">
                    <span className="flex items-center gap-2">
                      <FolderLock className="w-4 h-4 text-indigo-600 animate-pulse" />
                      <span>WordPress Plugin (phone-funnel-pro.zip)</span>
                    </span>
                    <Download className="w-4 h-4" />
                  </button>

                  <button onClick={generateThemeZip} className="w-full flex items-center justify-between p-3 border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/20 text-slate-700 hover:text-indigo-800 rounded-xl transition-all font-semibold text-xs cursor-pointer bg-white">
                    <span className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-600 font-black animate-pulse" />
                      <span>Companion WordPress Theme (phone-funnel-theme.zip)</span>
                    </span>
                    <Download className="w-4 h-4" />
                  </button>

                  <button onClick={handleDownloadElementor} className="w-full flex items-center justify-between p-3 border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/20 text-slate-700 hover:text-indigo-800 rounded-xl transition-all font-semibold text-xs cursor-pointer bg-white">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Elementor JSON landing template (.json)</span>
                    </span>
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Box 2: Licensing validation */}
              <div className="bg-white border text-slate-800 border-slate-200 p-5 rounded-xl shadow-sm space-y-4">
                <h5 className="font-bold text-slate-900 flex items-center gap-2">
                  <Key className="w-5 h-5 text-indigo-650" />
                  <span>প্লাগইন লাইসেন্স ও এপিআই অ্যাক্টিভেশন</span>
                </h5>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  আপনার প্লাগইনের প্রিমিয়াম ফিচারসমূহ সক্রিয় রাখতে এবং রিয়েল-টাইম উকমার্স সিঙ্কর সচল রাখতে লাইসেন্স পরিবর্তন করুন।
                </p>
                <div className="space-y-3 pt-1">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-[10px] text-slate-650 flex justify-between items-center select-none">
                    <span>Active License Signature:</span> <span className="text-indigo-650 font-black">{licenseKey}</span>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <input type="text" placeholder="যেমন: PP-STARTER-..." value={licenseKeyInput} onChange={(e) => setLicenseKeyInput(e.target.value)} className="flex-1 p-2 focus:ring-1 focus:ring-indigo-600 focus:outline-none border border-slate-200 rounded-lg text-slate-800 font-mono" />
                    <button type="button" onClick={() => {
                      if (!licenseKeyInput) {
                        setErrorMsg('লাইসেন্স কী ইনপুট দিন!');
                        return;
                      }
                      const cleanKey = licenseKeyInput.trim().toUpperCase();
                      if (cleanKey.startsWith('PP-')) {
                        setLicenseKey(cleanKey);
                        setLicenseVerificationLogs([
                          `System: New License detected - ${cleanKey}`,
                          `System: Validation request sent to SaaS key provider...`,
                          `System: Key Verified. Subscription limits updated successfully!`,
                          ...licenseVerificationLogs
                        ]);
                        setSuccessMsg('প্লাগইন লাইসেন্স কী সাফল্যের সাথে পরিবর্তন ও সক্রিয় হয়েছে!');
                        setLicenseKeyInput('');
                      } else {
                        setErrorMsg('অকার্যকর লাইসেন্স কী! আপনার প্রিজার্ভড কি "PP-" দিয়ে শুরু হতে হবে।');
                      }
                    }} className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-4 rounded-lg transition-colors cursor-pointer text-xs">Verify</button>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 text-[10px] font-mono text-indigo-400 overflow-y-auto h-20 space-y-1">
                    <p className="text-slate-500 font-semibold border-b border-slate-900 pb-1 flex justify-between select-none">
                      <span>LICENSING SYSTEM LOGS</span> <span>UTC</span>
                    </p>
                    {licenseVerificationLogs.map((log, i) => (
                      <p key={i}>⏱ {log}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Webhook integrator checklist */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-3 mt-8">
              <h5 className="font-bold text-slate-900 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-600" />
                <span>How to link the 1-Click Landing Page with your Wordpress DB API</span>
              </h5>
              <p className="text-xs text-slate-650 leading-relaxed">
                প্লাগইনটি ওয়ার্ডপ্রেসে ইনস্টল করার পর আপনার ল্যান্ডিং পেজের সাবমিট বাটনের জন্য এই API হ্যান্ডলারটি ব্যবহার করুন:
              </p>
              
              <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-xs overflow-x-auto relative">
                <pre>{`fetch('https://your-wordpress-site.com/wp-json/phone-funnel/v1/lead', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    customer_name: "Abir Ahmed",
    phone_number: "01725489632",
    address: "Mirpur 10, Block C",
    district: "Dhaka",
    offer_name: "${wpProducts[0]?.name || 'Solar Light Standard Deal'}",
    total_price: ${wpProducts[0]?.price || '1490'},
    checkout_type: "phone_1click"
  })
})
.then(res => res.json())
.then(data => console.log('Order Synchronized on WP!', data));`}</pre>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: Landers Page Builder Maker */}
        {activeTab === 'landers' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4 mb-6">
                <div>
                  <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-indigo-600" />
                    <span>১-ক্লিক ল্যান্ডিং পেজ মেকার (Page Templates Manager)</span>
                  </h4>
                  <p className="text-xs text-slate-550 mt-1">
                    আপনার বর্তমান প্ল্যান অনুযায়ী ল্যান্ডিং পেজ কাস্টম সোর্স তৈরি এবং কনফিগার করতে পারবেন।
                  </p>
                </div>
                <div className="bg-indigo-100 text-indigo-850 border border-indigo-200 py-1.5 px-3 rounded-full text-xs font-black">
                  সীমা: {wpLanders.length} / {activePlan.landingPageLimit} তৈরি হয়েছে
                </div>
              </div>

              {/* Add lander form */}
              <form onSubmit={(e) => {
                e.preventDefault();
                setErrorMsg('');
                setSuccessMsg('');
                if(!newLanderName || !newLanderSlug) {
                  setErrorMsg('ল্যান্ডিং পেজের নাম ও URL স্ল্যাগ আবশ্যক!');
                  return;
                }
                if(wpLanders.length >= activePlan.landingPageLimit) {
                  setErrorMsg(`সীমা অতিক্রম হয়েছে! আপনার বর্তমান ${activePlan.name} এ সর্বোচ্চ ${activePlan.landingPageLimit}টি ল্যান্ডিং পেজ তৈরি করা সম্ভব। দয়া করে লাইসেন্স প্ল্যান আপগ্রেড করুন।`);
                  return;
                }
                const slugClean = newLanderSlug.toLowerCase().replace(/[^a-z0-9-_]/g, '');
                const newLander = {
                  id: 'l' + Math.random().toString(),
                  name: newLanderName,
                  productSku: newLanderProductSku,
                  slug: slugClean,
                  themeOverride: 'page-solar-pro.php',
                  active: true
                };
                setWpLanders([...wpLanders, newLander]);
                setSuccessMsg(`"${newLanderName}" ল্যান্ডিং পেজটি সাফল্যের সাথে তৈরি হয়েছে এবং স্ল্যাগ নির্ধারণ করা হয়েছে: /${slugClean}`);
                setNewLanderName('');
                setNewLanderSlug('');
              }} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-white p-4 border border-slate-200 rounded-xl mb-6 shadow-sm">
                <div className="space-y-1.5 text-left">
                  <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase">ল্যান্ডিং পেজের শিরোনাম</label>
                  <input type="text" placeholder="যেমন: Solar Heavy Duty Camper Deluxe" value={newLanderName} onChange={(e) => setNewLanderName(e.target.value)} className="w-full text-xs p-2 focus:ring-1 focus:ring-indigo-600 focus:outline-none border border-slate-200 rounded-lg text-slate-800" />
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase">URL স্ল্যাগ (Slug)</label>
                  <input type="text" placeholder="যেমন: solar-camper-deluxe" value={newLanderSlug} onChange={(e) => setNewLanderSlug(e.target.value)} className="w-full text-xs p-2 focus:ring-1 focus:ring-indigo-600 focus:outline-none border border-slate-200 rounded-lg text-indigo-700 font-mono" />
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase">সংযুক্ত পণ্য SKU</label>
                  <select value={newLanderProductSku} onChange={(e) => setNewLanderProductSku(e.target.value)} className="w-full text-xs p-2 focus:ring-1 focus:ring-indigo-600 focus:outline-none border border-slate-200 rounded-lg bg-white text-slate-700">
                    {wpProducts.map(p => (
                      <option key={p.id} value={p.sku}>{p.name} ({p.sku})</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="bg-indigo-600 text-white font-extrabold p-2 rounded-lg text-xs hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer h-9 mb-0.5">
                  <Plus className="w-4 h-4" />
                  নতুন ল্যান্ডিং পেজ তৈরি করুন
                </button>
              </form>

              {/* Landers lists */}
              <div className="bg-white border text-slate-800 border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-3.5 bg-slate-100 font-bold text-xs text-slate-550 uppercase tracking-wider border-b border-slate-200 text-left">
                  সক্রিয় ল্যান্ডিং পেজ টেমপ্লেটস তালিকা
                </div>
                {wpLanders.length === 0 ? (
                  <p className="p-8 text-center text-xs text-slate-400">কোনো ল্যান্ডিং পেজ টেমপ্লেট তৈরি করা হয়নি।</p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {wpLanders.map(l => (
                      <div key={l.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 hover:bg-slate-50 transition-colors text-xs text-left">
                        <div className="space-y-1">
                          <p className="font-extrabold text-slate-905 text-sm flex items-center gap-2">
                            <span>{l.name}</span>
                            <span className="bg-indigo-50 text-indigo-700 font-mono text-[9px] py-0.5 px-2 rounded-full border border-indigo-100 uppercase font-black">{l.slug}</span>
                          </p>
                          <p className="text-[10px] font-medium text-slate-500">
                            <b>URL গন্তব্য :</b> <span className="text-indigo-600 font-mono">https://your-wordpress-site.com/{l.slug}</span>
                          </p>
                          <p className="text-[10px] text-slate-400">
                            পণ্য অ্যাসোসিয়েশন: <b>{l.productSku}</b> • টেমপ্লেট ওভাররাইড: <span className="font-mono bg-slate-50 border p-0.5 px-1.5 rounded">{l.themeOverride}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => {
                            setWpLanders(wpLanders.filter(x => x.id !== l.id));
                            setSuccessMsg(`ল্যান্ডিং পেজ "${l.name}" ডিলিট করা হয়েছে!`);
                          }} className="p-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer" title="Delete Lander">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: WordPress Blog Posts Manager */}
        {activeTab === 'posts' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-6 text-left">
                <div>
                  <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <span>ব্লগ ও আর্টিকেল পাবলিশার (WordPress Articles Editor)</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    প্লাগইনে কোনো অর্ডার রিসিভ হলে ব্লগ পোস্টের মাধ্যমে কাস্টমারদের অবগত রাখতে কাস্টম কন্টেন্ট লিখুন।
                  </p>
                </div>
              </div>

              {/* Add post form */}
              <form onSubmit={(e) => {
                e.preventDefault();
                setErrorMsg('');
                setSuccessMsg('');
                if(!newPostTitle) {
                  setErrorMsg('পোস্টের শিরোনাম আবশ্যক!');
                  return;
                }
                const newPost = {
                  id: Math.random().toString(),
                  title: newPostTitle,
                  category: newPostCategory,
                  author: 'admin',
                  content: newPostContent || 'অসাধারণ একটি কন্টেন্ট...',
                  status: 'Published',
                  date: new Date().toISOString().split('T')[0]
                };
                setWpPosts([newPost, ...wpPosts]);
                setSuccessMsg(`"${newPostTitle}" পোস্টটি সাফল্যের সাথে ব্লগে পাবলিশ করা হয়েছে!`);
                setNewPostTitle('');
                setNewPostContent('');
              }} className="space-y-4 bg-white p-5 border border-slate-200 rounded-xl mb-6 shadow-sm text-left">
                <p className="font-extrabold text-xs text-slate-850 uppercase tracking-widest">নতুন ব্লগ পোস্ট ড্রাফট করুন</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase">পোস্টের শিরোনাম</label>
                    <input type="text" placeholder="যেমন: সেরা ই-কমার্স সোলার লাইট গাইড" value={newPostTitle} onChange={(e) => setNewPostTitle(e.target.value)} className="w-full text-xs p-2.5 focus:ring-1 focus:ring-indigo-600 focus:outline-none border border-slate-200 rounded-lg bg-slate-50 text-slate-800" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase">ক্যাটাগরি</label>
                    <select value={newPostCategory} onChange={(e) => setNewPostCategory(e.target.value)} className="w-full text-xs p-2.5 focus:ring-1 focus:ring-indigo-600 focus:outline-none border border-slate-200 rounded-lg bg-white text-slate-700">
                      <option value="E-Commerce Tips">E-Commerce Tips</option>
                      <option value="Marketing Guides">Marketing Guides</option>
                      <option value="Technical Docs">Technical Docs</option>
                      <option value="Solar Updates">Solar Updates</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase">পোস্টের মূল বডি / কনটেন্ট</label>
                  <textarea rows={3} placeholder="আপনার কন্টেন্ট এখানে লিখুন..." value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} className="w-full text-xs p-2.5 focus:ring-1 focus:ring-indigo-600 focus:outline-none border border-slate-200 rounded-lg bg-slate-50 resize-none text-slate-800" />
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2 px-6 rounded-lg transition-all shadow cursor-pointer">
                    পোস্ট পাবলিশ করুন (Publish)
                  </button>
                </div>
              </form>

              {/* List of posts */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm text-left border-slate-200">
                <div className="p-3.5 bg-slate-100 font-bold text-xs text-slate-550 border-b border-slate-200 flex justify-between items-center uppercase tracking-wider">
                  <span>ওয়ার্ডপ্রেস পোস্টসমূহ</span>
                  <span className="font-mono lowercase text-[11px] text-indigo-600">{wpPosts.length} posts active</span>
                </div>
                <div className="divide-y divide-slate-150 text-xs">
                  {wpPosts.map(post => (
                    <div key={post.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                      <div className="space-y-1">
                        <h5 className="font-black text-slate-900 text-sm">{post.title}</h5>
                        <p className="text-[10px] text-slate-550">
                          লেখক: <b>{post.author}</b> • তারিখ: {post.date} • ক্যাটাগরি: <span className="bg-slate-100 font-semibold border text-slate-650 p-0.5 px-2 rounded-full text-[9px] uppercase">{post.category}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${post.status === 'Published' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-amber-50 border border-amber-200 text-amber-700'}`}>
                          {post.status}
                        </span>
                        <button onClick={() => {
                          setWpPosts(wpPosts.filter(p => p.id !== post.id));
                          setSuccessMsg(`আর্টিকেল "${post.title}" ডিলিট করা হয়েছে!`);
                        }} className="p-1.5 border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition-all cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 6: Media Library Manager */}
        {activeTab === 'media' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
              <div className="border-b border-slate-200 pb-4 mb-6 text-left">
                <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Image className="w-5 h-5 text-indigo-600" />
                  <span>মিডিয়া লাইব্রেরি (WordPress Media Vault)</span>
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  আপনার ল্যান্ডিং পেজে সুন্দর রেন্ডারিং এর জন্য পণ্য চিত্র, গিফটস এবং ব্যানার জেপিজি সরাসরি সংযুক্ত করুন।
                </p>
              </div>

              {/* Upload media simulator */}
              <form onSubmit={(e) => {
                e.preventDefault();
                setErrorMsg('');
                setSuccessMsg('');
                if(!newMediaName) {
                  setErrorMsg('ফাইল এর নাম আবশ্যক!');
                  return;
                }
                const nameClean = newMediaName.trim().replace(/\s+/g, '_');
                const newMed = {
                  id: 'm' + Math.random().toString(),
                  name: nameClean.endsWith('.png') || nameClean.endsWith('.jpg') ? nameClean : nameClean + '.png',
                  type: 'image/png',
                  size: newMediaSize,
                  date: new Date().toISOString().split('T')[0]
                };
                setWpMedia([newMed, ...wpMedia]);
                setSuccessMsg(`ফাইল "${newMed.name}" সফলভাবে মিডিয়া লাইব্রেরিতে আপলোড করা হয়েছে!`);
                setNewMediaName('');
              }} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-white p-4 border border-slate-200 rounded-xl mb-6 shadow-sm">
                <div className="space-y-1.5 text-left">
                  <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase">নতুন ফোটো ফাইলের নাম</label>
                  <input type="text" placeholder="যেমন: gift_box_banner.png" value={newMediaName} onChange={(e) => setNewMediaName(e.target.value)} className="w-full text-xs p-2 focus:ring-1 focus:ring-indigo-600 focus:outline-none border border-slate-200 rounded-lg bg-slate-50 text-slate-800" />
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase">ফাইল সাইজ নির্ধারণ</label>
                  <select value={newMediaSize} onChange={(e) => setNewMediaSize(e.target.value)} className="w-full text-xs p-2 focus:ring-1 focus:ring-indigo-600 focus:outline-none border border-slate-200 rounded-lg bg-white text-slate-705">
                    <option value="120 KB">120 KB (Small PNG)</option>
                    <option value="428 KB">428 KB (Medium Asset)</option>
                    <option value="1.2 MB">1.2 MB (High Res JPG)</option>
                  </select>
                </div>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer h-9 mb-0.5">
                  মিডিয়া হোস্টে আপলোড দিন
                </button>
              </form>

              {/* Grid representation */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {wpMedia.map(m => (
                  <div key={m.id} className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm text-center space-y-2 relative group hover:border-indigo-600/30 transition-all text-xs text-slate-800">
                    <div className="aspect-square bg-slate-50 rounded-lg flex items-center justify-center border border-dashed border-slate-200 select-none">
                      <span className="text-3xl text-slate-400 group-hover:scale-110 transition-transform">🖼</span>
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-800 truncate mb-0.5" title={m.name}>{m.name}</p>
                      <p className="text-[10px] font-mono text-slate-550">{m.size} • JPG</p>
                      <p className="text-[9px] text-slate-400 mt-1">{m.date}</p>
                    </div>
                    <button onClick={() => {
                      setWpMedia(wpMedia.filter(x => x.id !== m.id));
                      setSuccessMsg(`মিডিয়া ফাইল "${m.name}" ডিলিট করা হয়েছে!`);
                    }} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 bg-white hover:bg-rose-50 text-rose-600 border rounded shadow-sm transition-all cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* TAB 8: Live Customizer Responsive Preview */}
        {activeTab === 'live_preview' && (
          <div className="space-y-6 animate-fadeIn text-left">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4 mb-6">
                <div>
                  <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-indigo-600" />
                    <span>লাইভ ল্যান্ডিং পেজ সিমুলেটর (Live Responsive Web Preview)</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    আপনার ক্রেতারা এই ল্যান্ডিং পেজটি দেখতে পাবেন। নিচে মোবাইল বা ডেস্কটপ ভিউ সিলেক্ট করে রিয়েল-টাইমে চেকআউট টেস্ট করুন।
                  </p>
                </div>

                {/* Device Selector Controls */}
                <div className="flex bg-slate-100 p-1 rounded-xl items-center gap-1.5 self-stretch md:self-auto justify-center font-mono">
                  <button 
                    onClick={() => {
                      const el = document.getElementById('preview-mock-frame');
                      if(el) el.style.maxWidth = '100%';
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-800 shadow-sm border border-slate-200 hover:bg-slate-50"
                  >
                    🖥️ Desktop View
                  </button>
                  <button 
                    onClick={() => {
                      const el = document.getElementById('preview-mock-frame');
                      if(el) el.style.maxWidth = '450px';
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-800 shadow-sm border border-slate-200 hover:bg-slate-50"
                  >
                    📱 Mobile View
                  </button>
                </div>
              </div>

              {/* Simulated Browser Bar */}
              <div className="bg-slate-100 border border-slate-200 rounded-t-xl px-4 py-2 flex items-center gap-2 text-xs font-mono select-none">
                <div className="flex gap-1">
                  <span className="w-3 h-3 rounded-full bg-red-400"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                </div>
                <div className="flex-1 bg-white border border-slate-200 text-[11px] rounded px-3 py-1 text-slate-500 flex items-center gap-1.5 max-w-md mx-auto">
                  <span className="text-emerald-600 font-extrabold">🔒</span>
                  <span className="truncate">https://your-shop-site.com/solar-led-pro/</span>
                </div>
                <span className="text-slate-400">Visitor Mode</span>
              </div>

              {/* Wrapper simulating the device screen dimensions */}
              <div id="preview-mock-frame" className="w-full transition-all duration-300 mx-auto bg-white border-x border-b border-slate-200 rounded-b-xl shadow-lg overflow-hidden relative">
                
                {/* 1. TOP MARQUEE TICKER */}
                <Ticker position="top" />

                <main className="bg-slate-50 text-slate-900 min-h-screen selection:bg-indigo-600 selection:text-white antialiased pb-12">
                  
                  {/* HEADER HERO BANNER WRAPPER */}
                  <section className="bg-white border-b border-slate-200 overflow-hidden relative">
                    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 relative">
                      
                      {/* Decorative side lights */}
                      <div className="absolute top-10 right-1/4 w-72 h-72 bg-indigo-100/45 rounded-full blur-3xl pointer-events-none"></div>
                      <div className="absolute bottom-10 left-10 w-96 h-96 bg-slate-100/70 rounded-full blur-3xl pointer-events-none"></div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                        <div className="lg:col-span-12 space-y-4 text-left">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-black tracking-wider uppercase">
                            <Sparkles className="w-3 h-3 text-indigo-600 animate-pulse" />
                            <span>১০০% অরিজিনাল হেভি ডিউটি জ্যাম্বো সোলার লাইট</span>
                          </div>

                          <h1 className="text-2xl sm:text-3xl md:text-3xl font-black text-slate-900 leading-tight tracking-tight">
                            লোডশেডিং আর অন্ধকারেও জ্বলবে দিনের আলোয়! <br />
                            <span className="text-indigo-600 font-sans">
                              IP66 Waterproof 4-LED Solar Super-Bright Searchlight
                            </span>
                          </h1>

                          <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-sans">
                            লোডশেডিংয়ের যন্ত্রণা, দুর্গম রাস্তা বা রাতে ক্যাম্পিংয়ের দেশের সেরা সোলার সার্চলাইট। বিদ্যুৎ না থাকলেও সূর্যালোকেই অটো চার্জ হয়ে ব্যাকআপ দেয় একটানা ১০ থেকে ১২ ঘণ্টা!
                          </p>

                          {/* Gallery Thumb list */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                            <div className="sm:col-span-1 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center space-y-4">
                              <div className="aspect-square w-full bg-slate-50 flex items-center justify-center p-3">
                                <img 
                                  src={selectedGalleryImg === 'front' ? IMG_FRONT : selectedGalleryImg === 'back' ? IMG_BACK : IMG_USE} 
                                  alt="Solar charging beacon" 
                                  referrerPolicy="no-referrer"
                                  className="object-contain h-36 max-w-full hover:scale-105 transition-transform duration-300" 
                                />
                              </div>
                              <div className="grid grid-cols-3 gap-1.5 w-full">
                                <button onClick={() => setSelectedGalleryImg('front')} className={`py-1 rounded border text-[9px] font-bold ${selectedGalleryImg === 'front' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-500'}`}>Front</button>
                                <button onClick={() => setSelectedGalleryImg('back')} className={`py-1 rounded border text-[9px] font-bold ${selectedGalleryImg === 'back' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-500'}`}>Back</button>
                                <button onClick={() => setSelectedGalleryImg('use')} className={`py-1 rounded border text-[9px] font-bold ${selectedGalleryImg === 'use' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-500'}`}>Use Case</button>
                              </div>
                            </div>

                            <div className="sm:col-span-2 space-y-3 flex flex-col justify-center">
                              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">কনফিগারেশন সুবিধা সমূহ:</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                <div className="p-2 border rounded-lg bg-white flex items-center gap-2">
                                  <span className="text-emerald-500 font-bold">✔</span>
                                  <span>৪টি মাল্টি-মোড এলইডি মোড</span>
                                </div>
                                <div className="p-2 border rounded-lg bg-white flex items-center gap-2">
                                  <span className="text-emerald-500 font-bold">✔</span>
                                  <span>পলিসিলিকন সোলার সেল</span>
                                </div>
                                <div className="p-2 border rounded-lg bg-white flex items-center gap-2">
                                  <span className="text-emerald-500 font-bold">✔</span>
                                  <span>IP66 স্পেসিফিকেশন ওয়াটারপ্রুফ</span>
                                </div>
                                <div className="p-2 border rounded-lg bg-white flex items-center gap-2">
                                  <span className="text-emerald-500 font-bold">✔</span>
                                  <span>এমার্জেন্সি পাওয়ার ব্যাংক আউটলেট</span>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>

                    </div>
                  </section>

                  {/* PRODUCTS OFFERS IN SIMULATOR */}
                  <section className="px-4 py-8 max-w-6xl mx-auto">
                    <div className="text-center mb-6">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-600">আমাদের প্যাক ডিল সমূহ</h3>
                      <h4 className="text-xl font-black text-slate-900 mt-1">সবচেয়ে লাভজনক অফারটি সিলেক্ট করুন</h4>
                      <p className="text-[11px] text-slate-500 mt-1">কাস্টমার ভিউতে সিলেক্ট করতে যেকোনো একটি প্যাকেজ বেছে নিন।</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {offers.map((off) => (
                        <div 
                          key={off.id}
                          onClick={() => setSelectedOfferId(off.id)}
                          className={`p-5 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${selectedOfferId === off.id ? 'border-indigo-600 bg-indigo-50/20 shadow-md shadow-indigo-100' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                        >
                          <div className="space-y-2 text-left">
                            <span className="text-[9px] font-black text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 uppercase">{off.badge}</span>
                            <h4 className="font-extrabold text-sm text-slate-900">{off.name}</h4>
                            <p className="text-xs text-slate-500 leading-normal">{off.description}</p>
                          </div>
                          <div className="pt-4 border-t border-slate-100 mt-4 flex justify-between items-center bg-transparent">
                            <div>
                              <p className="text-[9px] text-slate-400 uppercase font-bold">মূল্য:</p>
                              <b className="font-mono text-indigo-600 text-lg">৳{off.price}</b>
                            </div>
                            <span className="text-xs text-slate-400 line-through font-mono">৳{off.originalPrice}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* CHECKOUT SECTION */}
                  <section id="preview-checkout" className="px-4 pb-8 max-w-3xl mx-auto">
                    <div className="text-center mb-6">
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Secure Dispatch Form</span>
                      <h3 className="text-lg font-bold text-slate-900 mt-1 font-sans">২-মিনিটে ক্যাশ অন ডেলিভারি অর্ডার সিমুলেশন</h3>
                    </div>

                    {/* Integrated dynamic CheckoutForm that syncs back to the parent order system on submission! */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden leading-normal">
                      <CheckoutForm 
                        offers={offers}
                        selectedOfferId={selectedOfferId}
                        onOfferChange={(id) => setSelectedOfferId(id)}
                        onOrderPlaced={(newOrder) => {
                          onAddOrder(newOrder);
                          setSuccessMsg(`[Live Synchronizer 200 SUCCESS] ল্যান্ডিং পেইজে থেকে নতুন ফোন অর্ডার সফলভাবে সিঙ্ক সম্পন্ন হয়েছে এবং উকমার্স অর্ডার রিপ্রেসেন্টেট ডাটাবেজে যুক্ত করা হয়েছে! অর্ডার আইডি: ${newOrder.id}`);
                          setActiveTab('dashboard');
                        }}
                      />
                    </div>
                  </section>

                </main>
              </div>

            </div>
          </div>
        )}

        {/* TAB 9: HTML Exporter System */}
        {activeTab === 'raw_export' && (
          <div className="space-y-6 animate-fadeIn">
            <HtmlExport />
          </div>
        )}

      </div>

    </div>
  );
}
