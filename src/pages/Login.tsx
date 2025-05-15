import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      navigate('/index');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Login Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center mb-8">
            <span className="inline-block bg-green-900 rounded p-2 mr-2">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M16 3v4a1 1 0 0 0 1 1h4"/></svg>
            </span>
            <span className="font-bold text-lg">AIDM</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Login to your account</h2>
          <p className="text-muted-foreground mb-6">Enter your email below to login to your account</p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block mb-1 font-medium">Email</label>
              <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="font-medium">Password</label>
                <a href="#" className="text-sm text-muted-foreground hover:underline">Forgot your password?</a>
              </div>
              <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button type="submit" className="w-full mt-2 bg-green-900 hover:bg-green-800" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className="flex items-center my-6">
            <span className="flex-1 h-px bg-gray-200" />
            <span className="mx-2 text-xs text-gray-400">Or continue with</span>
            <span className="flex-1 h-px bg-gray-200" />
          </div>
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={async (e) => {
              e.preventDefault();
              setLoading(true);
              setError(null);
              const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { queryParams: { signIn: "signin" } } });
              setLoading(false);
              if (error) {
                setError("You don't have an account. Please sign up.");
              }
            }}
          >
            {/* Google Icon */}
            <svg width="20" height="20" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.86-6.86C36.68 2.69 30.74 0 24 0 14.82 0 6.73 5.16 2.69 12.74l8.06 6.26C12.5 13.13 17.77 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.02l7.19 5.6C43.98 37.13 46.1 31.3 46.1 24.55z"/><path fill="#FBBC05" d="M10.75 28.99c-1.04-3.13-1.04-6.51 0-9.64l-8.06-6.26C.9 17.1 0 20.45 0 24c0 3.55.9 6.9 2.69 9.91l8.06-6.26z"/><path fill="#EA4335" d="M24 48c6.48 0 11.93-2.15 15.9-5.85l-7.19-5.6c-2.01 1.35-4.59 2.15-8.71 2.15-6.23 0-11.5-3.63-13.25-8.99l-8.06 6.26C6.73 42.84 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
            Login with Google
          </Button>
          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account? <a href="/signup" className="underline text-green-900 hover:text-green-800">Sign up</a>
          </p>
        </div>
      </div>
      {/* Right: 3D Globe Placeholder */}
      <div className="hidden md:flex w-1/2 bg-gray-100 items-center justify-center">
        {/* 3D Globe Placeholder */}
        <div className="flex flex-col items-center justify-center h-full w-full">
          <div className="rounded-full bg-gray-200 flex items-center justify-center h-32 w-32 mb-4">
            <svg className="text-gray-400" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/></svg>
          </div>
          <span className="text-gray-400">3D Globe Placeholder</span>
        </div>
      </div>
    </div>
  );
};

export default Login; 