import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import Button from '../../components/shared/Button';

export default function AdminSetup() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const navigate = useNavigate();

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // 1. Sign Up the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'admin@laghana.org',
        password: password,
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('No user returned from signup');
      }

      // 2. Check if user is already confirmed (if auto-confirm is on)
      // If not, we might need to warn them, but let's assume development mode usually has auto-confirm or they can check email.
      
      setMessage({
        type: 'success',
        text: 'Admin account created successfully! You can now log in.'
      });

      // Optional: Redirect after a delay
      setTimeout(() => {
        navigate('/admin/login');
      }, 2000);

    } catch (err: any) {
      console.error('Setup error:', err);
      // Handle "User already registered" specifically
      if (err.message?.includes('already registered')) {
        setMessage({
          type: 'error',
          text: 'This email is already registered. If you forgot the password, please delete the user in Supabase Dashboard or use password reset.'
        });
      } else {
        setMessage({
          type: 'error',
          text: err.message || 'Failed to create admin user.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-blue-900 p-3 rounded-xl">
            <Lock className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Setup
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create the initial admin account for 'admin@laghana.org'
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleCreateAdmin}>
            {message && (
              <div className={`p-4 rounded-md flex items-start ${message.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                {message.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-3" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
                )}
                <p className={`text-sm ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                  {message.text}
                </p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  value="admin@laghana.org"
                  disabled
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Set Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Choose a secure password"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Creating Account...
                  </>
                ) : (
                  'Create Admin Account'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
