import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Varabit SEO Audit</h3>
            <p className="text-gray-300 text-sm">
              Free, open-source SEO audit tool built with React. 
              Analyze your website's performance and get actionable insights.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="https://varabit.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  Varabit Website
                </a>
              </li>
              <li>
                <a href="mailto:support@varabit.com" className="hover:text-white">
                  Support
                </a>
              </li>
              <li>Version 1.0.0</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>GPL v2 or later</li>
              <li>
                <a href="https://github.com" className="hover:text-white">
                  Source Code
                </a>
              </li>
              <li>
                <a href="mailto:support@varabit.com" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} Varabit. Licensed under GPL v2 or later. 
            Built by Hridoy Varaby - Systems Architect at Varabit.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;