# ChatApplication - MERN Stack

Welcome to Chatterly – a real-time chat application built using the MERN (MongoDB, Express.js, React, Node.js) stack.

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)

## Description

Chatterly is a modern, real-time chat application that allows users to communicate seamlessly. It provides a user-friendly interface for chatting with friends or colleagues in real-time.

## Features

- Real-time messaging
- User authentication
- One to one messaging
- Group messaging

## Technologies Used

- **Frontend:**
  - React
  - tailwind css
  - Socket.io (for real-time communication)
  - Shad cn library

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - Socket.io (for real-time communication)

# Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Nilesh9106/Chatterly.git
   ```
2. Install the dependencies for the server:

    ```bash
    cd server
    npm install 
    ```
3. Install the dependencies for the client:

    ```bash
    cd client
    npm install 
    ```
4. Create a `.env` file in the server folder and add the following:

    ```bash
    PORT=3000
    MONGO_URI=your mongodb url
    JWT_SECRET=your secret
    ```
5. Create a `.env` file in client folder and add the following:

    ```bash
    VITE_SOCKET=http://localhost:3000/
    VITE_API_URI=http://localhost:3000/api
    ```
6. Run the server:

    ```bash
    cd server
    npm start
    ```
7. Run the client:

    ```bash
    cd client
    npm start
    ```
8. Open http://localhost:3000/ in your browser.

## Usage

- Register a new account or login with an existing account.
- Create a new chat room. It can be one to one or group chat.
- select chat from sidebar to start chatting.
