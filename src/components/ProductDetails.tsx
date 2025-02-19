import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import parse from 'html-react-parser';
import { GET_PRODUCTS } from '../graphql/queries';
import { CartItem } from '../cart.types';


/**
 * ProductDetails displays detailed information about a selected product,
 * including an interactive gallery and attribute selection.
 * The "Add to Cart" button is disabled until all product options are selected.
 */

interface Price {
  amount: number;
  currency: {
    label: string;
    symbol: string;
  } | null;
}

interface AttributeItem {
  id: string;
  displayValue: string;
  value: string;
  __typename?: string;
}

interface Attribute {
  id: string;
  name: string;
  type: string;
  items: AttributeItem[];
  __typename?: string;
}

interface Product {
  id: string;
  name: string;
  inStock: boolean;
  gallery: string[];
  description: string;
  category: string;
  brand: string;
  attributes: Attribute[];
  prices: Price[];
}

interface ProductDetailsProps {
  addToCart: (item: CartItem) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ addToCart }) => {
  const { id } = useParams<{ id: string }>();
  const { loading, error, data } = useQuery<{ products: Product[] }>(GET_PRODUCTS);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});

  // Set the initial selected image after data is loaded
  useEffect(() => {
    if (data && data.products) {
      const product = data.products.find((p) => p.id === id);
      if (product && product.gallery && product.gallery.length > 0 && !selectedImage) {
        setSelectedImage(product.gallery[0]);
      }
    }
  }, [data, id, selectedImage]);

  if (loading) return <p className="text-center py-10 text-xl">Loading...</p>;
  if (error) return <p className="text-center py-10 text-red-500">Error: {error.message}</p>;

  const product = data?.products.find((p) => p.id === id);
  if (!product) return <p className="text-center py-10">Product not found</p>;

  const handleSelectOption = (attributeName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [attributeName]: value }));
  };

  const allAttributesSelected = product.attributes.every(
    (attr) => selectedOptions[attr.name]
  );

  return (
    <div className="container mx-auto px-4 py-12 mt-24">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <div className="relative">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full object-contain rounded-lg shadow-lg"
              style={{ maxHeight: '80vh' }}
            />
            <div className="flex space-x-4 mt-4 overflow-x-auto pb-2">
              {product.gallery.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.name} ${idx}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer transition-transform duration-200 ${
                    selectedImage === img ? 'ring-2 ring-blue-500' : 'hover:scale-105'
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="md:w-1/2">
          <h2 className="text-4xl font-bold mb-4">{product.name}</h2>
          <p className="text-2xl font-semibold text-gray-700 mb-6">
            {product.prices[0]?.currency 
              ? `${product.prices[0].currency.symbol}${product.prices[0].amount.toFixed(2)}`
              : 'Price not available'}
          </p>

          <div className="mb-6 space-y-6">
            {product.attributes.map((attr) => (
              <div key={attr.id} className="space-y-3">
                <h3 className="text-lg font-semibold">{attr.name}</h3>
                <div className="flex flex-wrap gap-3">
                  {attr.items.map((option) => {
                    const isSelected = selectedOptions[attr.name] === option.value;
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleSelectOption(attr.name, option.value)}
                        className={`
                          flex items-center justify-center transition-all duration-200
                          ${
                            attr.type === 'swatch' 
                              ? `w-10 h-10 rounded-lg border-2 ${
                                  isSelected ? 'border-blue-500 scale-110' : 'border-gray-200'
                                }`
                              : `px-4 py-2 rounded-lg border ${
                                  isSelected 
                                    ? 'bg-blue-500 text-white border-blue-500' 
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
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
          </div>

          <button
            onClick={() =>
              addToCart({
                id: product.id,
                name: product.name,
                price: product.prices[0].amount,
                image: product.gallery[0],
                quantity: 1,
                selectedOptions: selectedOptions,
                attributes: product.attributes,
              })
            }
            disabled={!product.inStock || !allAttributesSelected}
            className={`
              w-full py-4 rounded-xl font-semibold transition-all
              ${!product.inStock || !allAttributesSelected
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'}
            `}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>

          <div className="mt-8 prose max-w-none text-gray-600">
            {parse(product.description)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
