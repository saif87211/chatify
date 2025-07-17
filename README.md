# Chatify 💬

A real-time chat application with individual and group messaging features.

## Project Description ✨

This project is a practice application that I built to dive into real-time communication and web development. It started as a personal chat application based on a helpful YouTube tutorial, and I've expanded it to include full-fledged group chat functionality. I also transitioned from Zustand to Redux for state management, big thanks to Hitesh Chaudhary and Harkirat Singh for their valuable content!

## Features 👍

*   **One-on-One Chat:** Connect and send direct messages to other users instantly. 🤝
*   **Group Chat:** Create groups, invite friends, and chat together in a shared space. 👥
*   **Real-time Updates:** Messages and user status updates appear in real-time, thanks to the magic of Socket.IO. ✨
*   **User Authentication:** Secure registration and login to keep your conversations private. 🔒

* **Typing Indicator:** See when other users are typing. ✍️

## Technologies Used 🛠️

*   **Frontend:**
    *   React
    *   Redux (for state management)
    *   React Router Dom
    *   Socket.IO Client
    *   Axios
    *   Tailwind CSS
    *   Daisy UI (for those sweet UI components)
    *   Lucide React (for sleek icons)
    *   React Hook Forms
    *   React Hot Toast (for awesome notifications)
*   **Backend:**
    *   Node.js
    *   Express.js
    *   Socket.IO
    *   Bcrypt
    *   Cloudinary (for effortless image uploading)
    *   Cookie-parser
    *   Cors
    *   Dotenv
    *   Jsonwebtoken
    *   Mongoose
    *   Morgan
    *   Zod
*   **Database:**
    *   MongoDB

## Getting Started 🚀

### Installation

1.  Clone the repository:
```bash
git clone "https://github.com/saif87211/chatify.git"
```
2.  Navigate to the project directory:
```bash
cd <frontend or backend>
```
3.  Install dependencies for the backend:
4.  Install dependencies for the frontend:
```bash
npm i
```
### Configuration ⚙️

1.  Create a `.env` file in the `backend/src` directory and add the following environment variables:
```
ORIGIN="your-frontend-url"
PORT=4000
MONGODB_URL="your_db_url"
DB_NAME="Chat_App"
TOKEN_SECRET="your_toekn_secret_key"
TOKEN_EXPIRY="5d"
CLOUDINARY_CLOUD_NAME="your_cloudinary_name"
CLOUDINARY_API_SECRET="your_cloudinary_secret"
CLOUDINARY_API_KEY="your_cloudinary_apikey"
```
2.  Create a `.env` file in the `frontend` directory and add the following environment variables:
```
VITE_SERVER_URL="your-backend-url"
```
### Running the Application ▶️

1.  Start the backend server by opening new terminal:
```bash
cd backend && npm run dev
```
2.  Start the frontend server by opening new terminal:
```bash
cd frontend && npm run dev
```
## Learning Resources 📚

* [Codesistency-Chat App](https://youtu.be/ntKkVrQqBYY?feature=shared)
* [Hitesh Chaudhary](https://www.youtube.com/@chaiaurcode)
* [Harkirat Singh](https://www.youtube.com/@harkirat1)

## Future Plans (Optional)

*   Move from a global user list to only showing users you've added or are in groups with.
*   Fetch only a limited number of messages when opening a chat for better performance. ⏳
