import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowLeft, KeyRound, Building2 } from 'lucide-react';
import { authService } from '../../services/authService.ts';
import { hostelInfoService } from '../../services/hostelInfoService.ts';
import { normalizeImageUrl } from '../../utils/helpers.ts';
import type { HostelInfo } from '../../types/index.ts';
import { Input } from '../../components/ui/Input.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { useToast } from '../../components/ui/Toast.tsx';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('foxwaller3@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [hostelInfo, setHostelInfo] = useState<HostelInfo | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    hostelInfoService.get().then(setHostelInfo);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResetMessage(null);

    try {
      await authService.login(email, password);
      toast('Welcome back to Admin Portal!', 'success');
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setError(null);
    setResetMessage(null);
    setResetLoading(true);
    try {
      await authService.requestPasswordReset(email);
      setResetMessage('If this address is registered, a password reset email will arrive shortly. Open it on this device to set a new password.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to request a password reset.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-start">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {hostelInfo?.logo_url ? (
          <div className="w-16 h-16 rounded-2xl bg-white p-1.5 border border-slate-700 shadow-xl mx-auto mb-4 flex items-center justify-center overflow-hidden">
            <img
              src={normalizeImageUrl(hostelInfo.logo_url)}
              alt="Hostel Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/logo.png';
              }}
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center text-white mx-auto shadow-lg mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
        )}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Hostel Admin Portal
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-400">
          Sign in to manage rooms, inquiries, mess menu, and notices
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="py-8 px-6 sm:px-10 bg-white border border-slate-700 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                {error}
              </div>
            )}

            <Input
              type="email"
              label="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="foxwaller3@gmail.com"
            />

            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />

            <div className="flex justify-end">
              <button type="button" onClick={handlePasswordReset} disabled={resetLoading}
                className="text-xs font-semibold text-teal-700 hover:text-teal-900 disabled:opacity-50">
                {resetLoading ? 'Sending reset email…' : 'Forgot password?'}
              </button>
            </div>
            {resetMessage && (
              <div role="status" className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                {resetMessage}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full font-bold"
              icon={<KeyRound className="w-4 h-4" />}
            >
              Sign In to Dashboard
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-700 transition font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Website</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
