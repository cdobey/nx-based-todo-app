# Build and run the GraphQL BFF
# Uses multi-stage to keep final image small
# NOTE: Build context should be the workspace root, not the package directory
# Build with: docker build -f packages/graphql-bff/Dockerfile -t todo-graphql-bff:latest .

FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies only for the package
# Copy package manifests from the graphql-bff package
COPY packages/graphql-bff/package.json ./

# Install production deps first to enable better caching
RUN npm install --omit=dev --no-audit --no-fund

# Builder stage (use esbuild for proper bundling)
FROM node:20-alpine AS builder
WORKDIR /workspace

# Copy workspace root files needed for build
COPY package.json tsconfig.base.json nx.json ./
COPY packages/graphql-bff ./packages/graphql-bff

# Install workspace dependencies
RUN npm install --no-audit --no-fund

# Build using nx/esbuild (bundles properly for ESM)
RUN npx nx build graphql-bff --configuration=production

# Runtime image
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Copy installed node_modules from base stage
COPY --from=base /app/node_modules ./node_modules

# Copy compiled app from builder
COPY --from=builder /workspace/packages/graphql-bff/dist ./dist

# Copy package.json for metadata (not strictly needed for runtime)
COPY package.json ./

# Expose port (configurable via PORT env)
EXPOSE 4000

# Default environment variables (can be overridden by platform like Coolify)
ENV PORT=4000

# Start the server
CMD ["node", "./dist/main.js"]
