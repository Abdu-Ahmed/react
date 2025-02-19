import { useMutation } from '@apollo/client';
import { CREATE_ORDER_MUTATION } from '../graphql/mutations';
import { CartItem } from '../cart.types';

/**
 * Custom hook to execute the createOrder mutation.
 * It iterates over all cart items and calls the mutation for each.
 *
 * @returns A function that accepts an array of CartItem and returns a Promise<boolean>
 *          indicating whether all orders were placed successfully.
 */
export const usePlaceOrder = () => {
  const [createOrder] = useMutation(CREATE_ORDER_MUTATION);

  const placeOrder = async (cartItems: CartItem[]): Promise<boolean> => {
    try {
      await Promise.all(
        cartItems.map((item) => {
          // Prepare attributes as an array of selected option values.
          const attributes = Object.values(item.selectedOptions);
          return createOrder({
            variables: {
              productId: item.id,
              quantity: item.quantity,
              attributes: attributes,
            },
          });
        })
      );
      return true;
    } catch (error) {
      console.error('Order placement failed', error);
      return false;
    }
  };

  return placeOrder;
};
