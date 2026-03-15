# Real-Time Chat Application

A real-time, responsive chat application built using Node.js, Express, and Socket.io. This application allows users to join specific chat rooms and exchange messages instantly with other users in the same room.

## Features

*   **Real-time Messaging:** Low-latency message delivery powered by Socket.io.
*   **Chat Rooms:** Users can join specific rooms based on topics or groups.
*   **User Status:** View the list of active users in the current room and a real-time counter.
*   **System Notifications:** Broadcasted messages when a user joins or leaves the chat room.
*   **Responsive Design:** A fully responsive user interface that works seamlessly on desktop and mobile devices, including a collapsible sidebar for mobile views.
*   **Security:** Basic XSS (Cross-Site Scripting) protection is implemented to sanitize user inputs before rendering them in the chat.

## Technologies Used

### Frontend
*   HTML5
*   CSS3
*   Vanilla JavaScript

### Backend
*   [Node.js](https://nodejs.org/) - JavaScript runtime environment
*   [Express.js](https://expressjs.com/) - Web framework for Node.js
*   [Socket.io](https://socket.io/) - JavaScript library for real-time, bidirectional, and event-based communication

## Prerequisites

Before running the application, ensure you have the following installed on your system:
*   [Node.js](https://nodejs.org/en/download/) (v14 or higher recommended)
*   [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (Node Package Manager, installed with Node.js)

## Setup & Installation

1.  **Clone the repository (if applicable) or navigate to the project directory:**
    ```bash
    cd path/to/Real-Time-Chat-Application
    ```

2.  **Install the dependencies:**
    Run the following command to install required packages (`express` and `socket.io`):
    ```bash
    npm install
    ```

3.  **Start the server:**
    ```bash
    node server.js
    ```
    The server will start running on port `3000` by default (or the port defined by `process.env.PORT`).

4.  **Access the application:**
    Open your web browser and go to `http://localhost:3000`.

## Usage

1.  On the join screen, enter your desired **Username**.
2.  Select a **Room** from the dropdown menu (e.g., General, Code, News, Games).
3.  Click the **Join Chat** button.
4.  You can now type and send messages to other participants in the room.
5.  To leave the room, click the **Leave Room** button located in the sidebar on desktop or the top navigation bar on mobile.


