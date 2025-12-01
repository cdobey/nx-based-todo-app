import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// Get GraphQL BFF URL from environment variable
// In development: uses VITE_GRAPHQL_URL from .env
// In production Docker: __VITE_GRAPHQL_URL__ gets replaced at runtime by docker-entrypoint.sh
const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || '__VITE_GRAPHQL_URL__';

// Fallback to localhost only if placeholder wasn't replaced
const resolvedURL = GRAPHQL_URL === '__VITE_GRAPHQL_URL__' 
  ? 'http://localhost:4000' 
  : GRAPHQL_URL;

const httpLink = createHttpLink({
  uri: resolvedURL,
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
