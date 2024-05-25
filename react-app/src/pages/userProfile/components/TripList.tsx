// TripList.tsx
import React from 'react';


interface Reise {
    r_id: number;
    r_name: string;
    r_start: string;
    r_end: string;
}
interface Zeitraum {
    z_id: number;
    z_startDate: string;
    z_endDate: string;
}
const TripList: React.FC = () => {
    return (
        <div>
            <h2>Trip List</h2>
            {/* Add list of trips here */}
        </div>
    );
};

export default TripList;
