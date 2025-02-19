import { gql } from '@apollo/client';

/**
 * GraphQL query to fetch products.
 */
export const GET_PRODUCTS = gql`
  query GET_PRODUCTS {
    products {
      id
      name
      inStock
      gallery
      description
      category
      brand
      attributes {
        id
        name
        type
        items {
          id
          displayValue
          value
        }
      }
      prices {
        amount
        currency {
          label
          symbol
        }
      }
    }
  }
`;
