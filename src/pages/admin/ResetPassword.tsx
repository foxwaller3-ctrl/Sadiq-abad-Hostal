import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { authService } from '../../services/authService.ts';
import { Input } from '../../components/ui/Input.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { Card } from '../../components/ui/Card.tsx';

export const ResetPassword: React.FC = () => {
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    authService.getSession()
      .then((session) => {
        if (active) setHasSession(Boolean(session.user));
      })
      .catch(() => {
        if (active) setHasSession(false);
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => { active = false; };
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (password.length < 10) {
      setError('Choose a password with at least 10 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await authService.updatePassword(password);
      setSuccess(true);
      window.setTimeout(() => navigate('/admin', { replace: true }), 700);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-start">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center text-white mx-auto shadow-lg mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Set a new password</h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400">Sadiqabad Student Hostel Admin Portal</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="py-8 px-6 sm:px-10 bg-white border border-slate-700 shadow-2xl">
          {!ready ? (
            <p role="status" className="text-sm text-slate-600">Checking password-reset session…</p>
          ) : !hasSession ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-700">Open the password-reset link from your email on this device. If the link has expired, return to login and request another one.</p>
              <Link to="/admin/login" className="text-sm font-semibold text-teal-700 hover:text-teal-900">Back to Admin Login</Link>
            </div>
          ) : success ? (
            <div role="status" className="space-y-3 text-emerald-800">
              <p className="font-semibold">Password updated successfully.</p>
              <p className="text-sm">Opening the admin dashboard…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <div role="alert" className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">{error}</div>}
              <Input type="password" label="New password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="At least 10 characters" />
              <Input type="password" label="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Repeat new password" />
              <p className="text-xs text-slate-500">Use a unique password that you do not use on other websites.</p>
              <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full font-bold" icon={<LockKeyhole className="w-4 h-4" />}>
                Update Password
              </Button>
            </form>
          )}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <Link to="/admin/login" className="text-xs text-slate-500 hover:text-teal-700 font-medium">Back to Admin Login</Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
