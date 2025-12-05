import React, { useState } from 'react';
import { paymentService } from '../../services/paymentService';
import Modal from '../../components/shared/Modal';
import { Loader, CheckCircle, AlertCircle, Smartphone, Lock, CreditCard } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface PayDuesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type PaymentMode = 'MOMO' | 'CARD';
type Network = 'MTN' | 'TELECEL' | 'AIRTELTIGO';

export default function PayDuesModal({ isOpen, onClose }: PayDuesModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [paymentResponse, setPaymentResponse] = useState<any>(null);

    const [paymentMode, setPaymentMode] = useState<PaymentMode>('MOMO');

    // Logos (Using CDNs for reliability)
    const LOGOS = {
        MTN: 'https://upload.wikimedia.org/wikipedia/commons/9/93/New-mtn-logo.jpg',
        TELECEL: 'https://seeklogo.com/images/T/telecel-ghana-logo-8A19183C9D-seeklogo.com.png', // Telecel
        AIRTELTIGO: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/AirtelTigo_Logo.png', // AT
        VISA_MASTER: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png' // Generic Card
    };

    const [formData, setFormData] = useState({
        fullName: '',
        amount: '',
        phone: '',
        network: 'MTN' as Network
    });

    const calculateTotal = (amountStr: string) => {
        const amount = parseFloat(amountStr);
        if (isNaN(amount) || amount <= 0) return { fee: 0, total: 0 };
        const fee = Number(import.meta.env.VITE_SERVICE_FEE || 2.00);
        return { fee, total: amount + fee };
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const amount = parseFloat(formData.amount);
            if (isNaN(amount) || amount <= 0) {
                throw new Error('Please enter a valid amount');
            }

            const { fee, total } = calculateTotal(formData.amount);

            // Create record
            const { data: paymentRecord, error: dbError } = await supabase
                .from('payments')
                .insert({
                    amount: amount,
                    service_fee: fee,
                    total_amount: total,
                    payer_name: formData.fullName,
                    payer_phone: formData.phone,
                    network: paymentMode === 'MOMO' ? formData.network : 'CARD',
                    payment_method: paymentMode,
                    status: 'pending',
                    reference: `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    currency: 'GHS'
                })
                .select()
                .single();

            if (dbError) throw new Error('Failed to initialize payment record');

            // Process
            const response = await paymentService.processPayment({
                amount: total,
                payerName: formData.fullName,
                payerPhone: formData.phone,
                network: paymentMode === 'MOMO' ? formData.network : 'CARD',
            });

            if (response.success) {
                // Handle ExpressPay Redirect for Cards (or generic redirect if provided)
                if (response.data?.status === 'REDIRECT_REQUIRED' && response.data?.checkout_url) {
                     window.location.href = response.data.checkout_url;
                     return;
                }

                await supabase
                    .from('payments')
                    .update({
                        status: 'pending',
                        reference: response.data?.reference
                    })
                    .eq('id', paymentRecord.id);

                setSuccess(true);
                setPaymentResponse({ ...response, data: { ...response.data, reference: paymentRecord.id } });
            } else {
                throw new Error(response.message || 'Payment initiation failed');
            }
        } catch (err: any) {
            console.error('Payment error:', err);
            setError(err.message || 'Payment failed');
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setSuccess(false);
        setFormData({ fullName: '', amount: '', phone: '', network: 'MTN' as Network });
        onClose();
    };

    const { total } = calculateTotal(formData.amount);

    return (
        <Modal isOpen={isOpen} onClose={reset} title="Pay Dues">
            {success ? (
                <div className="text-center py-8 px-4">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Payment Initiated!</h2>
                    <p className="text-gray-600 mb-8 text-lg">
                        {paymentMode === 'MOMO'
                            ? `Please check your phone (${formData.phone}) to authorize the transaction.`
                            : `Redirecting to secure payment page...`
                        }
                    </p>
                    
                    <button
                        onClick={reset}
                        className="w-full py-4 bg-blue-900 text-white text-lg font-bold rounded-xl hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl"
                    >
                        Done
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6 px-2">
                    {/* Amount Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Pay</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold text-xl">GH₵</span>
                            <input
                                type="number"
                                name="amount"
                                required
                                min="1"
                                step="0.01"
                                value={formData.amount}
                                onChange={handleChange}
                                placeholder="0.00"
                                className="w-full pl-16 pr-4 py-4 text-3xl font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Payment Tabs */}
                    <div className="flex p-1 bg-gray-100 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setPaymentMode('MOMO')}
                            className={`flex-1 flex items-center justify-center py-3 text-sm font-semibold rounded-lg transition-all ${paymentMode === 'MOMO'
                                ? 'bg-white text-blue-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Smartphone className={`w-5 h-5 mr-2 ${paymentMode === 'MOMO' ? 'text-blue-600' : 'text-gray-400'}`} />
                            Mobile Money
                        </button>
                        <button
                            type="button"
                            onClick={() => setPaymentMode('CARD')}
                            className={`flex-1 flex items-center justify-center py-3 text-sm font-semibold rounded-lg transition-all ${paymentMode === 'CARD'
                                ? 'bg-white text-blue-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <CreditCard className={`w-5 h-5 mr-2 ${paymentMode === 'CARD' ? 'text-blue-600' : 'text-gray-400'}`} />
                            Card / Bank
                        </button>
                    </div>

                    {/* Network Selection */}
                    {paymentMode === 'MOMO' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Select Network</label>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { id: 'MTN', name: 'MTN', logo: LOGOS.MTN },
                                    { id: 'TELECEL', name: 'Telecel', logo: LOGOS.TELECEL },
                                    { id: 'AIRTELTIGO', name: 'AT', logo: LOGOS.AIRTELTIGO }
                                ].map((net) => (
                                    <button
                                        key={net.id}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, network: net.id as Network }))}
                                        className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${formData.network === net.id
                                            ? 'border-blue-500 bg-blue-50/50'
                                            : 'border-gray-100 hover:border-gray-200 bg-white'
                                            }`}
                                    >
                                        <div className="w-12 h-12 mb-3 rounded-full bg-white shadow-sm p-1 flex items-center justify-center overflow-hidden">
                                            <img src={net.logo} alt={net.name} className="w-full h-full object-cover rounded-full" />
                                        </div>
                                        <span className={`text-xs font-bold ${formData.network === net.id ? 'text-blue-900' : 'text-gray-500'}`}>
                                            {net.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input Fields */}
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                required
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Your Name"
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        
                        {paymentMode === 'MOMO' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Money Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="024 XXX XXXX"
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center text-red-600 bg-red-50 p-4 rounded-xl text-sm border border-red-100">
                            <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Footer Action */}
                    <div className="pt-4 mt-4 border-t border-gray-100">
                        <div className="flex justify-between items-end mb-6">
                            <span className="text-blue-900 font-bold text-lg">Total Payable:</span>
                            <span className="text-2xl font-extrabold text-blue-900">GH₵ {total.toFixed(2)}</span>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-blue-900 text-white font-bold text-lg rounded-xl hover:bg-blue-800 hover:shadow-xl focus:ring-4 focus:ring-blue-200 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? <Loader className="w-6 h-6 animate-spin" /> : 'Pay Now'}
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );
}
