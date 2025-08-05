# Personal Cabinet

A full-stack Nuxt 3 application implementing a personal cabinet with user authentication and profile management.

## Overview

This project is a minimal full-stack application built with Nuxt 3 to demonstrate user authentication and profile management. It allows users to register, log in, view/edit their profile (name, email, password), and log out. The backend logic is handled within Nuxt's server routes, eliminating the need for a separate backend server.

## Features

* Registration: Create a new user account with email, password, and name.

* Login/Logout: Authenticate users and issue a JWT token; logout clears the session.

* Profile Management: View and update user profile details (name, email, password).

* Protected Routes: The /profile page is accessible only to authenticated users.

* Secure API: Server-side API endpoints are protected with JWT authentication.

## Technologies Used

Frontend: Nuxt 3, Vue 3 (Composition API), Pinia, TypeScript

Backend: Nuxt 3 Server Routes, MongoDB, Mongoose, JSON Web Tokens (JWT), bcryptjs

## How It Works

Authentication:

* Users register via /register with email, password, and name. The password is hashed using bcryptjs and stored in MongoDB.

* Login at /login verifies credentials and issues a JWT, stored in localStorage via Pinia.

* Logout clears the Pinia store and redirects to /login.

Profile Management:

* The /profile page displays the user's name and email, allowing updates (including optional password changes).

* Updates are sent to the /api/profile endpoint, which validates the JWT and updates the MongoDB document.

Security:

* Client-side: The middleware/auth.ts ensures only authenticated users (with a valid token in Pinia) can access /profile.

* Server-side: The server/middleware/auth.ts validates JWT for API requests to /api/profile.

* MongoDB stores user data securely, with passwords hashed.

State Management:

* Pinia store (stores/user.ts) uses Composition API to manage user (profile data) and token.

* State is persisted in localStorage to maintain sessions across page reloads.

## API Endpoints

POST /api/auth/register: Register a new user.

* Body: { "email": "string", "password": "string", "name": "string" }

POST /api/auth/login: Authenticate and receive a JWT.

* Body: { "email": "string", "password": "string" }

GET /api/profile: Get user profile (requires JWT in Authorization: Bearer <token>).

PUT /api/profile: Update user profile (requires JWT).

* Body: { "name": "string", "email": "string", "password": "string" } (password optional)
