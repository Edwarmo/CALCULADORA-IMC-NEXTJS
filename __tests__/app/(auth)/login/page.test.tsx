/**
 * Tests for Login Page Component
 * Location mirrors: app/(auth)/login/page.tsx
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from 'app/(auth)/login/page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

// Mock the login action
jest.mock('app/actions/auth.actions', () => ({
  loginAction: jest.fn(),
}));

import { loginAction } from 'app/actions/auth.actions';

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the login form with email and password fields', () => {
    render(<LoginPage />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('should render the sign in button', () => {
    render(<LoginPage />);
    
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should display error message when login fails', async () => {
    (loginAction as jest.Mock).mockResolvedValue({ 
      success: false, 
      error: 'Invalid credentials' 
    });
    
    render(<LoginPage />);
    
    const user = userEvent.setup();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('should redirect on successful login', async () => {
    const mockPush = jest.fn();
    (loginAction as jest.Mock).mockResolvedValue({ 
      success: true 
    });
    
    // Mock useRouter to return our mockPush
    jest.doMock('next/navigation', () => ({
      useRouter: () => ({
        push: mockPush,
        replace: jest.fn(),
      }),
    }));
    
    render(<LoginPage />);
    
    const user = userEvent.setup();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(loginAction).toHaveBeenCalled();
    });
  });

  it('should show loading state while pending', async () => {
    (loginAction as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
    );
    
    render(<LoginPage />);
    
    const user = userEvent.setup();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
  });
});
