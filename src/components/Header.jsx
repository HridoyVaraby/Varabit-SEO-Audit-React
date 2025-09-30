import React from 'react';

const Header = () => {
  return (
    <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderBottom: '1px solid #e5e7eb' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img 
              src="https://varabit.com/images/logo/varabit_logo.svg" 
              alt="Varabit Logo" 
              style={{ height: '32px', width: 'auto' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <span 
              style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: '#09c',
                display: 'none'
              }}
            >
              Varabit
            </span>
            <div style={{ display: window.innerWidth > 768 ? 'block' : 'none' }}>
              <span style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151' }}>
                SEO Audit Tool
              </span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a 
              href="https://varabit.com" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#09c', textDecoration: 'none', fontWeight: '500' }}
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