// UserInformation.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../providers/authProvider';

interface User {
    u_id: number;
    u_email: string;
    u_name: string;
}

const UserInformation: React.FC = () => {
    const { accessToken } = useAuth();
    const [userInfo, setUserInfo] = useState<User | null>(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/user', {
                    method: 'POST',
                    headers: {
                        'Authorization': `${accessToken}` // Ensure Bearer is included
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched user info:', data); // Debugging log

                setUserInfo(data);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        if (accessToken) {
            fetchUserInfo();
        } else {
            console.warn('No access token provided'); // Debugging log
        }
    }, [accessToken]);

    return (
        <div>
            <h2>User Information</h2>
            {userInfo ? (
                <div>
                    <p>ID: {userInfo.u_id}</p>
                    <p>Email: {userInfo.u_email}</p>
                    <p>Name: {userInfo.u_name}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default UserInformation;
