'use client';

import { useState } from 'react';

const useSimpleRouter = () => ({
  push: (path) => { window.location.href = path; }
});

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useSimpleRouter();

  async function submit(e) {
    e.preventDefault();
    setMsg('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // important to receive httpOnly cookie
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsg(json.error || 'Login failed');
        setLoading(false);
        return;
      }

      // server returned user object (cookie contains token)
      const user = json.user;
      if (!user) {
        setMsg('Login failed: no user returned.');
        setLoading(false);
        return;
      }

      if (user.role !== 'admin') {
        // if user is not admin, logout the session (clear cookie)
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/auth/logout`, {
          method: 'POST',
          credentials: 'include',
        });
        setMsg('Access denied: admin account required.');
        setLoading(false);
        return;
      }

      // success: redirect to admin dashboard
      router.push('/admin/dashboard');
    } catch (err) {
      console.error('admin login error', err);
      setMsg('Network error');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className='w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-200'>
        <h1 className='text-3xl font-extrabold text-gray-900 mb-6 text-center'>🔒 Admin Portal Login</h1>

        <form onSubmit={submit} className='space-y-4'>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder='Admin email'
            className='w-full p-3 border border-gray-300 rounded-lg'
            required
          />

          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder='Password'
            className='w-full p-3 border border-gray-300 rounded-lg'
            required
          />

          <button
            type="submit"
            disabled={loading}
            className='bg-blue-600 hover:bg-blue-700 p-3 text-white rounded-lg w-full font-semibold'
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          {msg && (
            <p className='text-red-600 bg-red-50 p-3 rounded-lg text-center font-medium mt-4'>
              {msg}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
