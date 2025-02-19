import { ApolloClient, InMemoryCache, from, HttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

const httpLink = new HttpLink({
  uri: 'https://ecommtest.wuaze.com/graphql',
  credentials: 'include', // Must use include for CORS
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add explicit content-type header in errorLink
const errorLink = onError(({ operation }) => {
  operation.setContext({
    headers: {
      'content-type': 'application/json' // Lowercase
    }
  });
});

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache'
    },
    query: {
      fetchPolicy: 'no-cache'
    }
  }
});

export default client;