import { ApolloClient, InMemoryCache, from, HttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

const httpLink = new HttpLink({
  uri: 'https://ecommtest.wuaze.com/graphql',
  credentials: 'include' // try this if you're using cookies
});

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  console.log('Operation:', operation.operationName); // Log which query/mutation is being attempted
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
  if (networkError) {
    console.log(`[Network error]:`, networkError);
    // Log more details about the network error
    console.log('Network Error Details:', {
      name: networkError.name,
      message: networkError.message,
      stack: networkError.stack
    });
  }
});

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only', // Try this to bypass cache
      nextFetchPolicy: 'cache-first'
    }
  }
});

export default client;