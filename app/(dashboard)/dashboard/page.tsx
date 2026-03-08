import { getUserOperations } from '@/lib/application/operations/get-operations.use-case';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { SessionStatus } from './SessionStatus';
import { HistoryTable } from './HistoryTable';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token) {
    redirect('/login');
  }
  
  let decoded: { userId: string; email: string } | null = null;
  
  try {
    decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
  } catch (error) {
    redirect('/login');
  }
  
  if (!decoded || !decoded.userId) {
    redirect('/login');
  }

  const operaciones = await getUserOperations(decoded.userId);

  // Mock session for SessionStatus component
  const session = {
    expires_at: Math.floor(Date.now() / 1000) + 60,
    user: { email: decoded.email },
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <Link
            href="/calculator"
            className="glass-button"
          >
            Nueva Calculadora
          </Link>
        </div>

        {/* Session Status */}
        <SessionStatus session={session} />

        {/* History Section */}
        <div className="glass-card-dark p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Historial de Operaciones</h2>
          <HistoryTable operaciones={operaciones} />
        </div>
      </div>
    </div>
  );
}
