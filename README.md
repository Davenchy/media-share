# MediaShare

**MediaShare** is a full-stack web application that allows users to upload, manage, and share media (images/videos). It includes a backend built with TypeScript, a web frontend built with React, and uses Docker to manage the services. The application supports basic user authentication, media upload (images/videos), and media interaction (like/unlike).

## Live Demo

You can try a live demo of the application here: [http://143.244.179.9](http://143.244.179.9).

Note: Since HTTPS certificates are not set up yet, you might need to disable HTTPS-only browsing from your browser settings to access the demo.

## Screenshots

To get a quick preview of the webapp's interface, including various screens, check out the [Screenshots file](images.md).

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
- A **backend server** container (`minly-server` service) that serves the API.
- A **frontend webapp** container (`minly-webapp` service) that runs the React app.

The webapp will be available at `http://localhost:8080`, and the backend API will be accessible at `http://localhost:3000`.

### Running Locally Without Docker

1. Follow the instructions in the backend and frontend README files to run them individually.

   - [Backend README](server/README.md)
   - [Frontend README](web_client/README.md)

1. Ensure the frontend is configured to point to the correct backend server.

### Docker Compose Configuration

The Docker Compose file (`docker-compose.yml`) includes the following services:

- **database**: MongoDB container.
- **minly-server**: The backend server.
- **minly-webapp**: The frontend web application.

```yml
services:
  database:
    container_name: database
    image: mongodb/mongodb-community-server:7.0-ubi9
    ports:
      - "27017:27017"
  minly-server:
    container_name: minly-server
    image: davenchy/minly-assignment-server
    ports:
      - "3000:3000"
    environment:
      SERVER_HOST: "0.0.0.0"
      SERVER_PORT: "3000"
      MONGO_HOST: "database"
      MONGO_PORT: "27017"
    restart: on-failure
    depends_on:
      - database
  minly-webapp:
    container_name: minly-webapp
    image: "davenchy/minly-assignment-webapp"
    build:
      context: web_client
      args:
        HOST_SERVER: "localhost"
      tags:
        - "davenchy/minly-assignment-webapp"
    ports:
      - "8080:80"
    restart: on-failure
    depends_on:
      - minly-server
```

### Mobile App

I have not yet developed the mobile app because I was not familiar with **React Native** and did not have enough time to learn it, build, and deploy the app within the assignment's time frame. However, I plan to study **React Native** soon and create a mobile version of **MediaShare** as part of my learning.

### Future Plans

I found the challenge to be very engaging and valuable, and I look forward to improving the code base by making it cleaner, more readable, and reusable. I also plan to study **React Native** so I can build the mobile version of this project. I now have a great foundation for that!

Thank you for your time and review.
