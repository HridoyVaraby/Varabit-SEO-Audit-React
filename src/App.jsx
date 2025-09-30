import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import AuditForm from './components/AuditForm';
import ResultsSection from './components/ResultsSection';
import Footer from './components/Footer';
import useAuditStore from './store/auditStore';

function App() {
  const { isLoading } = useAuditStore();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={
              <>
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                      Varabit SEO Audit
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                      Analyze your website's SEO performance with our comprehensive audit tool. 
                      Get insights on page speed, meta tags, mobile-friendliness, and more.
                    </p>
                  </div>
                  
                  <AuditForm />
                  
                  {isLoading && (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-varabit transition ease-in-out duration-150">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Running SEO Audit...
                      </div>
                    </div>
                  )}
                  
                  <ResultsSection />
                </div>
              </>
            } />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
