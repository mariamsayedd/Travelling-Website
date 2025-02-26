# Travelling Website

## Project Overview
This project is a simple travelling website built using:
- **Node.js**
- **Express**
- **MongoDB**
- **EJS**

**Note**: Most of the frontend (HTML & CSS) was already prepared. The focus of this project is on backend development and integrating the frontend with the server logic.

It allows users to:
- Register and log in.
- Browse destinations by category (e.g., Beaches, Mountains).
- Add destinations to their "Want-to-Go List".
- Search for destinations by name.
- View embedded videos for destinations.

## Features
- **User Authentication**:
  - Login and registration with MongoDB storage.
  - Error messages for invalid credentials or duplicate usernames.
- **Destination Categories**:
  - Browse destinations by category (e.g., Beaches, Mountains).
- **Want-to-Go List**:
  - Add destinations to a personal list.
  - View and manage the list.
- **Search**:
  - Search for destinations by name.
  - Display results with clickable links to destination pages.
- **Responsive Design**:
  - Built with EJS templates for dynamic content.

## Technologies Used
- **Backend**:
  - Node.js
  - Express
  - MongoDB
- **Frontend**:
  - EJS (Embedded JavaScript)
  - HTML
  - CSS
- **Database**:
  - MongoDB (`myDB` with collection `myCollection`).
- **Session Management**:
  - Express-Session for user sessions.
