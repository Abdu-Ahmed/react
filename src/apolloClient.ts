import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'https://ecommtest.wuaze.com/graphql',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
});

const client = new ApolloClient({
  link: httpLink, // Remove error link completely
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