import { ApolloClient, InMemoryCache, from, HttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

const backendURI = 
  process.env.NODE_ENV === 'production'
    ? 'https://bckndapeye.hstn.me/'
    : '/graphql';  // use the proxy in development

const httpLink = new HttpLink({
  uri: backendURI,
  credentials: 'include',  // or change to 'same-origin' if you don't need credentials
  headers: {
    'Content-Type': 'application/json',
  },
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
  
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);

    // Safely check for HTTP status code
    if ('response' in networkError && networkError.response?.status === 401) {
      console.warn('Unauthorized access detected. Handling 401 error...');
      // Handle unauthorized access (e.g., redirect to login, clear session, etc.)
    }
  }
});


const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
  connectToDevTools: process.env.NODE_ENV === 'development',
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
});

export default client;