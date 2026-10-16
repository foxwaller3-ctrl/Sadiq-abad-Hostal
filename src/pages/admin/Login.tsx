import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowLeft, KeyRound } from 'lucide-react';
import { authService } from '../../services/authService.ts';
import { Input } from '../../components/ui/Input.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { useToast } from '../../components/ui/Toast.tsx';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@sadiqabadhostel.pk');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-start">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center text-white mx-auto shadow-lg mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
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
              placeholder="admin@sadiqabadhostel.pk"
            />

            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />

            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-800">
              <span className="font-bold block mb-0.5">Demo Credentials (Stage A):</span>
              Email: <code className="font-mono bg-teal-100 px-1 rounded">admin@sadiqabadhostel.pk</code>
              <br />
              Password: <code className="font-mono bg-teal-100 px-1 rounded">admin123</code>
            </div>

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
