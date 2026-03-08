import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Root page - redirects based on authentication status
 * If authenticated → /calculator
 * If not authenticated → /login
 */
export default async function RootPage() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (token) {
      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
      
      if (decoded && decoded.userId) {
        // User is authenticated, redirect to calculator
        redirect('/calculator');
      }
    }
  } catch (error) {
    // Token is invalid or expired, continue to login
    console.log('Invalid or expired token');
  }
  
  // User is not authenticated, redirect to login
  redirect('/login');
}
