import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css'; // Ensure to import your styles

function Dashboard() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    } else {
      fetchSessions(token);
    }
  }, [navigate]);

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h3>Your Sessions</h3>
        <button onClick={handleNewSession}>New Session</button>
        <ul>
          {sessions.map(session => (
            <li
              key={session._id}
              onClick={() => handleSessionClick(session)}
            >
              {session.name}
            </li>
          ))}
        </ul>
        <button className="logout" onClick={handleLogout}>Logout</button>
      </div>
      <div className="main-content">
        <h2>Session Messages</h2>
        <div className="message-box">
          {messages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message here..."
          rows="3"
        />
        <button className="send-btn" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default Dashboard;
