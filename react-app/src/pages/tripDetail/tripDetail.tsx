import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/authProvider";
import Navigator from "../../components/navbar";

interface Reise {
    r_id: number;
    r_name: string;
    r_beschreibung: string;
    r_bild: string;
    zeitraum: Zeitraum;
    reiseziels: Reiseziel[];
}

interface Zeitraum {
    z_id: number;
    z_startDate: string;
    z_endDate: string;
}

interface Reiseziel {
    rz_id: number;
    rz_Name: string;
    rz_Beschreibung: string;
    rz_Bild: string;
}

const TripDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [trip, setTrip] = useState<Reise | null>(null);
    const { accessToken } = useAuth();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/reise/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${accessToken}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched trip:', data);
                setTrip(data);
            } catch (error) {
                console.error('Error fetching trip:', error);
            } finally {
                setLoading(false);
            }
        };

        if (accessToken) {
            fetchTrip();
        } else {
            console.warn('No access token provided');
        }
    }, [accessToken, id]);


    //handle confirm booking trip button
    const handleBookTrip = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/user/reises/add/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Trip booked:', data);
            alert('Trip successfully booked!');
            navigate('/user'); // Navigate to user's trips page or any other page after booking
        } catch (error) {
            console.error('Error booking trip:', error);
            alert('Failed to book the trip. Please try again.');
        }
    };

    return (
        <div className="header flex-column">
            <Navigator />
            {loading ? (
                <p>Loading...</p>
            ) : trip ? (
                <div className="flex-column">
                    <h1>{trip.r_name}</h1>
                    <p>{trip.r_beschreibung}</p>
                    <img src={`/assets/${trip.r_bild}`} alt={trip.r_name} />
                    <h2 className="margin-top-bot10vh">What you discovered in this lovely trip</h2>
                    {trip.reiseziels.map((ziel) => (
                        <div key={ziel.rz_id}>
                            <h3>{ziel.rz_Name}</h3>
                            <p>{ziel.rz_Beschreibung}</p>
                            <img src={`/assets/${ziel.rz_Bild}`} alt={ziel.rz_Name} />
                        </div>
                    ))}
                    <button onClick={handleBookTrip} 
                    className="margin10 white-text white-border transparent-background font-size-5vh margin-top-bot10vh">Confirm Book This Trip</button>
                </div>
            ) : (
                <p>Trip not found</p>
            )}
        </div>
    );
};

export default TripDetailPage;
