import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../graphql/queries';
import { CartItem } from '../cart.types';

interface Price {
  amount: number;
  currency: {
    label: string;
    symbol: string;
  } | null;
}

interface Product {
  id: string;
  name: string;
  inStock: boolean;
  gallery: string[];
  description: string;
  category: string;
  brand: string;
  attributes: {
    id: string;
    name: string;
    type: string;
    items: {
      id: string;
      displayValue: string;
      value: string;
    }[];
  }[];
  prices: Price[];
}

interface ProductListProps {
  activeCategory: string;
  addToCart: (item: CartItem) => void;
}

/**
 * Converts a string to kebab-case.
 *
 * @param str - The input string.
 * @returns The kebab-case version of the string.
 */
const toKebabCase = (str: string) => str.replace(/\s+/g, '-').toLowerCase();

/**
 * ProductList displays products based on the active category.
 * It uses the GET_PRODUCTS GraphQL query to fetch data.
 */
const ProductList: React.FC<ProductListProps> = ({ activeCategory, addToCart }) => {
  const { loading, error, data } = useQuery<{ products: Product[] }>(GET_PRODUCTS);

  if (loading) return <p className="text-center py-10 text-xl">Loading...</p>;
  if (error) return <p className="text-center py-10 text-red-500">Error: {error.message}</p>;

  const filteredProducts =
    activeCategory === 'all'
      ? data?.products
      : data?.products.filter((product) => product.category === activeCategory);

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      {/* Category Heading with extra spacing */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold mt-6 capitalize">{activeCategory}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts?.map((product) => {
          const testId = `product-${toKebabCase(product.name)}`;
          const price = product.prices[0];
          const currencySymbol = price?.currency?.symbol || '$';
          return (
            <div
              key={product.id}
              data-testid={testId}
              className="bg-white rounded-lg shadow hover:shadow-xl transition transform hover:-translate-y-1 p-4 relative group"
            >
              <Link to={`/product/${product.id}`}>
                <div className="relative">
                  <img
                    src={product.gallery[0]}
                    alt={product.name}
                    className="w-full h-56 object-cover rounded-md"
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                      <span className="text-white text-xl uppercase tracking-wider">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600 mt-1">
                    {currencySymbol}
                    {price.amount.toFixed(2)}
                  </p>
                  <p className="text-gray-500 mt-1">{product.brand}</p>
                </div>
              </Link>
              {product.inStock && (
                <button
                  onClick={() =>
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: price.amount,
                      image: product.gallery[0],
                      quantity: 1,
                      selectedOptions: product.attributes.reduce((acc, attr) => {
                        acc[attr.name] = attr.items[0].value;
                        return acc;
                      }, {} as { [key: string]: string }),
                      attributes: product.attributes,
                    })
                  }
                  className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition opacity-0 group-hover:opacity-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7a1 1 0 00.9 1.5h12.1M7 13l.5 2M16 21a1 1 0 100-2 1 1 0 000 2zm-8 0a1 1 0 100-2 1 1 0 000 2z"
                    />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;
