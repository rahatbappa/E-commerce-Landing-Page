import React from 'react';
import { 
  Database, Trash2, RefreshCcw, CheckSquare, 
  Clock, Truck, UserCheck, Smartphone, ShoppingBag 
} from 'lucide-react';
import { LeadOrder } from '../types';

interface LeadLogsProps {
  orders: LeadOrder[];
  onClearOrders: () => void;
  onPrepopulateOrders: () => void;
  onUpdateStatus: (orderId: string, newStatus: LeadOrder['status']) => void;
}

export default function LeadLogs({ 
  orders, 
  onClearOrders, 
  onPrepopulateOrders, 
  onUpdateStatus 
}: LeadLogsProps) {
  return (
    <div id="lead-logs-section" className="bg-white border border-slate-200 text-slate-800 rounded-2xl shadow-sm p-6 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 animate-pulse">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>অর্ডার লিড ট্র্যাকিং ডাটাবেজ</span>
              <span className="text-xs uppercase bg-indigo-50 text-indigo-700 border border-indigo-100 font-mono font-black px-2 mt-0.5 rounded">Admin Panel</span>
            </h3>
            <p className="text-xs text-slate-500">Manage real-time order inquiries generated from the landing page checkout funnels.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            id="admin-populate-btn"
            onClick={onPrepopulateOrders}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>সিমুলেট টেস্ট লিডস (Add Dummy Leads)</span>
          </button>
          <button
            id="admin-clear-btn"
            onClick={onClearOrders}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>মুছে ফেলুন (Clean Database)</span>
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 px-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
          <Database className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-700">কোনো অর্ডার লিড পাওয়া যায়নি</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            ল্যান্ডিং পেজের ফোনে অর্ডার বা WooCommerce পেমেন্ট কমপ্লিট করুন, অথবা ডামি ডাটা যোগ করতে ওপরের বাটনে ক্লিক করুন।
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto text-slate-800">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider font-mono text-[10px]">
                <th className="py-3 px-2">Order ID</th>
                <th className="py-3 px-3">Customer Info</th>
                <th className="py-3 px-3">Selected Package</th>
                <th className="py-3 px-3">Grand Total</th>
                <th className="py-3 px-3">Funnel Channel</th>
                <th className="py-3 px-3">Lead Status</th>
                <th className="py-3 px-2 text-right">Registered Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-2 font-mono font-bold text-indigo-650">
                    {order.id}
                  </td>
                  <td className="py-4 px-3">
                    <div>
                      <p className="font-bold text-slate-900">{order.customerName}</p>
                      <p className="text-xs font-mono text-slate-500 font-medium">{order.phoneNumber}</p>
                      <p className="text-[11px] text-slate-550 mt-0.5 max-w-[180px] break-words leading-tight">{order.address}, {order.district}</p>
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <div>
                      <p className="font-semibold text-slate-700">{order.offerName}</p>
                      <p className="text-[10px] text-slate-550">Qty: {order.itemsQuantity} pcs</p>
                    </div>
                  </td>
                  <td className="py-4 px-3 font-mono font-bold text-slate-900">
                    ৳{order.total}
                    <div className="text-[9px] text-indigo-650 font-medium">
                      {order.paymentMethod.split(' ')[0]}
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <span className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold py-1 px-2.5 rounded-full ${
                      order.checkoutType === 'phone_1click' 
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {order.checkoutType === 'phone_1click' ? (
                        <>
                          <Smartphone className="w-3 h-3 text-indigo-600" />
                          <span>Phone Funnel</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3 h-3 text-slate-600" />
                          <span>WooCommerce</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-3 space-y-1">
                    <select
                      id={`status-select-${order.id}`}
                      value={order.status}
                      onChange={(e) => onUpdateStatus(order.id, e.target.value as LeadOrder['status'])}
                      className={`text-[10px] font-bold rounded px-2 py-1 bg-white border outline-none ${
                        order.status === 'Pending Verification' 
                          ? 'text-amber-750 border-amber-205 bg-amber-50/30' 
                          : order.status === 'Processing' 
                            ? 'text-sky-700 border-sky-200 bg-sky-50/30' 
                            : order.status === 'Shipped' 
                              ? 'text-emerald-700 border-emerald-202 bg-emerald-50/30' 
                              : 'text-red-700 border-red-200 bg-red-50/30'
                      }`}
                    >
                      <option value="Pending Verification">⏳ Pending</option>
                      <option value="Processing">⚙️ Processing</option>
                      <option value="Shipped">🚚 Shipped (COD)</option>
                      <option value="Cancelled">❌ Cancelled</option>
                    </select>
                  </td>
                  <td className="py-4 px-2 text-right font-mono text-[10px] text-slate-500">
                    {new Date(order.createdAt).toLocaleTimeString()}
                    <div className="text-[9px]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
