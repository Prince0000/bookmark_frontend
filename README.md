# Bookmark Frontend

This README provides an overview and instructions for a React.js website with various functionalities including JWT authentication, bookmark management, collection management, filtering, and search functionality.

## Features:

1. **JWT Authentication**: Users can sign up, log in, and log out securely using JSON Web Tokens (JWT) for authentication.

2. **Bookmark Management**:
   - **Add Bookmark**: Users can add bookmarks to save their favorite web pages.
   - **Delete Bookmark**: Users can remove bookmarks they no longer need.

3. **Collection Management**:
   - **Add Collection**: Users can create collections to organize their bookmarks.
   - **Delete Collection**: Users can delete collections along with their associated bookmarks.

4. **Filtering**: Users can filter bookmarks according to tags and collections to easily find relevant content.

5. **Search Functionality**: Users can search through bookmarks using keywords to quickly locate specific items.

## Setup Instructions:

1. **Clone the Repository**:
   ```
   git clone https://github.com/Prince0000/bookmark_frontend
   cd bookmark_frontend
   ```

2. **Install Dependencies**:
   ```
   npm install
   ```


3. **Run the Application**:
   ```
   npm start
   ```
   This will start the development server and open the website in your default browser.

4. **Build for Production**:
   ```
   npm run build
   ```
   This command will create a production-ready build of the website.

## Tech Stack:

- **Frontend**:
  - React.js: JavaScript library for building user interfaces.
  - React Router: For handling routing within the application.
  - Axios: For making HTTP requests to the backend API.
  - Bootsrtap: For designing responsive and visually appealing user interfaces.

- **Backend**: (Assuming separate backend API)
  - Node.js: JavaScript runtime for building scalable server-side applications.
  - Express.js: Web application framework for Node.js, used for building RESTful APIs.
  - MongoDB: NoSQL database for storing user information, bookmarks, and collections.
  - JSON Web Tokens (JWT): For secure authentication and authorization.

