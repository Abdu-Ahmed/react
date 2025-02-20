import { ApolloClient, InMemoryCache, from, HttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

const backendURI =
  process.env.NODE_ENV === 'production'
    ? 'https://ecommtest.wuaze.com/graphql'
    : '/graphql'; // use the proxy in development

const httpLink = new HttpLink({
  uri: backendURI,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) =>
      console.log(`[GraphQL error]: Message: ${message}`)
    );
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

export default client;
