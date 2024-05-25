import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/authProvider';

const Navigator: React.FC = () => {
    const navigate = useNavigate();
    const { onLogout } = useAuth();

    const handleLogout = () => {
        onLogout();
    };

    return (
        <nav className= "flex-row margin10">
            <div>
                <button className= "margin10 white-text white-border transparent-background" onClick={() => navigate('/')}>Home</button>
            </div>
            <div>
                <button className= "margin10 white-text white-border transparent-background" onClick={() => navigate('/user')}>User Profile</button>
            </div>
            <div>
                <button className= "margin10 white-text white-border transparent-background" onClick={handleLogout}>Log Out</button>
            </div>
        </nav>
    );
};

export default Navigator;
