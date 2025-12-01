# Frontend Apollo Client + GraphQL BFF Integration

This document explains how the frontend connects to the GraphQL BFF using Apollo Client.

## Architecture

```
Frontend (React + Apollo Client)
    ↓
GraphQL BFF (Apollo Server)
    ↓
Backend API (.NET)
```

## Local Development

1. **Start the GraphQL BFF**:

   ```bash
   npx nx serve graphql-bff
   ```

   The GraphQL BFF will run on `http://localhost:4000`

2. **Start the Frontend**:

   ```bash
   npx nx serve frontend
   ```

   The frontend will run on `http://localhost:4200`

3. **Environment Configuration**:
   The frontend uses `.env` file to configure the GraphQL URL:
   ```
   VITE_GRAPHQL_URL=http://localhost:4000
   ```

## Docker Deployment

### Building Images

```bash
# Build frontend image
docker build -f packages/frontend/Dockerfile -t todo-frontend:latest .

# Build GraphQL BFF image
docker build -f packages/graphql-bff/Dockerfile -t todo-graphql-bff:latest .
```

### Running with Docker Compose

```bash
# Start all services (frontend, graphql-bff, backend)
docker-compose up

# Frontend: http://localhost:3000
# GraphQL BFF: http://localhost:4000
# Backend: http://localhost:5040
```

### Environment Variables for Docker

When running the frontend container, you can configure the GraphQL URL:

```bash
docker run -p 3000:80 -e GRAPHQL_URL=http://localhost:4000 todo-frontend:latest
```

The `docker-entrypoint.sh` script will inject this URL at runtime into the built JavaScript files.

## GraphQL Operations

### Queries

- `GET_TODOS` - Fetch all todos
- `GET_TODO` - Fetch a single todo by ID

### Mutations

- `CREATE_TODO` - Create a new todo
- `UPDATE_TODO` - Update an existing todo
- `DELETE_TODO` - Delete a todo

## Apollo Client Configuration

The Apollo Client is configured in `src/lib/apollo-client.ts` with:

- **HTTP Link**: Connects to the GraphQL BFF
- **Cache**: InMemoryCache for query result caching
- **Fetch Policy**: `cache-and-network` for queries to ensure fresh data

## Key Files

- `src/lib/apollo-client.ts` - Apollo Client setup
- `src/graphql/queries.ts` - GraphQL queries
- `src/graphql/mutations.ts` - GraphQL mutations
- `src/types/todo.ts` - TypeScript types matching GraphQL schema
- `src/app/todo-home.tsx` - Main component using Apollo hooks
- `.env` - Development environment variables
- `docker-entrypoint.sh` - Runtime environment variable injection for Docker
