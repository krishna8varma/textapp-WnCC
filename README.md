How to connect and run:
-> You must have installed Node.js in your system
-> Fork the repo
-> Open the terminal cd to the repopath
-> run command npm install or npm i
-> Dissconect the iitb wifi and connect to your mobile network(Firewall restricts the MONGODB access)
-> In terminal:cd backend
-> after that in terminal:node server.js
-> cd to the repopath again
-> run command npm start
-> Open localhost:3000 in your browser to view the webpage

Description
    Fully functional web application allowing users to:
    Register and log in.
    Create sessions.
    Send and receive messages.
    Manage chat sessions.
    Frontend built with React.
    Backend built using Node.js, Express, and MongoDB.
    Technologies Used
Backend
    Node.js: JavaScript runtime for server-side programming.
    Express: Web framework for building API routes.
    MongoDB: NoSQL database for storing user and session data.
    Mongoose: ODM for MongoDB to interact with the database.
    JWT (jsonwebtoken): For user authentication with JSON Web Tokens.
    bcryptjs: For securely hashing and comparing passwords.
    Cors: Enables cross-origin requests from the frontend.
    Body-parser: Middleware for parsing incoming request bodies.
Frontend
    React: JavaScript library for building user interfaces.
    React Router: Manages routing between login and dashboard pages.
    Other Technologies
    MongoDB Atlas: Cloud-hosted MongoDB database.
    JWT (JSON Web Token): User authentication and session management.
    CSS: Styling for the frontend.
API Endpoints
    Authentication
     Register (Sign Up):

        Endpoint: /register
        Method: POST
        Request Body:
        json
        Copy code
        {
        "username": "newuser",
        "email": "newuser@example.com",
        "password": "securepassword"
        }
        Response:
        201 Created: User registered successfully.
        400 Bad Request: Username or email already exists.
        500 Internal Server Error: Registration error.
        Login:

        Endpoint: /login
        Method: POST
        Request Body:
        json
        Copy code
        {
        "loginIdentifier": "usernameOrEmail",
        "password": "userpassword"
        }
        Response:
        200 OK: JWT token provided.
        400 Bad Request: Invalid input.
        401 Unauthorized: Incorrect credentials.
        500 Internal Server Error: Login error.
        Session Management
        Create a New Session:

        Endpoint: /session
        Method: POST
        Headers: Authorization: Bearer <JWT_TOKEN>
        Request Body:
        json
        Copy code
        {
        "name": "Session Name"
        }
        Response:
        200 OK: New session created.
        400 Bad Request: Missing session name.
        500 Internal Server Error: Session creation error.
        Add a Message to a Session:

        Endpoint: /session/:id/message
        Method: POST
        Headers: Authorization: Bearer <JWT_TOKEN>
        Request Body:
        json
        Copy code
        {
        "message": "Hello, this is a message."
        }
        Response:
        200 OK: Message added to session.
        404 Not Found: Session not found.
        500 Internal Server Error: Message addition failed.
        Get All Sessions for a User:

        Endpoint: /sessions
        Method: GET
        Headers: Authorization: Bearer <JWT_TOKEN>
        Response:
        200 OK: List of user sessions.
        500 Internal Server Error: Retrieval error.
        Get Messages for a Session:

        Endpoint: /session/:id
        Method: GET
        Headers: Authorization: Bearer <JWT_TOKEN>
        Response:
        200 OK: Session details and messages.
        404 Not Found: Session not found.
        500 Internal Server Error: Retrieval error.

Database Schema
    User Schema
        username: String, required, unique
        email: String, required, unique
        password: String, required
    Session Schema
        name: String, required (Session name)
        userId: ObjectId, required (References the user who created the session)
        messages: Array of Strings (Messages sent in this session)
    User Schema
        The UserSchema defines a user document in MongoDB with four fields: username (unique and required), email (unique and required), password (hashed and required), and createdAt (automatically set to the current date). This schema ensures that each user has a unique username and email, while securely storing the password in hashed form. The createdAt field tracks the user creation time automatically.