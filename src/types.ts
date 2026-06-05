export interface ProductOffer {
  id: string;
  name: string;
  quantity: number;
  price: number;
  originalPrice: number;
  badge?: string;
  description: string;
  gift?: string;
}

export interface CheckoutState {
  fullName: string;
  phoneNumber: string;
  deliveryAddress: string;
  district: string;
  email?: string;
  orderNotes?: string;
  shippingMethod: 'inside_dhaka' | 'outside_dhaka';
  paymentMethod: 'cod' | 'bkash' | 'nagad';
  couponCode: string;
  selectedOfferId: string;
}

export interface LeadOrder {
  id: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  district: string;
  email?: string;
  notes?: string;
  offerName: string;
  itemsQuantity: number;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  checkoutType: 'phone_1click' | 'woocommerce_full';
  paymentMethod: string;
  status: 'Pending Verification' | 'Processing' | 'Shipped' | 'Cancelled';
  createdAt: string;
}
