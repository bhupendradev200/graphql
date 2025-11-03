import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

/**
 * Apollo Client Configuration
 * This sets up the GraphQL client for the React application
 */

// Use environment variable if available, otherwise default to localhost
// In Docker, this should be set to http://api:4000/graphql for internal communication
// For browser access, we use localhost since the browser runs outside Docker
const graphqlUri = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/graphql`
  : 'http://localhost:4000/graphql';

const httpLink = createHttpLink({
  uri: graphqlUri,
});

// For future authentication, you can add auth headers here
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  // const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      // authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    // Configure cache policies for better performance
    typePolicies: {
      Query: {
        fields: {
          users: {
            // Merge paginated results
            merge(existing, incoming) {
              return incoming;
            },
          },
          products: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          orders: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});

