
---

# DevChat Client

## Overview

**DevChat** is an open-source messaging app built to help developers communicate and collaborate in real-time. The client is built with React and Vite, styled using Tailwind CSS and Daisy UI, and utilizes `react-icons` for icons. The app integrates with a Node.js/Express server and MongoDB database (managed by Mongoose) for the backend and uses Socket.io for real-time messaging. Deployment is configured for Vercel, ensuring seamless production-ready hosting.

## Features

- **Real-Time Messaging**: Powered by Socket.io for instant chat between users.
- **User Authentication**: Sign up, log in, password reset, and user profile management.
- **Chat Rooms and Direct Messages**: Organized chat for effective communication.
- **Responsive Design**: Tailored for mobile and desktop using Tailwind CSS and Daisy UI.
- **Icons**: Leverages `react-icons` for a modern UI experience.
- **Routing**: Handled via React Router for seamless navigation.
- **Vercel Deployment**: Effortless CI/CD pipeline with Vercel.

## Technologies Used

- **React**: UI Library.
- **Vite**: Fast bundling tool for modern web development.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI styling.
- **Daisy UI**: Tailwind component library for beautiful, responsive design.
- **React Icons**: Icon library for easy integration.
- **React Router**: Client-side routing solution.
- **Socket.io**: Real-time, bidirectional communication between the client and server.
- **TypeScript**: Strongly-typed language for scalable and maintainable code.

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **pnpm** (or npm/yarn)
- **Git**

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/luqmanshaban/devchat-app.git
cd devchat-app/client
```

### 2. Install Dependencies

The project uses **pnpm** for package management, but you can also use npm or yarn.

```bash
pnpm install
# or using npm
npm install
# or using yarn
yarn install
```

### 3. Set Up Configuration

The configuration for the client (such as server and socket URLs) is located in `config.ts`. Replace the placeholder values with your appropriate server and socket URLs.

```typescript
// config.ts
const Config = {
    serverUrl: 'your_server_url', // Example: http://localhost:4000/api/v1
    socketUrl: 'your_socket_url'  // Example: http://localhost:4000
}

export default Config;
```

### 4. Run the Development Server

To start the client app, run:

```bash
pnpm dev
# or using npm
npm run dev
# or using yarn
yarn dev
```

By default, the app should now be running on [http://localhost:5173](http://localhost:5173).

### 5. Build for Production

To create a production build, run:

```bash
pnpm build
# or using npm
npm run build
# or using yarn
yarn build
```

The output will be located in the `dist/` folder, ready for deployment.

## Project Structure

```
client/
│
├── public/                     # Static assets
├── src/                        # Main source code
│   ├── assets/                 # Images, fonts, etc.
│   ├── components/             # Reusable UI components
│   ├── pages/                  # Route components (login, signup, dashboard, etc.)
│   ├── services/               # API and WebSocket services
│   ├── App.tsx                 # Root component
│   └── index.tsx               # Entry point for the application
│
├── tailwind.config.js          # Tailwind CSS configuration
├── vite.config.ts              # Vite configuration
├── config.ts                   # Application config (modify this file for server/socket URLs)
└── vercel.json                 # Configuration for Vercel deployment
```

## Available Scripts

Here’s a list of the most common commands you can run in the client:

- **`pnpm dev`**: Starts the development server.
- **`pnpm build`**: Builds the app for production.
- **`pnpm preview`**: Previews the production build locally.
- **`pnpm lint`**: Lints the project using ESLint.

## Styling

The app is styled using **Tailwind CSS** and **Daisy UI**. Tailwind provides utility-first CSS classes for rapid UI development, while Daisy UI offers prebuilt components to enhance productivity.

- **Tailwind Configuration**: All Tailwind-related configurations are located in `tailwind.config.js`. Feel free to adjust according to your design needs.
- **Daisy UI**: Daisy UI is integrated for UI components like buttons, modals, and more.

## Routing

Routing is handled by **React Router**. The key routes are defined in `src/App.tsx`. Example routes include:

- `/login`: Login page
- `/signup`: Signup page
- `/chats`: Chats page (protected)
- `/users/:username`: User profile page (protected)

## WebSockets with Socket.io

The app uses **Socket.io** for real-time communication. The client connects to the Socket.io server defined in `config.ts`:

```typescript
const socket = io(Config.socketUrl);
```

Make sure your backend Socket.io server is running and accessible at the URL you define.

## Deployment

The app is configured for seamless deployment to **Vercel**.

### Vercel Deployment Steps

1. Connect your GitHub repository to Vercel.
2. Make sure to set up the following environment variables in Vercel:
   - `REACT_APP_SERVER_URL`: The URL of your backend server.
   - `REACT_APP_SOCKET_URL`: The URL of your Socket.io server.
3. Deploy the app by pushing changes to the repository. Vercel will automatically deploy the project.

For local builds, the deployment configuration is in the `vercel.json` file

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue for any feature requests or bugs you encounter.

### Steps to Contribute:

1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push the branch (`git push origin feature/new-feature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for more details.

---

Thank you for checking out **DevChat**! Happy coding!

---

### Notes:
- Ensure you modify the URLs in `config.ts` before running or deploying the app.
- Tailor the Vercel configuration for environment-specific variables when deploying to production.

