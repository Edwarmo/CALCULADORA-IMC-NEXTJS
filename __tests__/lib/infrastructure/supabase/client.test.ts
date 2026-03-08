/**
 * Tests for Supabase Client
 * Location mirrors: lib/infrastructure/supabase/client.ts
 */

// Mock @supabase/supabase-js
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn().mockReturnValue({
    auth: {
      getSession: jest.fn(),
      getUser: jest.fn(),
    },
  }),
}));

describe('Supabase Client', () => {
  it('should create supabase client with URL and anon key', () => {
    // Import after mocking
    const { supabase } = require('@/lib/infrastructure/supabase/client');
    
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
  });

  it('should create supabaseServer function', () => {
    const { supabaseServer } = require('@/lib/infrastructure/supabase/client');
    
    expect(supabaseServer).toBeDefined();
    expect(typeof supabaseServer).toBe('function');
  });
});
