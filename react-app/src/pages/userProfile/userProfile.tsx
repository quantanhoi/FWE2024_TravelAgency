// UserProfilePage.tsx
import React, { useState, useEffect } from 'react';
import UserInformation from './components/UserInformation';
import TripList from './components/TripList';
import BookTrip from './components/BookTrip';
import AddTrip from './components/AddTrip';
import './userProfile.css';
import Navigator from '../../components/navbar';
import { useAuth } from '../../providers/authProvider';
import DeleteTrip from './components/DeleteTrip';



interface User {
    u_id: number;
    u_email: string;
    u_name: string;
    u_isadmin: boolean;
}
const UserProfilePage: React.FC = () => {
    const { accessToken } = useAuth();
    const [activeComponent, setActiveComponent] = useState('info');
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
        <div className="App-header">
            <Navigator />
            <div className="vh100 flex-row white-border">
            <nav className="profile-nav white-border">
                <button onClick={() => setActiveComponent('info')}>User Information</button>
                <button onClick={() => setActiveComponent('trips')}>Trip List</button>
                <button onClick={() => setActiveComponent('book')}>Book a Trip</button>
                {userInfo?.u_isadmin && (
                        <>
                            <button onClick={() => setActiveComponent('add')}>Add Trip to Database</button>
                            <button onClick={() => setActiveComponent('delete')}>Delete Trip from Database</button>
                        </>
                    )}
            </nav>
            
            <div className="profile-content">
                {activeComponent === 'info' && <UserInformation />}
                {activeComponent === 'trips' && <TripList />}
                {activeComponent === 'book' && <BookTrip />}
                {activeComponent === 'add' && <AddTrip />}
                {activeComponent === 'delete' && <DeleteTrip />}
            </div>
        </div>
        </div>
        
        
    );
};

export default UserProfilePage;
