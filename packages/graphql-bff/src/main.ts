import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { startStandaloneServer } from '@apollo/server/standalone';
import dotenv from 'dotenv';
import { TodoDataSource } from './datasources/todoDataSource';
import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';

dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
});

const backendBaseUrl = process.env.BACKEND_URL;
if (!backendBaseUrl) {
  console.warn(
    'WARNING: BACKEND_URL not set. Falling back to http://localhost:5040'
  );
}

const port = Number(process.env.PORT ?? 4000);

const { url } = await startStandaloneServer(server, {
  listen: { port },
  context: async () => ({
    dataSources: {
      todoAPI: new TodoDataSource(backendBaseUrl ?? 'http://localhost:5040'),
    },
  }),
});

console.log(`🚀  Server ready at: ${url}`);

// Graceful shutdown
const shutdown = async (signal: string) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  await server.stop();
  console.log('Server stopped. Goodbye!');
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
