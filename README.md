# MediaShare

### Repo README

**MediaShare** is a full-stack web application that allows users to upload, manage, and share media (images/videos). It includes a backend built with TypeScript, a web frontend built with React, and uses Docker to manage the services. The application supports basic user authentication, media upload (images/videos), and media interaction (like/unlike).

To enhance user experience, MediaShare features **real-time notifications** using **Server-Sent Events (SSE)**. When a user performs an action such as uploading, updating, or deleting media, or interacting via likes, other users receive a live refresh event, prompting them to refetch the updated media. This functionality ensures users always see the latest content without needing to manually reload.

## Screenshots

To get a quick preview of the webapp's interface, including various screens, check out the [Screenshots file](images.md).

## Real-Time Updates with Server-Sent Events (SSE)

MediaShare utilizes **Server-Sent Events (SSE)** to provide real-time updates to users. When any user action (such as media upload, update, deletion, like, or unlike) occurs, other users listening to the events will receive a **refresh notification** to refetch the latest media. Key points:

- SSE is integrated into the backend at the `/events` endpoint, which is **auth-guarded**.
- Each client subscribes to `/events` upon login to receive updates.
- The triggering user does not receive the event themselves, ensuring efficient data handling.
- The events system is **debounced** to reduce server load from frequent updates.

For detailed instructions on enabling SSE in the backend and frontend, refer to the respective `README` files.

## Project Structure

The project is divided into three main components:

1. **Backend** (`server` directory):

   - Built with TypeScript and provides APIs for user authentication, media management, and more.
   - More details in the [server README](server/README.md).

1. **Frontend** (`web_client` directory):

   - Built with React and Vite, it provides the user interface to interact with the backend.
   - More details in the [webapp README](web_client/README.md).

1. **Docker Compose**:

   - Docker Compose configuration for running the backend, frontend, and database locally.

## Setup Instructions

### Prerequisites

- **Docker** and **Docker Compose** installed on your machine.
- Modify the configuration as per your requirements (e.g., set `SERVER_HOST` and `SERVER_PORT`).

### Running the Application Locally

To run the full application locally using Docker Compose:

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd MediaShare
   ```

1. Make sure Docker is running on your system.

1. Modify the `docker-compose.yml` file:

   - Set the `HOST_SERVER` to your backend server IP or hostname (e.g., `localhost`).
   - Adjust any other configurations as needed (e.g., database settings).

1. Start the application:

   ```bash
   docker-compose up --build
   ```

This command will start:

- A **MongoDB** container (`database` service) for data storage.
- A **backend server** container (`media-share-server` service) that serves the API.
- A **frontend webapp** container (`media-share-webapp` service) that runs the React app.

The webapp will be available at `http://localhost:8080`, and the backend API will be accessible at `http://localhost:3000`.

### Running Locally Without Docker

1. Follow the instructions in the backend and frontend README files to run them individually.

   - [Backend README](server/README.md)
   - [Frontend README](web_client/README.md)

1. Ensure the frontend is configured to point to the correct backend server.

### Docker Compose Configuration

The Docker Compose file (`docker-compose.yml`) includes the following services:

- **database**: MongoDB container.
- **media-share-server**: The backend server.
- **media-share-webapp**: The frontend web application.

```yml
services:
  database:
    container_name: database
    image: mongodb/mongodb-community-server:7.0-ubi9
    expose:
      - 27017
    volumes:
      - mongodb_data:/data/db
  server:
    # to change container name, you have to rebuild the webapp image with then
    # new server host name
    container_name: media-share-server
    image: davenchy/media-share-server
    ports:
      - "3000:3000"
    environment:
      SERVER_HOST: '0.0.0.0'
      SERVER_PORT: '3000'
      MONGO_HOST: 'database'
      MONGO_PORT: '27017'
    restart: on-failure
    depends_on:
      - database
    volumes:
      - uploads:/app/uploads
  webapp:
    container_name: media-share-webapp
    image: "davenchy/media-share-webapp"
    build:
      context: web_client
      args:
        HOST_SERVER: "media-share-server"
      tags:
        - "davenchy/media-share-webapp"
    ports:
      - '80:80'
    restart: on-failure
    depends_on:
      - media-share-server

volumes:
  mongodb_data:
  uploads:
```

### Mobile App

I have not yet developed the mobile app because I was not familiar with **React Native** and did not have enough time to learn it, build, and deploy the app within the assignment's time frame. However, I plan to study **React Native** soon and create a mobile version of **MediaShare** as part of my learning.

### Future Plans

I found the challenge to be very engaging and valuable, and I look forward to improving the code base by making it cleaner, more readable, and reusable. I also plan to study **React Native** so I can build the mobile version of this project. I now have a great foundation for that!

Thank you for your time and review.
