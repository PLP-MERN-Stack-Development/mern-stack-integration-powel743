# MERN Blog Project
## Overview
This is a full-stack blogging platform built using the MERN (MongoDB, Express, React, Node.js) stack. It features robust user authentication, CRUD operations for blog posts and categories, dynamic filtering/pagination, and secure image uploading.

## Key Features   
User Management (Authentication): Secure registration, login, and logout using JSON Web Tokens (JWT) stored in HTTP-only cookies.
- Role-Based Content: Only authenticated users can create, edit, and delete their own posts.
- Post Management (CRUD): Create, Read, Update, and Delete blog posts.
- Category Management: Posts can be assigned to different categories, which are manageable via the backend.
-Image Uploads: Secure handling of file uploads for featured images using Multer.
- Dynamic Filtering/Search: Filter posts by category or search by keywords in the title/content.
- Pagination: Efficiently loads posts, handling large datasets by splitting them into pages.
- Responsive Design: Built with Tailwind CSS for a modern, mobile-friendly interface.

## API Documentation
The backend API is the core of the application, serving data to the client. All API routes are prefixed with /api

|Route            |Method|Description                                        |Access             |Body/Params                            |
|-----------------|------|---------------------------------------------------|-------------------|---------------------------------------|
|/api/users       |POST  |Register a new user.                               |Public             |name, email, password                  |
|/api/users/login |POST  |Authenticate a user and get a JWT cookie.          |Public             |email, password                        |
|/api/users/logout|POST  |Clear the JWT cookie and log out.                  |Private            |None                                   |
|/api/posts       |GET   |Fetch all posts with optional filtering/pagination.|Public             |Query: keyword, category, pageNumber   |
|/api/posts/:id   |GET   |Fetch a single post by ID.                         |Public             |Param: id                              |
|/api/posts       |POST  |Create a new post.                                 |Private            |title, content, category, featuredImage|
|/api/posts/:id   |PUT   |Update an existing post (must be user's own).      |Private            |Param: id. Body: Post fields.          |
|/api/posts/:id   |DELETE|Delete a post (must be user's own).                |Private            |Param: id                              |
|/api/categories  |GET   |Fetch all categories.                              |Public             |None                                   |
|/api/categories  |POST  |Create a new category.                             |Private (Admin/Dev)|name                                   |
|/api/upload      |POST  |Upload a featured image file.                      |Private            |image (Multipart Form Data)            |


## Technologies Used
|Category      |Technology                    |Description                                                    |
|--------------|------------------------------|---------------------------------------------------------------|
|Frontend      |React                         |Component-based UI development.                                |
|State/Routing |React Router DOM & Context API|Client-side routing and global authentication state management.|
|Styling       |Tailwind CSS                  |Utility-first CSS framework for rapid styling.                 |
|Build Tool    |Vite                          |Next-generation frontend tooling for faster development.       |
|Backend       |Node.js & Express             |Fast, unopinionated backend framework.                         |
|Database      |MongoDB & Mongoose            |NoSQL database with an object data modeling (ODM) layer.       |
|Authentication|JWT & bcrypt                  |Secure user sessions and password hashing.                     |

## Getting Started
Follow these steps to get your local development environment running.
- Prerequisites
- .js (LTS recommended)
- npm (or yarn)
- MongoDB Atlas Account (or local MongoDB installation)

1. Clone the RepositoryBashgit clone <YOUR_REPO_URL>
cd mern-blog-project
2. Environment VariablesCreate a file named .env in the root of the /server directory and add your configuration details:# .env (in the /server folder)
NODE_ENV=development
PORT=5000
MONGO_URI=<YOUR_MONGO_DB_CONNECTION_STRING>
JWT_SECRET=<YOUR_LONG_RANDOM_SECRET_STRING>
3. Install DependenciesInstall dependencies for both the client and server:Bash# Install Server dependencies
cd server
npm install

### Install Client dependencies
cd ../client
npm install

### Return to the server directory for combined run
cd ..\server
4. Seed the Database (Initial Data)Run the seeder script to populate your database with initial categories:Bashnpm run data:import
5. Create Uploads FolderManually create an empty folder named uploads inside the /server directory to store image files.6. Run the ApplicationExecute the combined development script from the /server folder:Bashnpm run dev
The application will launch both the back-end (on port 5000) and the front-end (on port 5173 or similar). Open your browser to the client URL provided by Vite (e.g., http://localhost:5173/).

## Deployment
This application is set up for a common deployment strategy:

Component,                Recommended Service,            Strategy
Frontend (React),         Vercel / Netlify,               Build and serve static files.
Backend (Node/Express),   Render / Railway,               Continuous deployment of the Node.js API.
Database (MongoDB),       MongoDB Atlas,                  Hosted NoSQL database service.