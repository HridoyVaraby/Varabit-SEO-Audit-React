import React from 'react';
import useAuditStore from '../store/auditStore';
import ResultCard from './ResultCard';
import { generatePdfReport } from '../utils/pdfGenerator';

const ResultsSection = () => {
  const { url, results, isLoading, error } = useAuditStore();

  // Check if we have any results to show
  const hasResults = Object.values(results).some(result => result !== null);

  const handleDownloadPdf = () => {
    if (!hasResults || !url) {
      alert('No audit results to download');
      return;
    }

    try {
      generatePdfReport(url, results);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF report. Please try again.');
    }
  };

  const calculateOverallScore = () => {
    const scores = [];
    Object.values(results).forEach(result => {
      if (result && typeof result.score === 'number') {
        scores.push(result.score);
      }
    });
    
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  if (error && !hasResults) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-lg font-semibold mb-2">
          ❌ Audit Failed
        </div>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!hasResults && !isLoading) {
    return null;
  }

  const overallScore = calculateOverallScore();

  return (
    <div className="space-y-6">
      {/* Overall Results Header */}
      {hasResults && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Audit Results</h2>
              <p className="text-gray-600">URL: <span className="font-mono text-sm">{url}</span></p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-varabit mb-1">
                {overallScore}/100
              </div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center px-6 py-3 bg-varabit text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-varabit focus:ring-offset-2 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF Report
            </button>
          </div>
        </div>
      )}

      {/* Audit Results Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ResultCard
          title="Page Speed Analysis"
          icon="⚡"
          result={results.pageSpeed}
          isLoading={isLoading && !results.pageSpeed}
        />
        
        <ResultCard
          title="Meta Tags Analysis"
          icon="📝"
          result={results.metaTags}
          isLoading={isLoading && !results.metaTags}
        />
        
        <ResultCard
          title="Headings Structure"
          icon="📋"
          result={results.headings}
          isLoading={isLoading && !results.headings}
        />
        
        <ResultCard
          title="Image Alt Text"
          icon="🖼️"
          result={results.images}
          isLoading={isLoading && !results.images}
        />
        
        <ResultCard
          title="Mobile Friendliness"
          icon="📱"
          result={results.mobileFriendly}
          isLoading={isLoading && !results.mobileFriendly}
        />
        
        <ResultCard
          title="Keyword Density"
          icon="🔍"
          result={results.keywordDensity}
          isLoading={isLoading && !results.keywordDensity}
        />
      </div>

      {/* Additional Information */}
      {hasResults && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            How to Interpret These Results
          </h3>
          <div className="text-blue-800 text-sm space-y-2">
            <p><strong>Scores 80-100:</strong> Excellent - Your website follows SEO best practices</p>
            <p><strong>Scores 60-79:</strong> Good - Some improvements can boost your SEO performance</p>
            <p><strong>Scores 0-59:</strong> Needs Work - Important SEO issues that should be addressed</p>
            <p className="mt-4">
              <strong>Note:</strong> This audit analyzes publicly accessible content only. 
              Some advanced SEO factors like site speed, Core Web Vitals, and technical SEO 
              require server-side analysis.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsSection;