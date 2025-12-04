import React from 'react';
import { Shield, Users, Lock, Save, MessageSquare, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Settings() {
  const smsApiKey = import.meta.env.VITE_SMS_API_KEY;
  const maskedKey = smsApiKey 
    ? `${smsApiKey.substring(0, 4)}...${smsApiKey.substring(smsApiKey.length - 4)}`
    : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
          <p className="text-slate-500">Configure application preferences and permissions.</p>
        </div>
        <button className="px-4 py-2 bg-yellow-500 text-slate-900 rounded-lg hover:bg-yellow-400 text-sm font-medium flex items-center">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Integrations</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
             <div className="flex items-center">
               <div className="p-2 bg-green-100 rounded-lg mr-4">
                 <MessageSquare className="w-5 h-5 text-green-600" />
               </div>
               <div>
                 <h4 className="font-medium text-slate-900">SMS Gateway (mNotify)</h4>
                 <p className="text-sm text-slate-500">
                    {maskedKey ? `API Key: ${maskedKey}` : 'API Key not configured'}
                 </p>
               </div>
             </div>
             <div className="flex items-center">
                {maskedKey ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Connected
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Missing Config
                    </span>
                )}
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">General Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
            <input type="text" defaultValue="Linguistics Association of Ghana" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
            <input type="email" defaultValue="info@lagghana.org" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Dues Amount (Professional)</label>
            <input type="number" defaultValue="200" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Dues Amount (Student)</label>
            <input type="number" defaultValue="50" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Security & Access</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
             <div className="flex items-center">
               <div className="p-2 bg-blue-100 rounded-lg mr-4">
                 <Shield className="w-5 h-5 text-blue-600" />
               </div>
               <div>
                 <h4 className="font-medium text-slate-900">Two-Factor Authentication</h4>
                 <p className="text-sm text-slate-500">Require 2FA for all admin accounts.</p>
               </div>
             </div>
             <label className="relative inline-flex items-center cursor-pointer">
               <input type="checkbox" className="sr-only peer" />
               <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
             </label>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
             <div className="flex items-center">
               <div className="p-2 bg-purple-100 rounded-lg mr-4">
                 <Users className="w-5 h-5 text-purple-600" />
               </div>
               <div>
                 <h4 className="font-medium text-slate-900">Public Member Directory</h4>
                 <p className="text-sm text-slate-500">Allow public to search member database.</p>
               </div>
             </div>
             <label className="relative inline-flex items-center cursor-pointer">
               <input type="checkbox" defaultChecked className="sr-only peer" />
               <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
             </label>
          </div>
        </div>
      </div>
    </div>
  );
}