import React, { createContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Type definitions
export type LoginUserData = {
    email: string;
    password: string;
};



export type User = {
    email: string;
    name: string;
    iat: number;
    exp: number;
    iss: string;
};

type AuthContextType = {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    onLogin: (loginData: LoginUserData) => void;
    onLogout: () => void;
};

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * check if current jwt token is expired
 * @param token current token saved in local storage
 * @returns true or false if token is expired
 */
const isTokenExpired = (token: string) => {
    const decoded = JSON.parse(atob(token.split('.')[1])) as User;
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [accessToken, setAccessToken] = useLocalStorage<string | null>('accessToken', null);
    const navigate = useNavigate();

    const user = accessToken
        ? (JSON.parse(atob(accessToken.split('.')[1])) as User)
        : null;

    const onLogin = async (loginData: LoginUserData) => {
        const body = { email: loginData.email, password: loginData.password };
        const res = await fetch('http://localhost:3001/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const resBody = await res.json();
        if (!res.ok) {
            alert('Failed to login');
            return;
        }
        setAccessToken(resBody.jwtToken);
        navigate('/');
    };


    const onLogout = () => {
        setAccessToken(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, accessToken, isAuthenticated: !!user, onLogin, onLogout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const auth = React.useContext(AuthContext);
    const navigate = useNavigate();
    if (!auth) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    if (auth.accessToken && isTokenExpired(auth.accessToken)) {
        auth.onLogout();
        navigate('/login');
    }
    return auth;
};

// export function useAuth() {
//     const auth = React.useContext(AuthContext);
//     if (!auth) {
//         throw new Error('useAuth must be used within an AuthProvider');
//     }
//     return auth;
// }
