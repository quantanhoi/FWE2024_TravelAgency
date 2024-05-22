import React, { createContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";

export type LoginUserData = {
    email: string;
    password: string;
};
export type User = {
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    iat: number;
    exp: number;
    iss: string;
};

type AuthContext = {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    onLogin: (loginData: LoginUserData) => void;
    onLogout: () => void;
};

const authContext = createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [accessToken, setAccessToken] = useLocalStorage<string | null>(
        "accessToken",
        null,
    );
    const navigate = useNavigate();

    const user = accessToken
        ? (JSON.parse(atob(accessToken.split(".")[1])) as User)
        : null;
    console.log("user", user);

    /**
     *
     * 1. Login Daten an den Server schicken
     * 2. Access token kommt vom Server zurück
     * 3. Wenn ich einen access token haben / eingeloggt bin darf ich auf die Home Seite
     * 4. Access token wird im LocalStorage gespeichert
     * 5. Access token wird bei jeder Anfrage an den Server mitgeschickt
     *
     */
    const onLogin = async (loginData: LoginUserData) => {
        const body = {
            email: loginData.email,
            password: loginData.password,
        };
        const res = await fetch("http://localhost:3001/api/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        const resBody = await res.json();
        setAccessToken(resBody.accessToken);
        navigate("/");
    };

    const onLogout = () => {
        setAccessToken(null);
        navigate("/");
    };
    return (
        <authContext.Provider
            value={{
                user,
                accessToken,
                isAuthenticated: false,
                onLogin,
                onLogout,
            }}
        >
            {children}
        </authContext.Provider>
    );
};

export const useAuth = () => {
    const auth = React.useContext(authContext);
    if (!auth) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return auth;
};
