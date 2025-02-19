import { gql } from '@apollo/client';

/**
 * GraphQL mutation to create an order.
 * The mutation expects productId, quantity, and a list of attribute values.
 */
export const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($productId: ID!, $quantity: Int!, $attributes: [String!]!) {
    createOrder(productId: $productId, quantity: $quantity, attributes: $attributes)
  }
`;
