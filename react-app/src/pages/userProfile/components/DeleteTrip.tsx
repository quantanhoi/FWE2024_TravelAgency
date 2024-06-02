import React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "../../../providers/authProvider";
interface Reise {
    r_id: number;
    r_name: string;
    r_beschreibung: string;
    r_bild: string;
}

const DeleteTrip: React.FC = () => {
    const { accessToken } = useAuth();
    const [reiseList, setReiseList] = useState<Reise[]>([]);
    const deleteTrip = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:3001/api/reise/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            alert('Trip successfully deleted!');
            //refresh the page
            window.location.reload();
        }
        catch (error) {
            console.error('Error deleting trip:', error);
        }
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
            <h2>Delete a Trip</h2>
            <ul>
                {reiseList.map((reise) => (
                    <li key={reise.r_id}>
                        <h3>{reise.r_name}</h3>
                        <img src={`/assets/${reise.r_bild}`} alt={reise.r_name} className="vh20" />
                        <p>{reise.r_beschreibung}</p>
                        <button onClick={() => deleteTrip(reise.r_id)}
                            className="margin10 white-text white-border transparent-background">Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DeleteTrip;