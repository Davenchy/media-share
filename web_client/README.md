# MediaShare WebApp

## Overview

**MediaShare WebApp** is a front-end application for the **MediaShare** backend, built using **React.js** and **Vite**. The webapp provides an intuitive user interface for media management, including media uploads, likes, and viewing both public and private media.

It uses modern web technologies to offer a fast and responsive experience, with a focus on clean and reusable components powered by **TailwindCSS** and **Shadcn**.

## Architecture

The webapp is structured to interact with the **MediaShare** backend API, allowing users to:

- Register and log in.
- Upload and manage images/videos.
- Like media content and view personal or public media.

The app is built using the following tools and packages:

- **React.js**: For building the user interface.
- **Vite**: As the build tool for fast development and production-ready builds.
- **Zod**: For data validation and ensuring consistent input.
- **React Hook Form**: For handling forms and managing form state.
- **Axios**: For making API requests to the backend.
- **TailwindCSS**: For styling the application.
- **Shadcn**: For UI components styled with TailwindCSS.

## Setup Instructions

### Prerequisites

- **Node.js** (LTS version) and **npm**.
- Docker (optional, for containerization).

### Configuration

To configure the server host and port, you need to set the following environment variables:

- **VITE_SERVER_HOST**: The host of the backend server (e.g., `http://localhost`).
- **VITE_SERVER_PORT**: The port the backend is running on (e.g., `8080`).

These variables are used at build time and will be embedded in the built files.

### Running Locally

1. Clone the repository and navigate to the project directory:

   ```bash
   git clone https://github.com/Davenchy/minly-sde-take-home-assignment.git
   cd web_client/
   ```

1. Install the dependencies:

   ```bash
   npm install
   ```

1. Set up the environment variables:

   - Create a `.env` file at the root of the project with the following content:

     ```bash

     # Set it to localhost or your pc local ip if you want to visit from other device

     VITE_SERVER_HOST=localhost

     VITE_SERVER_PORT=8080

     ```

1. Start the development server:

   ```bash
   npm run dev
   ```

   The webapp will be available at `http://localhost:3000`.

### Building the Webapp

To build the production-ready webapp, run:

```bash
npm run build
```

This command will:

- Compile the TypeScript files using `tsc -b`.
- Build the production assets using **Vite**.

### Previewing the Build

To preview the built app locally after building it:

```bash
npm run preview
```

This will start a local server that serves the production build.

### Docker Build (Optional)

If you want to build a Docker image for the webapp, you can pass build arguments `SERVER_HOST` and `SERVER_PORT`:

1. Build the Docker image:

   ```bash
   docker build --build-arg SERVER_HOST=<host> --build-arg SERVER_PORT=<port> -t mediashare-webapp .
   ```

1. Run the Docker container:

   ```bash
   docker run -p 8080:80 mediashare-webapp
   ```

This will build and serve the webapp in a container, available at `http://localhost:8080`.

## NPM Scripts

- **dev**: Start the development server using Vite.

  ```bash
  npm run dev
  ```

- **build**: Build the project using Vite and TypeScript.

  ```bash
  npm run build
  ```

- **lint**: Lint the project using ESLint.

  ```bash
  npm run lint
  ```

- **preview**: Preview the production build of the webapp.

  ```bash
  npm run preview
  ```

## API Endpoints

This webapp communicates with the **MediaShare Backend** API, which is described in the backend README file.

### Key Features

- **Login and Registration**: Allows users to authenticate.
- **Media Upload**: Users can upload images (JPEG, PNG formats) and videos (MP4) to the backend.
- **Media Viewing**: Users can view their own media, liked media, and public media from other users.
- **Media Likes**: Users can like and unlike media content.

## Additional Notes

- **Styling**: The webapp uses **TailwindCSS** for responsive and utility-first styling, with pre-built components from **Shadcn**.
- **Zod Validation**: **Zod** is used for input validation, ensuring that data passed through forms is valid and follows the expected schema.
- **React Hook Form**: Used for form management, which reduces the need for boilerplate code and simplifies handling form states.
