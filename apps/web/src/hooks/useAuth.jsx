import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.me().then(setCurrentUser).finally(() => setLoading(false));
  }, []);

  async function signIn(creds) {
    const u = await authService.signIn(creds);
    setCurrentUser(u);
    return u;
  }

  async function signUp(creds) {
    const u = await authService.register(creds);
    setCurrentUser(u);
    return u;
  }

  async function signOut() {
    await authService.signOut();
    setCurrentUser(null);
  }

  return (
    <AuthCtx.Provider value={{ 
      currentUser, 
      loading, 
      signIn, 
      signUp,
      signOut 
    }}>
      {children}
    </AuthCtx.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthCtx);