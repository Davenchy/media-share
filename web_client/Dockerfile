
# Adjust BUN_VERSION as desired
FROM oven/bun:slim AS base

# Bun app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base AS build


# Install packages needed to build node modules
# RUN apt-get update -qq && \
#     apt-get install --no-install-recommends -y build-essential pkg-config python-is-python3

# Install node modules
COPY bun.lockb package.json ./
RUN bun install

# Copy application code
COPY . .

# Set vite environment variables for building run time
# the server host must be the address of the backend deployment server
ARG SERVER_HOST="media-share-server"
ARG SERVER_PORT="3000"
ENV VITE_SERVER_HOST=$SERVER_HOST
ENV VITE_SERVER_PORT=$SERVER_PORT

# Build application
RUN bun --bun run build

# Final stage for app image
FROM nginx:alpine

# Copy built application
COPY --from=build /app/dist /usr/share/nginx/html

# Start the server by default, this can be overwritten at runtime
EXPOSE 8080
CMD [ "/usr/sbin/nginx", "-g", "daemon off;" ]
