import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, Send, Loader, Phone, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { smsService } from '../../services/smsService';
import { memberService } from '../../services/memberService';
import { useToast } from '../../contexts/ToastContext';
import { supabase } from '../../lib/supabase';
import Pagination from '../../components/shared/Pagination';

export default function Communication() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('sms');

  // SMS State
  const [message, setMessage] = useState('');
  const [recipientType, setRecipientType] = useState<'all' | 'test'>('test');
  const [testNumber, setTestNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // Logs State
  const [logs, setLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    if (activeTab === 'sms') {
      fetchLogs();
    }
  }, [activeTab, currentPage]);

  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const { data, count, error } = await supabase
        .from('sms_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      if (error) throw error;
      setLogs(data || []);
      setTotalLogs(count || 0);
    } catch (error) {
      console.error('Error fetching SMS logs:', error);
    } finally {
      setLogsLoading(false);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const msg = e.target.value;
    setMessage(msg);
    setCharCount(msg.length);
  };

  const handleSendSMS = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      showToast('Please enter a message.', 'error');
      return;
    }

    if (recipientType === 'test' && !testNumber) {
      showToast('Please enter a test phone number.', 'error');
      return;
    }

    if (!window.confirm(`Are you sure you want to send this SMS to ${recipientType === 'all' ? 'ALL members' : testNumber}?`)) {
      return;
    }

    setLoading(true);
    try {
      let recipients: string[] = [];

      if (recipientType === 'all') {
        recipients = await memberService.getAllMemberPhones();
        if (recipients.length === 0) {
          showToast('No members with phone numbers found.', 'warning');
          setLoading(false);
          return;
        }
      } else {
        recipients = [testNumber];
      }

      await smsService.sendBroadcast(recipients, message);

      showToast(`SMS sent successfully to ${recipients.length} recipient(s).`, 'success');
      setMessage('');
      if (recipientType === 'test') setTestNumber('');
      fetchLogs(); // Refresh logs

    } catch (error: any) {
      console.error('Error sending SMS:', error);
      showToast(error.message || 'Failed to send SMS.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Communication Center</h1>
          <p className="text-slate-500">Manage SMS and Email campaigns.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('sms')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'sms'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              SMS Broadcasts
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'email'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
            >
              <Mail className="w-4 h-4 mr-2" />
              Email Campaigns
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'sms' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Send SMS Form */}
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-900">SMS Guidelines</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Messages are sent via mNotify/Arkesel. Ensure your account has sufficient credit.
                        One SMS page is typically 160 characters.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSendSMS} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Recipients</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div
                          onClick={() => setRecipientType('test')}
                          className={`cursor-pointer border rounded-lg p-4 flex items-center ${recipientType === 'test' ? 'border-yellow-500 bg-yellow-50 ring-1 ring-yellow-500' : 'border-slate-200 hover:border-slate-300'}`}
                        >
                          <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${recipientType === 'test' ? 'border-yellow-600' : 'border-slate-400'}`}>
                            {recipientType === 'test' && <div className="w-2 h-2 rounded-full bg-yellow-600" />}
                          </div>
                          <div>
                            <span className="block font-medium text-slate-900">Test Number</span>
                            <span className="block text-xs text-slate-500">Send to a single number for verification</span>
                          </div>
                        </div>
                        <div
                          onClick={() => setRecipientType('all')}
                          className={`cursor-pointer border rounded-lg p-4 flex items-center ${recipientType === 'all' ? 'border-yellow-500 bg-yellow-50 ring-1 ring-yellow-500' : 'border-slate-200 hover:border-slate-300'}`}
                        >
                          <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${recipientType === 'all' ? 'border-yellow-600' : 'border-slate-400'}`}>
                            {recipientType === 'all' && <div className="w-2 h-2 rounded-full bg-yellow-600" />}
                          </div>
                          <div>
                            <span className="block font-medium text-slate-900">All Members</span>
                            <span className="block text-xs text-slate-500">Broadcast to all registered members</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {recipientType === 'test' && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Test Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                          <input
                            type="tel"
                            placeholder="+233..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            value={testNumber}
                            onChange={(e) => setTestNumber(e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="block text-sm font-medium text-slate-700">Message Content</label>
                        <span className={`text-xs ${charCount > 160 ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
                          {charCount} characters ({Math.ceil(charCount / 160)} SMS pages)
                        </span>
                      </div>
                      <textarea
                        rows={5}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                        placeholder="Type your message here..."
                        value={message}
                        onChange={handleMessageChange}
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Avoid using special characters that might not be supported by GSM encoding.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-yellow-500 text-slate-900 rounded-lg hover:bg-yellow-400 font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Broadcast
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* SMS Logs */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Broadcasts</h3>
                  <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Message</th>
                            <th className="px-4 py-3">Recipients</th>
                            <th className="px-4 py-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {logsLoading ? (
                            <tr>
                              <td colSpan={4} className="px-4 py-8 text-center">
                                <Loader className="w-6 h-6 text-yellow-500 animate-spin mx-auto" />
                              </td>
                            </tr>
                          ) : logs.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                                No SMS logs found.
                              </td>
                            </tr>
                          ) : (
                            logs.map((log) => (
                              <tr key={log.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                                  {new Date(log.created_at).toLocaleDateString()} <br />
                                  <span className="text-xs">{new Date(log.created_at).toLocaleTimeString()}</span>
                                </td>
                                <td className="px-4 py-3 text-slate-800 max-w-xs truncate" title={log.message}>
                                  {log.message}
                                </td>
                                <td className="px-4 py-3 text-slate-600">
                                  {log.recipients?.length || 0}
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize
                                                            ${log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {log.status === 'success' ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                                    {log.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="p-4 border-t border-slate-200">
                      <Pagination
                        currentPage={currentPage}
                        totalItems={totalLogs}
                        itemsPerPage={itemsPerPage}
                        totalPages={Math.ceil(totalLogs / itemsPerPage)}
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 h-fit">
                <h3 className="font-bold text-slate-900 mb-4">Preview</h3>
                <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm relative">
                  <div className="absolute -left-2 top-6 w-2 h-4 bg-yellow-500 rounded-r-sm"></div>
                  <div className="text-xs text-slate-400 mb-2 flex justify-between">
                    <span>Sender: LAG</span>
                    <span>Now</span>
                  </div>
                  <p className="text-sm text-slate-800 whitespace-pre-wrap">
                    {message || "Your message preview will appear here..."}
                  </p>
                </div>
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Quick Templates</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => setMessage("Dear Member, kindly be reminded of the upcoming LAG General Meeting on [Date]. See you there!")}
                      className="w-full text-left text-xs p-2 bg-white border border-slate-200 rounded hover:border-yellow-500 transition-colors truncate"
                    >
                      Meeting Reminder
                    </button>
                    <button
                      onClick={() => setMessage("Hello, your annual dues for [Year] are now due. Please visit the portal to pay. Thank you.")}
                      className="w-full text-left text-xs p-2 bg-white border border-slate-200 rounded hover:border-yellow-500 transition-colors truncate"
                    >
                      Dues Payment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="text-center py-12 text-slate-500">
              <Mail className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium text-slate-900">Email Campaigns</h3>
              <p>This module is currently under development.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}