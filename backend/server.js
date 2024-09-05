const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const User = require('./models/User');
const Session = require('./models/Session');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Replace with your MongoDB connection string
const mongoURI = `mongodb+srv://${encodeURIComponent("new-user-1")}:${encodeURIComponent("krishna8varma")}@cluster0.deaar.mongodb.net/your-db-name?retryWrites=true&w=majority`;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from "Bearer <token>"
  if (!token) return res.status(403).json({ message: 'No token provided!' });
  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) return res.status(500).json({ message: 'Failed to authenticate token.' });
    req.userId = decoded.userId;
    next();
  });
};

// Register (Sign Up)
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { loginIdentifier, password } = req.body;

  if (!loginIdentifier || !password) {
    return res.status(400).json({ message: 'Username or Email and Password are required.' });
  }

  try {
    // Find user by username or email
    const user = await User.findOne({ $or: [{ username: loginIdentifier }, { email: loginIdentifier }] });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username/email or password.' });
    }

    // Compare provided password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username/email or password.' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error });
  }
});

// Create a new session
app.post('/session', verifyToken, async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Session name is required.' });
  }

  try {
    const session = new Session({ name, userId: req.userId });
    await session.save();
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: 'Error creating session', error });
  }
});

// Add a message to a session
app.post('/session/:id/message', verifyToken, async (req, res) => {
  const { message } = req.body;
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    session.messages.push(message);
    await session.save();
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: 'Error adding message', error });
  }
});

// Get all sessions for a user
app.get('/sessions', verifyToken, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.userId });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions', error });
  }
});

// Get messages for a session
app.get('/session/:id', verifyToken, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching session', error });
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
