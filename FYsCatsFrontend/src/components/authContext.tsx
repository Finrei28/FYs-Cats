import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the context type
type AuthContextType = {
  id: string | null;
  setId: React.Dispatch<React.SetStateAction<string | null>>;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [id, setId] = useState<string | null>(null);
  
  useEffect(() => {
    const user = localStorage.getItem('username')
    if (user) {
        setId(user)
    }
    else {
        setId(null)
    }
  })

  return (
    <AuthContext.Provider value={{ id, setId }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
