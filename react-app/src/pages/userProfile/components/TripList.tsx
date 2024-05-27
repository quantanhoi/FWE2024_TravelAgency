// TripList.tsx
import React , {useEffect, useState}from 'react';

import { useAuth } from '../../../providers/authProvider';
import { useNavigate } from 'react-router-dom';


interface Reise {
    r_id: number;
    r_name: string;
    r_bild: string;
    zeitraum: Zeitraum;
}
interface Zeitraum {
    z_id: number;
    z_startDate: string;
    z_endDate: string;
}
const TripList: React.FC = () => {
    const {accessToken} = useAuth();
    const [trips, setTrips] = useState<Reise[] | null>(null);
    const navigate = useNavigate();

    const handleCancelTrip = async (id: number) => {
        try{
            const response = await fetch(`http://localhost:3001/api/user/reises/remove/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `${accessToken}`
                }
            });
            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            alert('Trip successfully cancelled!');
            //refresh the page
            window.location.reload();
        }
        catch(error){
            console.error('Error canceling trip:', error);
        }
    };
    useEffect(() => {
        try {
            const fetchTripList = async () => {
                const response = await fetch('http://localhost:3001/api/user/reises', {
                    method: 'POST',
                    headers: {
                        'Authorization': `${accessToken}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched trip list:', data);
                setTrips(data);
            };
            if (accessToken) {
                fetchTripList();
            }
            else {
                console.warn('No access token provided');
            }
        }
        catch (error) {
            console.error('Error fetching trip list:', error);
        }
    }, [accessToken]);

    return (
        <div>
            <h2>Trip List</h2>
            {trips ? (
                <ul>
                    {trips.map((trip) => (
                        <li key={trip.r_id}>
                            <h3>{trip.r_name}</h3>
                            <img src={`/assets/${trip.r_bild}`} alt={`${trip.r_name}`} className='vh20' />
                            <p>Start Date: {new Date(trip.zeitraum.z_startDate).toLocaleDateString()}</p>
                            <p>End Date: {new Date(trip.zeitraum.z_endDate).toLocaleDateString()}</p>
                            <button onClick={() => handleCancelTrip(trip.r_id)} 
                            className='margin10 white-text white-border transparent-background'
                            >Cancel This Trip
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default TripList;
