import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://ecommtest.wuaze.com/',
  cache: new InMemoryCache(),
});

export default client;