'use client';

import { useActionState } from 'react';
import { loginAction } from '@/app/actions/auth.actions';
import { useRouter } from 'next/navigation';

const initialState = {
  error: null as string | null,
  success: false,
};

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    async (prevState: typeof initialState, formData: FormData) => {
      const result = await loginAction(formData);
      
      if (result.success) {
        router.push('/calculator');
        router.refresh();
        return { ...prevState, success: true };
      }
      
      return { ...prevState, error: result.error || 'Login failed' };
    },
    initialState
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500">
      <div className="glass-container p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Nutrium Login
        </h1>
        
        {state.error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-4 text-sm">
            {state.error}
          </div>
        )}
        
        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="glass-input w-full"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              minLength={6}
              className="glass-input w-full"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={isPending}
            className="glass-button w-full text-lg disabled:opacity-50"
          >
            {isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <p className="mt-4 text-center text-white/80">
          Don't have an account?{' '}
          <a href="/register" className="text-green-300 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
