# Chatify

A real-time chat application with individual and group messaging features.

## Project Description

This project is a practice application that I built to learn about real-time communication and web development. It started as a personal chat application based on a YouTube tutorial, and I have extended it to include group chat functionality. Also implemented redux state management instead of zustand all thanks to hitesh chaudhary & harkirat singh.

## Features

*   **One-on-One Chat:** Users can send direct messages to each other.
*   **Group Chat:** Users can create groups, invite members, and send messages within groups.
*   **Real-time Updates:** Messages and user status updates are delivered in real-time using Socket.IO.
*   **User Authentication:** Secure user registration and login.

## Technologies Used

*   **Frontend:**
    *   React
    *   Redux (for state management)
    *   React Router Dom
    *   Socket.IO Client
    *   Axios
    *   Tailwind CSS
    *   Daisy UI
    *   Lucide React (for Icons)
    *   React Hook forms
    *   React hot toast (for notification)
*   **Backend:**
    *   Node.js
    *   Express.js
    *   Socket.IO
    *   Bcrypt
    *   Cloudinary (for image uploading)
    *   Cookie-parser 
    *   Cors
    *   Dotenv
    *   Jsonwebtoken
    *   Mongoose
    *   Morgan
    *   Zod
*   **Database:**
    *   MongoDB

## Getting Started

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
### Configuration

1.  Create a `.env` file in the `backend` directory and add the following environment variables:
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
### Running the Application

1.  Start the backend server by opening new terminal:
```bash
cd backend && npm run dev
```
2.  Start the frontend server by opening new terminal:
```bash
cd frontend && npm run dev
```
## Learning Resources

* [Codesistency-Chat App](https://youtu.be/ntKkVrQqBYY?feature=shared)
* [Hitesh Chaudhary](https://www.youtube.com/@chaiaurcode)
* [Harkirat Singh](https://www.youtube.com/@harkirat1)

## Future Plans (Optional)

*   Containerized application
*   Instaed of every user is availabe for chat only those user whose you have add
*   User is Typing
