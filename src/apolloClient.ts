import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'ecommtest.wuaze.com/public/graphql',
  cache: new InMemoryCache(),
});

export default client;