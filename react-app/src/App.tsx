import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { useAuth } from './providers/authProvider';
import Navigator from './components/navbar';
import { useNavigate } from 'react-router-dom';

export interface Reise {
  r_id: number;
  r_name: string;
  r_beschreibung: string;
  r_bild: string;
  zeitraum: Zeitraum;
}

export interface Zeitraum {
  z_id: number;
  z_startDate: string;
  z_endDate: string;
}

function App() {
  const { accessToken } = useAuth();
  const [reiseList, setReiseList] = useState<Reise[]>([]);
  const [searchParams, setSearchParams] = useState({ name: '', startDate: '', endDate: '' });
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/reise/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${accessToken}`
        },
        body: JSON.stringify({
          name: searchParams.name,
          startDate: searchParams.startDate,
          endDate: searchParams.endDate
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Reise[] = await response.json();
      console.log(data);
      setReiseList(data);
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

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
        } else {
          console.error('Data is not an array:', data);
        }
      })
      .catch(error => console.error('Error:', error));
  }, [accessToken]);

  return (
    <div className="App">
      <header className="App-header">
        <Navigator />
        <img src={logo} className="App-logo vh6" alt="logo" />
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name"
            value={searchParams.name}
            onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
            className="font-size-3vh transparent-background white-text white-border margin10"
          />
          <input
            type="date"
            placeholder="Start Date"
            value={searchParams.startDate}
            onChange={(e) => setSearchParams({ ...searchParams, startDate: e.target.value })}
            className="font-size-3vh transparent-background white-text white-border margin10"
          />
          <input
            type="date"
            placeholder="End Date"
            value={searchParams.endDate}
            onChange={(e) => setSearchParams({ ...searchParams, endDate: e.target.value })}
            className="font-size-3vh transparent-background white-text white-border margin10"
          />
          <button onClick={handleSearch} className="font-size-3vh transparent-background white-text white-border margin10">
            Search
          </button>
        </div>
        {reiseList.map((reise: Reise) => (
          <div className="flex-column" key={reise.r_id}>
            <h2 className="margin10 margin-top10vh">{reise.r_name}</h2>
            <p>{reise.r_beschreibung}</p>
            <p>{new Date(reise.zeitraum.z_startDate).toLocaleDateString()} - {new Date(reise.zeitraum.z_endDate).toLocaleDateString()}</p>
            <img src={`/assets/${reise.r_bild}`} alt={reise.r_name} className="vh50" />
            <button
              className="margin10 white-text white-border transparent-background font-size-5vh"
              onClick={() => handleBookTrip(reise.r_id)}
            >
              Book Trip
            </button>
          </div>
        ))}
      </header>
    </div>
  );
}

export default App;
