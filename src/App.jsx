// React is automatically injected by Vite config, no need to import explicitly
function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ backgroundColor: '#09c', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img 
            src="https://varabit.com/images/logo/varabit_logo.svg" 
            alt="Varabit Logo" 
            style={{ height: '32px', width: 'auto', filter: 'brightness(0) invert(1)' }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'inline';
            }}
          />
          <span style={{ display: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>Varabit</span>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>SEO Audit Tool</h1>
        </div>
      </header>

      <main>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', color: '#1f2937', marginBottom: '1rem' }}>
            Varabit SEO Audit
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
            Analyze your website's SEO performance with our comprehensive audit tool. 
            Get insights on page speed, meta tags, mobile-friendliness, and more.
          </p>
        </div>

        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '1rem', color: '#374151' }}>Enter Website URL</h3>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <input 
              type="text" 
              placeholder="Enter URL (e.g., example.com)"
              style={{ 
                flex: 1, 
                padding: '0.75rem', 
                border: '2px solid #d1d5db', 
                borderRadius: '6px',
                fontSize: '1rem'
              }}
            />
            <button 
              style={{ 
                padding: '0.75rem 1.5rem', 
                backgroundColor: '#09c', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#0088cc'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#09c'}
            >
              Run Audit
            </button>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            <strong>Note:</strong> This tool will analyze the public content of the provided URL.
          </p>
          {import.meta.env.VITE_PAGESPEED_API_KEY === 'your_api_key_here' && (
            <p style={{ fontSize: '0.875rem', color: '#f59e0b', marginTop: '0.5rem' }}>
              ⚠️ PageSpeed API key not configured. Please add your Google PageSpeed Insights API key to the .env file.
            </p>
          )}
        </div>

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <h3 style={{ color: '#374151', marginBottom: '1rem' }}>Audit Modules</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', maxWidth: '1000px', margin: '0 auto' }}>
            {[
              { name: 'Page Speed Analysis', icon: '⚡', desc: 'Google PageSpeed Insights integration' },
              { name: 'Meta Tags Analysis', icon: '📝', desc: 'Title, description, Open Graph' },
              { name: 'Headings Structure', icon: '📋', desc: 'H1-H6 hierarchy validation' },
              { name: 'Image Alt Text', icon: '🖼️', desc: 'Accessibility compliance' },
              { name: 'Mobile Friendliness', icon: '📱', desc: 'Responsive design evaluation' },
              { name: 'Keyword Density', icon: '🔍', desc: 'Content analysis' }
            ].map((module, index) => (
              <div key={index} style={{ 
                padding: '1.5rem', 
                backgroundColor: 'white', 
                borderRadius: '8px', 
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{module.icon}</div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>{module.name}</h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>{module.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer style={{ marginTop: '4rem', padding: '2rem', backgroundColor: '#1f2937', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
        <p style={{ margin: '0 0 1rem 0', fontWeight: '600' }}>Varabit SEO Audit Tool</p>
        <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem' }}>
          Built with React + Vite | Version 1.0.0 | GPL v2 License
        </p>
        <p style={{ margin: 0, fontSize: '0.875rem' }}>
          Contact: <a href="mailto:support@varabit.com" style={{ color: '#09c' }}>support@varabit.com</a> | 
          Website: <a href="https://varabit.com" target="_blank" rel="noopener noreferrer" style={{ color: '#09c' }}>varabit.com</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
