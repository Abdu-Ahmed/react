import { ApolloClient, InMemoryCache, from, HttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

const httpLink = new HttpLink({
  uri: 'https://ecommtest.wuaze.com/graphql'
});

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  console.log('Operation:', operation.operationName);
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
  if (networkError) {
    console.log(`[Network error]:`, networkError);
  }
});

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
  connectToDevTools: true, // Add this line
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only'
    }
  }
});

export default client;