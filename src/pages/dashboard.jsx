import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const navigate = useNavigate();

  // Fetch sessions when the component loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    } else {
      fetchSessions(token);
    }
  }, [navigate]);

  // Function to fetch sessions from the backend
  const fetchSessions = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/sessions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  // Function to handle sending a message
  const handleSend = async () => {
    if (!currentSessionId) return alert('Please select or create a session first.');
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/session/${currentSessionId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: text })
      });
      const data = await response.json();
      setMessages(data.messages);
      setText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Function to create a new session
  const handleNewSession = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: `Session ${sessions.length + 1}` })
      });
      const newSession = await response.json();
      setSessions([...sessions, newSession]);
      setCurrentSessionId(newSession._id);
      setMessages([]);
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  // Function to handle clicking on a session
  const handleSessionClick = async (session) => {
    setCurrentSessionId(session._id);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/session/${session._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error('Error fetching session messages:', error);
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '20%', borderRight: '1px solid #ccc', padding: '10px' }}>
        <button onClick={handleNewSession}>New Session</button>
        <ul>
          {sessions.map(session => (
            <li
              key={session._id}
              style={{ cursor: 'pointer', margin: '5px 0' }}
              onClick={() => handleSessionClick(session)}
            >
              {session.name}
            </li>
          ))}
        </ul>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div style={{ flex: 1, padding: '10px' }}>
        <h2>Session Messages</h2>
        <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll' }}>
          {messages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message here..."
          rows="3"
          style={{ width: '100%' }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default Dashboard;
