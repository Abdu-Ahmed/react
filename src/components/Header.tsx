import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  toggleCart: () => void;
  cartItemCount: number;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

/**
 * Header displays category links, a central logo placeholder, and the cart button.
 * - Category links are styled as buttons (default black, hover blue; active link in blue).
 * - The central logo navigates to the home page.
 * - The cart button shows only the cart icon (default black, hover blue) with the item count bubble.
 */
const Header: React.FC<HeaderProps> = ({
  toggleCart,
  cartItemCount,
  activeCategory,
  onCategoryChange,
}) => {
  const categories = ['all', 'clothes', 'tech'];

  return (
    <header className="bg-white shadow fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left Navigation: All category buttons */}
        <nav className="flex space-x-6">
          {categories.map((category) => {
            const isActive = category === activeCategory;
            return (
              <button
                key={category}
                data-testid="category-link"
                className={`capitalize text-lg ${
                  isActive ? 'text-blue-500' : 'text-black hover:text-blue-500'
                }`}
                onClick={() => onCategoryChange(category)}
              >
                {category}
              </button>
            );
          })}
        </nav>

        {/* Center Logo Placeholder */}
        <div>
          <Link
            to="/"
            data-testid="logo-link"
            className="text-2xl font-bold text-black hover:text-blue-500"
          >
            LOGO
          </Link>
        </div>

        {/* Right: Cart Button */}
        <div>
          <button
            onClick={toggleCart}
            data-testid="cart-btn"
            className="relative text-black hover:text-blue-500 p-2 focus:outline-none"
            aria-label="Open Cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
