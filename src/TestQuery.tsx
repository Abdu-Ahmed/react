import { useQuery, gql } from '@apollo/client';

const TEST_QUERY = gql`
  query TestProducts {
    products {
      id
      name
    }
  }
`;

const TestQuery = () => {
  const { loading, error, data } = useQuery(TEST_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Products</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default TestQuery;
