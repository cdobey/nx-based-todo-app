import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { startStandaloneServer } from '@apollo/server/standalone';
import dotenv from 'dotenv';
import { TodoDataSource } from './datasources/todoDataSource';
import { logger } from './logger';
import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';

dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    {
      async requestDidStart() {
        return {
          async didResolveOperation(requestContext) {
            logger.info(
              {
                operation: requestContext.operationName,
                query: requestContext.request.query?.substring(0, 100),
              },
              'GraphQL operation received'
            );
          },
          async didEncounterErrors(requestContext) {
            logger.error(
              {
                operation: requestContext.operationName,
                errors: requestContext.errors,
              },
              'GraphQL operation failed'
            );
          },
        };
      },
    },
  ],
});

const backendBaseUrl = process.env.BACKEND_URL;
if (!backendBaseUrl) {
  logger.warn('BACKEND_URL not set. Falling back to http://localhost:5040');
} else {
  logger.info({ backendUrl: backendBaseUrl }, 'Backend URL configured');
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

logger.info({ url, port }, '🚀 GraphQL BFF server ready');

// Graceful shutdown
const shutdown = async (signal: string) => {
  logger.info({ signal }, 'Received shutdown signal');
  await server.stop();
  logger.info('Server stopped gracefully');
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
