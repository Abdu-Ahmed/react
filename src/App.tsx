import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import TestQuery from './TestQuery';

const App = () => (
  <ApolloProvider client={client}>
    <div>
      <h1>GraphQL Test</h1>
      <TestQuery />
    </div>
  </ApolloProvider>
);

export default App;
