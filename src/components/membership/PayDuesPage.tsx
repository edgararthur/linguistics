import React, { useState } from 'react';
import { paymentService } from '../../services/paymentService';
import { Loader, CreditCard, CheckCircle, AlertCircle, Smartphone } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function PayDuesPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [paymentResponse, setPaymentResponse] = useState<any>(null);

    const [formData, setFormData] = useState({
        fullName: '',
        amount: '',
        phone: '',
        network: 'MTN'
    });

    const SERVICE_FEE = 2.00;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

            const totalAmount = amount + SERVICE_FEE;

            // Save payment record to database first
            const { data: paymentRecord, error: dbError } = await supabase
                .from('payments')
                .insert({
                    amount: amount,
                    service_fee: SERVICE_FEE,
                    total_amount: totalAmount,
                    payer_name: formData.fullName,
                    payer_phone: formData.phone,
                    network: formData.network,
                    status: 'pending',
                    currency: 'GHS'
                })
                .select()
                .single();

            if (dbError) {
                console.error('Database error:', dbError);
                throw new Error('Failed to initialize payment record');
            }

            // Call payment service (simulated or real)
            const response = await paymentService.processPayment({
                amount: totalAmount, // Send total amount to provider
                payerName: formData.fullName,
                payerPhone: formData.phone,
                network: formData.network
            });

            if (response.success) {
                // Update payment record with provider reference if available
                await supabase
                    .from('payments')
                    .update({
                        status: 'pending', // Still pending until callback/confirmation
                        reference: response.data?.reference
                    })
                    .eq('id', paymentRecord.id);

                setSuccess(true);
                setPaymentResponse({ ...response, data: { ...response.data, reference: paymentRecord.id } }); // Use our ID as ref for user
            } else {
                // Mark as failed
                await supabase
                    .from('payments')
                    .update({ status: 'failed', error_message: response.message })
                    .eq('id', paymentRecord.id);

                throw new Error(response.message || 'Payment initiation failed');
            }
        } catch (err: any) {
            console.error('Payment error:', err);
            setError(err.message || 'An error occurred while processing payment');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Initiated!</h2>
                    <p className="text-gray-600 mb-6">
                        Please check your phone ({formData.phone}) for the authorization prompt.
                        <br />
                        <span className="text-sm text-gray-500 mt-2 block">
                            Total charged: GH₵ {(parseFloat(formData.amount) + SERVICE_FEE).toFixed(2)} (includes GH₵ {SERVICE_FEE.toFixed(2)} service fee)
                        </span>
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
                        <p className="text-sm text-blue-800"><strong>Reference:</strong> {paymentResponse?.data?.reference || 'N/A'}</p>
                        <p className="text-sm text-blue-800"><strong>Status:</strong> Pending Confirmation</p>
                    </div>
                    <button
                        onClick={() => {
                            setSuccess(false);
                            setFormData({ ...formData, amount: '', phone: '' });
                        }}
                        className="w-full py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                    >
                        Make Another Payment
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-blue-900 px-8 py-6 text-center">
                        <CreditCard className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                        <h2 className="text-2xl font-bold text-white">Pay Dues</h2>
                        <p className="text-blue-100 mt-1">Secure Mobile Money Payment</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-start">
                                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3" />
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                required
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                                Amount (GH₵)
                            </label>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                required
                                min="1"
                                step="0.01"
                                value={formData.amount}
                                onChange={handleChange}
                                placeholder="0.00"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                            {formData.amount && (
                                <p className="text-xs text-gray-500 mt-1">
                                    + GH₵ {SERVICE_FEE.toFixed(2)} Service Fee = <strong>GH₵ {(parseFloat(formData.amount) + SERVICE_FEE).toFixed(2)}</strong> Total
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="network" className="block text-sm font-medium text-gray-700 mb-1">
                                Network
                            </label>
                            <div className="relative">
                                <select
                                    id="network"
                                    name="network"
                                    value={formData.network}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none"
                                >
                                    <option value="MTN">MTN Mobile Money</option>
                                    <option value="VODAFONE">Telecel Cash (Vodafone)</option>
                                    <option value="AIRTELTIGO">AT Money</option>
                                </select>
                                <Smartphone className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Mobile Money Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="e.g., 024xxxxxxx"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-yellow-500 text-blue-900 font-bold rounded-lg hover:bg-yellow-400 focus:ring-4 focus:ring-yellow-200 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Pay Now'
                                )}
                            </button>
                            <p className="text-xs text-center text-gray-500 mt-4">
                                Secure payment processing via Hubtel/Paystack
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
