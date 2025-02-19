import React from 'react';
import { CartItem } from '../cart.types';

/**
 * CartOverlay displays the current cart items, allows quantity adjustments,
 * deletion of items, and provides a Place Order button. A backdrop greys out the rest of the page (except the header).
 */
interface CartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  increaseQuantity: (index: number) => void;
  decreaseQuantity: (index: number) => void;
  deleteItem: (index: number) => void;
  placeOrder: () => void;
  /** 
   * Called when a user selects a different option for a cart item's attribute.
   * @param itemIndex - The index of the cart item.
   * @param attributeName - The name of the attribute.
   * @param optionValue - The value of the selected option.
   */
  updateSelectedOption: (itemIndex: number, attributeName: string, optionValue: string) => void;
}

const CartOverlay: React.FC<CartOverlayProps> = ({
  isOpen,
  onClose,
  cartItems,
  increaseQuantity,
  decreaseQuantity,
  deleteItem,
  placeOrder,
  updateSelectedOption,
}) => {
  if (!isOpen) return null;

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div>
      <div
        className="fixed inset-x-0 bottom-0 bg-black opacity-50 z-20"
        style={{ top: '64px' }}
        onClick={onClose}
      />
      
      <div className="fixed inset-x-0 top-20 z-40 flex justify-end">
        <div className="bg-white w-96 max-h-[80vh] shadow-xl p-6 relative overflow-y-auto rounded-xl">
          <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-600 hover:text-gray-900 text-2xl"
          >
            &times;
          </button>

          <div className="space-y-6">
            {cartItems.map((item, index) => (
              <div key={index} className="border-b pb-6 last:border-0">
                <div className="flex gap-4 relative">
                  <button
                    onClick={() => deleteItem(index)}
                    className="absolute top-0 right-0 text-red-500 hover:text-red-700 text-lg"
                  >
                    &times;
                  </button>
                  
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-contain rounded-lg border p-1"
                  />

                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-600">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>

                    {/* Display product attributes with clickable options to modify the selection */}
                    {item.attributes?.map((attr) => (
                      <div key={attr.id} className="space-y-1">
                        <span className="text-sm font-medium text-gray-500">
                          {attr.name}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {attr.items.map((option) => {
                            const isSelected = item.selectedOptions[attr.name] === option.value;
                            return (
                              <button
                                key={option.id}
                                onClick={() =>
                                  updateSelectedOption(index, attr.name, option.value)
                                }
                                className={`
                                  inline-flex items-center text-sm px-2 py-1 rounded-md focus:outline-none
                                  ${
                                    attr.type === 'swatch'
                                      ? `w-6 h-6 rounded-full border ${
                                          isSelected ? 'border-blue-500 scale-110' : 'border-gray-200'
                                        }`
                                      : `border ${
                                          isSelected
                                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                                            : 'bg-gray-50 text-gray-600 border-gray-200'
                                        }`
                                  }
                                `}
                                style={attr.type === 'swatch' ? { backgroundColor: option.value } : {}}
                                title={attr.type === 'swatch' ? option.displayValue : undefined}
                              >
                                {attr.type !== 'swatch' && option.displayValue}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => decreaseQuantity(index)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                      >
                        −
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(index)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total:</span>
              <span className="text-xl font-bold">${cartTotal.toFixed(2)}</span>
            </div>
            <button
              onClick={placeOrder}
              disabled={cartItems.length === 0}
              className={`
                w-full py-3 rounded-xl font-medium transition-all
                ${
                  cartItems.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
                }
              `}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartOverlay;
