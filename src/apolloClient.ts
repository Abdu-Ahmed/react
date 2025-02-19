import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'ecommtest.wuaze.com/',
  cache: new InMemoryCache(),
});

export default client;