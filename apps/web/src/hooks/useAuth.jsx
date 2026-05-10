import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.me().then(setCurrentUser).finally(() => setLoading(false));
  }, []);

  async function signIn(creds) {
    await authService.signIn(creds);
    const fresh = await authService.me();
    setCurrentUser(fresh);
    return fresh;
  }

  async function signUp(creds) {
    await authService.register(creds);
    const fresh = await authService.me();
    setCurrentUser(fresh);
    return fresh;
  }

  async function signOut() {
    await authService.signOut();
    setCurrentUser(null);
  }

  const value = useMemo(() => {
    const authorities = new Set(currentUser?.authorities ?? []);
    const roles = new Set(currentUser?.roles ?? []);
    return {
      currentUser,
      loading,
      signIn,
      signUp,
      signOut,
      hasAuthority: (authority) => authorities.has(authority),
      hasAnyAuthority: (...list) => list.some(a => authorities.has(a)),
      hasRole: (role) => roles.has(role),
    };
  }, [currentUser, loading]);

  return (
    <AuthCtx.Provider value={value}>
      {children}
    </AuthCtx.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthCtx);
