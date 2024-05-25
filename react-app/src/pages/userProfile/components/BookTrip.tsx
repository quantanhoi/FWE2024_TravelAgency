// BookTrip.tsx
import React from 'react';

const BookTrip: React.FC = () => {
    const availableTrips = [
        { id: 1, name: 'Trip to Berlin' },
        { id: 2, name: 'Trip to Paris' },
    ];

    const handleBook = (tripId: number) => {
        console.log('Book trip with ID:', tripId);
    };

    return (
        <div>
            <h2>Book a Trip</h2>
            <ul>
                {availableTrips.map(trip => (
                    <li key={trip.id}>
                        {trip.name} <button onClick={() => handleBook(trip.id)}>Book</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookTrip;
