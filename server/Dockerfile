# Adjust BUN_VERSION as desired
FROM oven/bun:slim AS base

# Bun app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base AS build

# Install node modules
COPY bun.lockb package.json ./
RUN bun install

# Copy application code
COPY . .

# Run checks
RUN bun run check:ci

# Build application
RUN bun --bun run build

# remove dev dependencies and reinstall the production only ones
RUN rm -rf node_modules && bun i -ci --production

# Final stage for app image
FROM base AS app

# Copy built application
COPY --from=build /app/bun.lockb /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist/

# Set environment variables for production
ENV NODE_ENV="production"

ENV SERVER_HOST="0.0.0.0"
ENV SERVER_PORT="3000"

ENV MONGO_DB="media_share"
ENV MONGO_HOST="mongodb"
ENV MONGO_PORT=27017

ARG TOKEN_SECRET="strong_token_secret"
ARG REFRESH_TOKEN_SECRET="strong_refresh_token_secret"
ENV TOKEN_SECRET=$TOKEN_SECRET
ENV REFRESH_TOKEN_SECRET=$REFRESH_TOKEN_SECRET

# Set expiration time to 1day in seconds
ENV TOKEN_EXPIRES_IN="86400"

# Note: check the `src/config.ts` file, for more variables


# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "bun", "/app/dist/server.js" ]
