import React, { useState } from 'react';
import axios from 'axios';

type LoginProps = {
  setToken: (token: string) => void;
};

const Login: React.FC<LoginProps> = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/user/login', {
        email,
        password,
      });
      const { jwtToken } = response.data;
      setToken(jwtToken);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Log In</button>
    </form>
  );
};

export default Login;
