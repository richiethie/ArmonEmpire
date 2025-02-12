import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Default import for jwt-decode
import { useNavigate } from 'react-router-dom'; // React Router v6 for navigation
import { User } from "../types/User";

interface AuthContextType {
    user: User | null;
    token: string | null; // Token is nullable
    login: (userData: { user: User; token: string }) => void;
    logout: () => void;
    isAuthenticated: boolean;
}
  
const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
export const AuthProvider = ({ children }: { children: ReactNode }) => {
const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
});

const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
});

const navigate = useNavigate(); // Use navigate from React Router v6 for redirection

// Function to check if the token is expired
const isTokenExpired = (token: string) => {
    try {
    const decoded: any = jwtDecode(token); // Use jwt_decode directly
    if (decoded && decoded.exp) {
        const currentTime = Date.now() / 1000; // Current time in seconds
        return decoded.exp < currentTime; // Check if the token has expired
    }
    } catch (error) {
    console.error('Error decoding token:', error);
    }
    return true; // Default to expired if decoding fails
};

// Effect to handle token expiration and store changes
useEffect(() => {
    if (token && isTokenExpired(token)) {
    logout();
    navigate('/login'); // Redirect to login page if the token has expired
    } else if (user && token) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    } else {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    }
}, [user, token, navigate]);

const login = (userData: { user: User; token: string }) => {
    if (!userData || !userData.user || !userData.token) {
    console.error('Invalid user data passed to login');
    return;
    }

    setUser(userData.user);
    setToken(userData.token);

    localStorage.setItem('user', JSON.stringify(userData.user));
    localStorage.setItem('token', userData.token);
};

const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem('user');
    localStorage.removeItem('token');
};

return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user }}>
    {children}
    </AuthContext.Provider>
);
};

export const useAuth = () => {
const context = useContext(AuthContext);
if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
}
return context;
};