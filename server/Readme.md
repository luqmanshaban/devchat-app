

# DevChat Server

## Overview

**DevChat** is an open-source, real-time messaging application for developers. The server-side code is built using **Node.js** and **Express**, with **MongoDB** as the database (managed by **Mongoose**), and **Socket.io** for real-time communication. This server handles authentication, chat functionality, WebSocket connections, and serves the RESTful API/v1 for the DevChat client.

## Features

- **Real-Time Messaging**: Powered by **Socket.io** for real-time, bidirectional communication.
- **User Authentication**: Sign up, login, and manage user sessions with JWT tokens.
- **MongoDB Database**: Efficient storage and retrieval of chat data, user info, etc.
- **RESTful API/v1**: Exposes a secure, scalable API/v1 for user, message, and chat management.
- **WebSocket Integration**: Real-time updates using Socket.io for chat and notifications.
- **Middleware**: Authentication and validation middleware using JWT and custom logic.
- **Scalable Deployment**: Configured for cloud hosting and continuous deployment.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Minimal and flexible Node.js web application framework.
- **MongoDB**: NoSQL database to store user and chat data.
- **Mongoose**: Elegant MongoDB object modeling for Node.js.
- **Socket.io**: Real-time, bidirectional communication between client and server.
- **JWT**: JSON Web Tokens for secure authentication.
- **dotenv**: Manage environment variables with `.env` files.

## Prerequisites

Before you get started, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (installed locally or accessible remotely)
- **pnpm** (or npm/yarn)
- **Git**

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/luqmanshaban/devchat-app.git
cd devchat/server
```

### 2. Install Dependencies

The project uses **pnpm** as the package manager, but you can also use npm or yarn.

```bash
pnpm install
# or using npm
npm install
# or using yarn
yarn install
```

### 3. Set Up Environment Variables

Copy the `example.env` file to `.env` and fill in the appropriate values:

```bash
cp example.env .env
```

Update the environment variables in the `.env` file:

```bash
# .env
MONGODB_URI=
JWT_SECRET=
EMAIL=
PASS=
CLIENT_URL=
SERVER_URL=
```

### 4. Run MongoDB

Make sure your MongoDB instance is running. If you are running MongoDB locally.

If using a cloud database service (e.g., MongoDB Atlas), ensure you set the appropriate `MONGODB_URI` in the `.env` file.

### 5. Start the Server

Start the server in development mode:

```bash
pnpm dev
# or using npm
npm run dev
# or using yarn
yarn dev
```

The server should now be running on `http://localhost:4000`.

### 6. Build for Production

To build and run the server for production:

```bash
pnpm build
# or using npm
npm run build
# or using yarn
yarn build

pnpm start
# or using npm
npm start
# or using yarn
yarn start
```

## Project Structure

```bash
server/
│
├── config/                    # Configuration files (database connection, etc.)
│   └── db.js                  # MongoDB connection setup
├── controllers/               # Request handlers for various API/v1 routes
│   └── userController.js      # User authentication, profile management, etc.
│   └── chatController.js      # Handles chat-related logic (messages, rooms, etc.)
├── middleware/                # Custom middleware (JWT auth, error handling, etc.)
│   └── verifyToken.js      # Authentication middleware for protected routes
├── model/                     # Mongoose models for MongoDB collections
│   └── User.js                # User model (schema and methods)
│   └── Message.js             # Message model
│   └── Chat.js            # Chat room model
├── routes/                    # Express.js route definitions
│   └── authRoutes.js          # Routes for authentication
│   └── chatRoutes.js          # Routes for chat functionalities
├── socket/                    # Socket.io event handlers and logic
│   └── socket.js              # WebSocket server configuration
├── index.js                   # Entry point of the server
├── example.env                # Example environment variable file
├── package.json               # Project metadata and scripts
└── pnpm-lock.yaml             # Dependency lock file
```

## API/v1 Endpoints

The DevChat server exposes a set of RESTful API/v1s for managing authentication, users, chats, and messages. Below are some key endpoints:

### **Authentication**

- `POST /api/v1/users/auth/login`: User login.
- `POST /api/v1/users/auth/signup`: User registration.
- `POST /api/v1/users/auth/reset-password`: Initiate password reset.

### **User**

- `GET /api/v1/users`: Get a list of users.
- `GET /api/v1/users/:id`: Get user profile by ID.
- `PUT /api/v1/users/profile`: Update the current user's profile.

### **Chats**

- `GET /api/v1/chats`: Get all chat rooms for the logged-in user.
- `POST /api/v1/chats`: Create a new chat room.
- `GET /api/v1/chats/:id/messages`: Get messages in a specific chat room.

## WebSockets with Socket.io

Real-time communication is handled using **Socket.io**. The Socket.io server is configured in the `socket/socket.js` file. Socket.io enables real-time messaging and notifications between clients and the server.

Example events include:

- **connect**: When a client connects.
- **message**: Sending and receiving messages in real-time.
- **disconnect**: When a client disconnects.


## Middleware

The server uses custom middleware to manage authentication, validation, and error handling:

- **JWT Authentication Middleware**: Protects routes that require authentication by verifying JWT tokens.
- **Error Handling Middleware**: Centralized error handling to catch and respond to server errors.



## Contributing

We welcome contributions! Please follow the steps below to contribute:

1. **Fork the repository**.
2. **Create a new branch** (`git checkout -b feature/new-feature`).
3. **Commit your changes** (`git commit -m 'Add some feature'`).
4. **Push to the branch** (`git push origin feature/new-feature`).
5. **Open a pull request**.

Feel free to open issues for any bug reports or feature requests.

## License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.

---

Thank you for checking out **DevChat**! Contributions, suggestions, and feedback are highly appreciated.

---

### Notes:

- Ensure you set the correct environment variables in `.env` before running the server.