import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [loginIdentifier, setLoginIdentifier] = useState(''); // For login
  const [loginPassword, setLoginPassword] = useState('');
  const [signUpUsername, setSignUpUsername] = useState(''); // For registration
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const navigate = useNavigate();

  
  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loginIdentifier, password: loginPassword }),
      });
  
      const data = await response.json();
  
      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        alert('Login failed!');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const handleSignUp = async () => {
    // Ensure all fields are filled
    if (!signUpUsername || !signUpEmail || !signUpPassword) {
      alert('Please fill in all registration fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: signUpUsername, email: signUpEmail, password: signUpPassword }),
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Login</h2>
      <input 
        type="text" 
        placeholder="Username or Email" 
        value={loginIdentifier} 
        onChange={(e) => setLoginIdentifier(e.target.value)} 
      />
      <br />
      <input 
        type="password" 
        placeholder="Password" 
        value={loginPassword} 
        onChange={(e) => setLoginPassword(e.target.value)} 
      />
      <br />
      <button onClick={handleLogin}>Login</button>
      <br />
      <h2>Sign Up</h2>
      <input 
        type="text" 
        placeholder="Username" 
        value={signUpUsername} 
        onChange={(e) => setSignUpUsername(e.target.value)} 
      />
      <br />
      <input 
        type="email" 
        placeholder="Email" 
        value={signUpEmail} 
        onChange={(e) => setSignUpEmail(e.target.value)} 
      />
      <br />
      <input 
        type="password" 
        placeholder="Password" 
        value={signUpPassword} 
        onChange={(e) => setSignUpPassword(e.target.value)} 
      />
      <br />
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
}

export default LoginPage;
