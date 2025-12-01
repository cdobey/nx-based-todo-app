# Build and serve the frontend React app with nginx
# Uses multi-stage to keep final image small
# NOTE: Build context should be the workspace root, not the package directory
# Build with: docker build -f packages/frontend/Dockerfile -t todo-frontend:latest .

# Builder stage - build the React app
FROM node:20-alpine AS builder
WORKDIR /workspace

# Copy workspace root files needed for build
COPY package.json package-lock.json tsconfig.base.json nx.json ./
COPY packages/frontend ./packages/frontend

# Install workspace dependencies
RUN npm ci --no-audit --no-fund

# Build using nx/vite
RUN npx nx build frontend --configuration=production

# Runtime image - serve with nginx
FROM nginx:alpine AS runtime

# Copy custom nginx configuration
COPY packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy docker entrypoint script for runtime env var injection
COPY packages/frontend/docker-entrypoint.sh /docker-entrypoint.d/40-inject-env.sh
RUN chmod +x /docker-entrypoint.d/40-inject-env.sh

# Copy built app from builder to nginx html directory
COPY --from=builder /workspace/packages/frontend/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Environment variable for GraphQL BFF URL (can be overridden at runtime)
ENV GRAPHQL_URL=/graphql

# Start nginx (entrypoint scripts run automatically)
CMD ["nginx", "-g", "daemon off;"]
