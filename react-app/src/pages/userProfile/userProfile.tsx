// UserProfilePage.tsx
import React, { useState } from 'react';
import UserInformation from './components/UserInformation';
import TripList from './components/TripList';
import BookTrip from './components/BookTrip';
import './userProfile.css';
import Navigator from '../../components/navbar';

const UserProfilePage: React.FC = () => {
    const [activeComponent, setActiveComponent] = useState('info');

    return (
        <div className="App-header">
            <Navigator />
            <div className="vh100 flex-row white-border">
            <nav className="profile-nav white-border">
                <button onClick={() => setActiveComponent('info')}>User Information</button>
                <button onClick={() => setActiveComponent('trips')}>Trip List</button>
                <button onClick={() => setActiveComponent('book')}>Book a Trip</button>
            </nav>
            <div className="profile-content">
                {activeComponent === 'info' && <UserInformation />}
                {activeComponent === 'trips' && <TripList />}
                {activeComponent === 'book' && <BookTrip />}
            </div>
        </div>
        </div>
        
        
    );
};

export default UserProfilePage;
