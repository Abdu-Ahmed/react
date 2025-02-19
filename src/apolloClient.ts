import { ApolloClient, InMemoryCache, from, HttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

const httpLink = new HttpLink({
  uri: 'https://ecommtest.wuaze.com/cors.php',  // Point to cors.php instead of /graphql
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json'
  }
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log('GraphQL Errors:', graphQLErrors);
  }
  if (networkError) {
    console.log('Network Error:', networkError);
  }
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