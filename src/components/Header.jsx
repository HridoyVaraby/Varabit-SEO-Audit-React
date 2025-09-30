import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="https://varabit.com/images/logo/varabit_logo.svg" 
              alt="Varabit Logo" 
              className="h-8 w-auto"
              onError={(e) => {
                // Fallback if logo doesn't load
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <span 
              className="text-2xl font-bold text-varabit hidden"
              style={{ display: 'none' }}
            >
              Varabit
            </span>
            <div className="hidden md:block">
              <span className="text-lg font-semibold text-gray-700">SEO Audit Tool</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <a 
              href="https://varabit.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-varabit hover:text-blue-700 font-medium"
            >
              Visit Varabit
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;