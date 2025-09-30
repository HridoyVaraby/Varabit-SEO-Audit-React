// React is automatically injected by Vite config
import { useState } from 'react'
import useAuditStore from './store/auditStore'
import { runPageSpeedAudit } from './modules/pageSpeedModule'
import { runMetaTagsAudit } from './modules/metaTagsModule'
import { runHeadingsAudit } from './modules/headingsModule'
import { runImagesAudit } from './modules/imagesModule'
import { runMobileFriendlyAudit } from './modules/mobileFriendlyModule'
import { runKeywordDensityAudit } from './modules/keywordDensityModule'
import { generatePdfReport } from './utils/pdfGenerator'

function App() {
  const [inputUrl, setInputUrl] = useState('')
  const [validationError, setValidationError] = useState('')
  
  const { 
    url, 
    isLoading, 
    results,
    setUrl, 
    setLoading, 
    setError, 
    setResult, 
    clearResults 
  } = useAuditStore()

  const validateUrl = (url) => {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
    return urlPattern.test(url)
  }

  const normalizeUrl = (url) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url
    }
    return url
  }

  const runAudit = async (targetUrl) => {
    setLoading(true)
    setError(null)
    clearResults()

    const auditModules = [
      { name: 'pageSpeed', func: runPageSpeedAudit },
      { name: 'metaTags', func: runMetaTagsAudit },
      { name: 'headings', func: runHeadingsAudit },
      { name: 'images', func: runImagesAudit },
      { name: 'mobileFriendly', func: runMobileFriendlyAudit },
      { name: 'keywordDensity', func: runKeywordDensityAudit }
    ]

    // Run audits in parallel for better performance
    const auditPromises = auditModules.map(async (module) => {
      try {
        const result = await module.func(targetUrl)
        setResult(module.name, result)
        return { module: module.name, result }
      } catch (error) {
        console.error(`${module.name} audit failed:`, error)
        setResult(module.name, {
          status: 'error',
          issues: [error.message],
          suggestions: ['Check your internet connection', 'Verify the URL is accessible'],
          score: 0
        })
        return { module: module.name, error }
      }
    })

    try {
      await Promise.all(auditPromises)
    } catch (error) {
      setError('Some audits failed to complete. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setValidationError('')

    if (!inputUrl.trim()) {
      setValidationError('Please enter a URL')
      return
    }

    if (!validateUrl(inputUrl)) {
      setValidationError('Please enter a valid URL (e.g., example.com or https://example.com)')
      return
    }

    const normalizedUrl = normalizeUrl(inputUrl.trim())
    setUrl(normalizedUrl)
    await runAudit(normalizedUrl)
  }

  const handleDownloadPdf = () => {
    const hasResults = Object.values(results).some(result => result !== null)
    if (!hasResults || !url) {
      alert('No audit results to download')
      return
    }

    try {
      generatePdfReport(url, results)
    } catch (error) {
      console.error('PDF generation failed:', error)
      alert('Failed to generate PDF report. Please try again.')
    }
  }

  const calculateOverallScore = () => {
    const scores = []
    Object.values(results).forEach(result => {
      if (result && typeof result.score === 'number') {
        scores.push(result.score)
      }
    })
    
    if (scores.length === 0) return 0
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
  }

  const hasResults = Object.values(results).some(result => result !== null)
  const overallScore = calculateOverallScore()

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <header style={{ backgroundColor: '#09c', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img 
            src="https://varabit.com/images/logo/varabit_logo.svg" 
            alt="Varabit Logo" 
            style={{ height: '32px', width: 'auto', filter: 'brightness(0) invert(1)' }}
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'inline'
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

        {/* Audit Form */}
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#374151' }}>Enter Website URL</h3>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <input 
              type="text" 
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter URL (e.g., varabit.com)"
              disabled={isLoading}
              style={{ 
                flex: 1, 
                padding: '0.75rem', 
                border: '2px solid #d1d5db', 
                borderRadius: '6px',
                fontSize: '1rem',
                opacity: isLoading ? 0.6 : 1
              }}
            />
            <button 
              type="submit"
              disabled={isLoading}
              style={{ 
                padding: '0.75rem 1.5rem', 
                backgroundColor: isLoading ? '#6b7280' : '#09c', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Auditing...' : 'Run Audit'}
            </button>
          </div>
          {validationError && (
            <p style={{ color: '#ef4444', fontSize: '0.875rem', margin: '0 0 1rem 0' }}>{validationError}</p>
          )}
          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
            <strong>Note:</strong> This tool will analyze the public content of the provided URL.
          </p>
          {import.meta.env.VITE_PAGESPEED_API_KEY === 'your_api_key_here' && (
            <p style={{ fontSize: '0.875rem', color: '#f59e0b', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>
              ⚠️ PageSpeed API key not configured. Please add your Google PageSpeed Insights API key to the .env file.
            </p>
          )}
        </form>

        {/* Loading Indicator */}
        {isLoading && (
          <div style={{ textAlign: 'center', margin: '2rem 0' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              padding: '0.75rem 1.5rem', 
              backgroundColor: '#09c',
              color: 'white',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              <svg style={{ 
                animation: 'spin 1s linear infinite', 
                marginRight: '0.75rem', 
                height: '1.25rem', 
                width: '1.25rem' 
              }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle style={{ opacity: '0.25' }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path style={{ opacity: '0.75' }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Running SEO Audit for {url}...
            </div>
          </div>
        )}

        {/* Results Section */}
        {hasResults && (
          <div style={{ marginTop: '2rem' }}>
            {/* Overall Results Header */}
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '2rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: '0 0 0.5rem 0' }}>Audit Results</h3>
                  <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>URL: <span style={{ fontFamily: 'monospace' }}>{url}</span></p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#09c', marginBottom: '0.25rem' }}>
                    {overallScore}/100
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Overall Score</div>
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={handleDownloadPdf}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#09c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF Report
                </button>
              </div>
            </div>

            {/* Audit Results Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              {[
                { name: 'pageSpeed', title: 'Page Speed Analysis', icon: '⚡' },
                { name: 'metaTags', title: 'Meta Tags Analysis', icon: '📝' },
                { name: 'headings', title: 'Headings Structure', icon: '📋' },
                { name: 'images', title: 'Image Alt Text', icon: '🖼️' },
                { name: 'mobileFriendly', title: 'Mobile Friendliness', icon: '📱' },
                { name: 'keywordDensity', title: 'Keyword Density', icon: '🔍' }
              ].map((module) => {
                const result = results[module.name]
                const getScoreColor = (score) => {
                  if (score >= 80) return '#10b981'
                  if (score >= 60) return '#f59e0b'
                  return '#ef4444'
                }

                return (
                  <div key={module.name} style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    padding: '1.5rem',
                    borderLeft: `4px solid ${result && typeof result.score === 'number' ? getScoreColor(result.score) : '#d1d5db'}`
                  }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.5rem', marginRight: '0.75rem' }}>{module.icon}</span>
                        <h4 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>{module.title}</h4>
                      </div>
                      {result && typeof result.score === 'number' && (
                        <div style={{ 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '1rem', 
                          fontSize: '0.875rem', 
                          fontWeight: '600',
                          color: 'white',
                          backgroundColor: getScoreColor(result.score)
                        }}>
                          {result.score}/100
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    {result ? (
                      <div>
                        {result.status === 'error' && (
                          <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', marginBottom: '1rem' }}>
                            <p style={{ color: '#dc2626', fontSize: '0.875rem', fontWeight: '500', margin: 0 }}>
                              ❌ This audit encountered an error
                            </p>
                          </div>
                        )}

                        {/* Issues */}
                        {result.issues && result.issues.length > 0 && (
                          <div style={{ marginBottom: '1rem' }}>
                            <h5 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Issues Found</h5>
                            <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.875rem', color: '#dc2626' }}>
                              {result.issues.slice(0, 3).map((issue, index) => (
                                <li key={index} style={{ marginBottom: '0.25rem' }}>{issue}</li>
                              ))}
                              {result.issues.length > 3 && (
                                <li style={{ color: '#6b7280' }}>... and {result.issues.length - 3} more</li>
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Suggestions */}
                        {result.suggestions && result.suggestions.length > 0 && (
                          <div>
                            <h5 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Recommendations</h5>
                            <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.875rem', color: '#2563eb' }}>
                              {result.suggestions.slice(0, 2).map((suggestion, index) => (
                                <li key={index} style={{ marginBottom: '0.25rem' }}>{suggestion}</li>
                              ))}
                              {result.suggestions.length > 2 && (
                                <li style={{ color: '#6b7280' }}>... and {result.suggestions.length - 2} more</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
                        Waiting for audit results...
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Default Module Cards (when no results) */}
        {!hasResults && !isLoading && (
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
        )}
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
  )
}

export default App
