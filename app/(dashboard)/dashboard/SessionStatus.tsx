'use client';

import React from 'react';

export function SessionStatus({ session }: { session: { expires_at?: number; user: { email?: string } | null } }) {
  const [isExpiringSoon, setIsExpiringSoon] = React.useState(false);
  const [isExpired, setIsExpired] = React.useState(false);
  const expiresAt = session.expires_at;
  const userEmail = session.user?.email ?? 'Unknown';

  React.useEffect(() => {
    const checkExpiration = () => {
      const now = Date.now() / 1000;
      if (expiresAt) {
        setIsExpired(expiresAt < now);
        setIsExpiringSoon(expiresAt - now < 60 && expiresAt >= now);
      }
    };
    
    checkExpiration();
    const interval = setInterval(checkExpiration, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <div className="glass-card-dark p-4 mb-6">
      <h2 className="text-lg font-semibold mb-2 text-white">Estado de Sesión</h2>
      <div className="flex items-center gap-2">
        <span
          className={`w-3 h-3 rounded-full ${
            isExpired ? 'bg-red-500' : isExpiringSoon ? 'bg-yellow-500' : 'bg-green-500'
          }`}
        />
        <span className="text-white/80">
          {isExpired
            ? 'Sesión expirada'
            : isExpiringSoon
            ? 'Sesión por expirar pronto'
            : 'Sesión activa'}
        </span>
      </div>
      <p className="text-white/60 text-sm mt-1">{userEmail}</p>
    </div>
  );
}
