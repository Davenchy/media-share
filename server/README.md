# MediaShare Backend

## Overview

**MediaShare** is a media-sharing platform backend that allows users to upload, manage, and interact with media content like images and videos. The application supports user authentication, media management (upload, update, delete), and media interaction (likes). The backend is written in **TypeScript** and designed with scalability and modularity in mind.

## Architecture

- **Backend (Server)**: A RESTful API written in TypeScript, powered by Node.js and Express.
- **Authentication**: JWT-based authentication for secure user login and registration.
- **Media Management**: Supports uploading, updating, deleting, and streaming media (images and videos).
- **Data Storage**: MongoDB to store user data and media metadata.
- **Docker**: The application is containerized using Docker to ensure consistency across environments.

### Key Features

- User authentication (login and registration).
- Media file uploads (images and videos).
- User-specific media viewing (public and private).
- Media interaction through likes (like and unlike).
- Media streaming (currently limited, does not support range headers).
- Authenticated access to all endpoints.

## Setup Instructions

### Prerequisites

- Docker and Docker Compose installed.
- Node.js and npm (for local development).

### Configuration

1. **Set environment variables**:

   - `SERVER_HOST` = `0.0.0.0` (used in Docker to expose the server).
   - `TOKEN_SECRET` = _A strong secret key_ (used to sign JWT tokens).
   - `REFRESH_TOKEN_SECRET` = _A strong secret key_ (used to sign refresh tokens, which are disabled due to bugs).
   - `TOKEN_EXPIRES_IN` = `86400` (1 day, in seconds, since the refresh token feature is not working yet).

   These variables can be set in a `.env` file, or you can refer to `server/src/config.ts` for more details on environment configuration.

### Running the Server

The server expects MongoDB to be running on localhost:27017.

Or set the following environment variables:

- `MONGO_HOST` = `localhost`
- `MONGO_PORT` = `27017`

#### Option 1: Running with Docker Compose (Recommended)

1. Clone the repository and navigate to the project directory.

1. Build and start the application using Docker Compose:

   ```bash
   docker-compose up --build -d
   ```

1. This will pull the necessary Docker images and start both the frontend and backend services.

1. Once the containers are running, you can access the backend API at `http://localhost:3000`.

#### Option 2: Running Locally Without Docker

1. Install the required dependencies:

   ```bash
   npm install
   ```

1. Start the application in development mode with `nodemon`:

   ```bash
   npm run dev
   ```

1. The application will now be running locally at `http://localhost:3000`.

---

Also, you could compile to JavaScript and run it locally:

1. Install the required dependencies:

   ```bash
   npm install
   ```

1. Build the TypeScript code:

   ```bash
   npm run build
   ```

1. Start the application in development mode with `nodemon`:

   ```bash
   npm start
   ```

1. The application will now be running locally at `http://localhost:3000`.

### Docker Image

- **Docker Image**: `davenchy/minly-assignment-server`

- To build the image manually, you can run:

  ```bash
  docker build -t davenchy/minly-assignment-server .
  ```

- To run the Docker container:

  ```bash
  docker run -p 8080:8080 --env-file .env davenchy/minly-assignment-server
  ```

> Note: Don't forget to run MongoDB server in a container and set the container name to
> the `MONGO_HOST` environment variable.

## API Endpoints

### Auth Routes (Requires Authorization Header)

#### POST `/login`

- **Description**: Authenticates a user and returns an access token.

- **Request Body**:

  ```json
  {
    "username": "user_name",
    "password": "user_password"
  }
  ```

- **Response**:

  - `200 OK` on success with token.
  - `400 Bad Request` on invalid input (error messages in `errors` field).

#### POST `/register`

- **Description**: Registers a new user and returns an access token.

- **Request Body**:

  ```json
  {
    "username": "user_name",
    "password": "user_password"
  }
  ```

- **Response**:

  - `201 Created` on success.
  - `400 Bad Request` on invalid input (error messages in `errors` field).

### User Routes (Requires Authentication)

#### GET `/users/me`

- **Description**: Returns the authenticated user's data (ID, username, email).
- **Response**:
  - `200 OK` on success.

### Media Routes (Requires Authentication)

#### POST `/media`

- **Description**: Uploads a single media file (image or video).
- **Request Body**: `multipart/form-data` containing the file.
- **Response**:
  - `201 Created` on success.

#### GET `/media`

- **Description**: Fetches all public media of other users and both public and private media of the authenticated user.
- **Response**:
  - `200 OK` with media array.

#### GET `/media/my`

- **Description**: Fetches media uploaded by the authenticated user.
- **Response**:
  - `200 OK` with media array.

#### GET `/media/liked`

- **Description**: Fetches media liked by the authenticated user.
- **Response**:
  - `200 OK` with media array.

#### PUT `/media/:mediaId`

- **Description**: Updates the caption and visibility state of a media item.

- **Request Body**:

  ```json
  {
    "caption": "New Caption",
    "visibility": "public" | "private"
  }
  ```

- **Response**:

  - `200 OK` on success.
  - `400 Bad Request` on invalid body.

#### DELETE `/media/:mediaId`

- **Description**: Deletes a media item.
- **Response**:
  - `204 No Content` on success.

#### GET `/media/:mediaId/stream`

- **Description**: Streams a media file.
- **Note**: Does not support range headers yet.
- **Response**:
  - `200 OK` on success.

### Media Likes Routes (Requires Authentication)

#### POST `/media/:mediaId/likes`

- **Description**: Likes a media item.
- **Response**:
  - `200 OK` on success.

#### DELETE `/media/:mediaId/likes`

- **Description**: Unlikes a media item.
- **Response**:
  - `200 OK` on success.

## Testing

### Running Tests

To run tests, use the following command:

```bash
npm run test
```

### Running Tests in Watch Mode

To run tests in watch mode (re-runs tests on file changes), use:

```bash
npm run test:watch
```

Tests are written using **Jest** and **Supertest** to test the API endpoints.

## Additional Notes

- **Token Expiry**: Due to bugs with refresh tokens, you may want to set `TOKEN_EXPIRES_IN` to `86400` seconds (1 day) as a workaround.
- **Media File Support**: The backend currently only supports media file uploads in **JPEG, PNG, and MP4** formats.
- **Error Handling**: Errors are handled by custom middleware that returns appropriate HTTP statuses (e.g., `400` for invalid data, `404` for not found, `401` for unauthorized).
- **Limitations**: Streaming currently doesn't support range headers, meaning you can't seek media while streaming.
