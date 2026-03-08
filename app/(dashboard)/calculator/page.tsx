import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import Calculator from './Calculator';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Calculator page - protected route
 * Checks for valid JWT token before rendering
 */
export default async function CalculatorPage() {
  // Check authentication on the server
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token) {
    redirect('/login');
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    
    if (!decoded || !decoded.userId) {
      redirect('/login');
    }
  } catch (error) {
    redirect('/login');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">
        Welcome to Nutrium
      </h1>
      <p className="text-white/80 text-lg mb-8 text-center max-w-xl">
        Calculate your daily caloric needs, BMI, and get personalized nutrition recommendations.
      </p>
      <Calculator />
    </div>
  );
}
