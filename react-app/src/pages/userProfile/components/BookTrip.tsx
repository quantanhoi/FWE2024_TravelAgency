// BookTrip.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../providers/authProvider';

interface Reise {
    r_id: number;
    r_name: string;
    r_beschreibung: string;
    r_bild: string;
}



const BookTrip: React.FC = () => {
    const navigate = useNavigate();
    const {accessToken} = useAuth();
    const [reiseList, setReiseList] = useState<Reise[]>([]);
    const handleBookTrip = (id: number) => {
        navigate(`/trip/${id}`);
    };

    useEffect(() => {
        fetch('http://localhost:3001/api/reise', {
            headers: {
                'Authorization': `${accessToken}`
            }
        })
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setReiseList(data);
                }
            })
            .catch(error => {
                console.error('Error fetching trip list:', error);
            });
    }, [accessToken]);


    return (
        <div>
            <h2>Book a Trip</h2>
            <ul>
                {reiseList.map((reise) => (
                    <li key={reise.r_id}>
                        <h3>{reise.r_name}</h3>
                        <img src={`/assets/${reise.r_bild}`} alt={reise.r_name} className="vh20"/>
                        <p>{reise.r_beschreibung}</p>
                        <button onClick={() => handleBookTrip(reise.r_id)} 
                        className="margin10 white-text white-border transparent-background">Book</button>
                    </li>
                ))}
            </ul>
        </div>
    );
    
};

export default BookTrip;
