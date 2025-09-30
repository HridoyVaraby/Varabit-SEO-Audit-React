import React from 'react';

const ResultCard = ({ title, icon, result, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gray-300 rounded mr-3"></div>
          <div className="h-6 bg-gray-300 rounded w-32"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreBorderColor = (score) => {
    if (score >= 80) return 'border-green-200';
    if (score >= 60) return 'border-yellow-200';
    return 'border-red-200';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${getScoreBorderColor(result.score || 0)}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{icon}</span>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {typeof result.score === 'number' && (
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(result.score)}`}>
            {result.score}/100
          </div>
        )}
      </div>

      {/* Status */}
      {result.status === 'error' && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm font-medium">
            ❌ This audit encountered an error
          </p>
        </div>
      )}

      {/* Key Metrics */}
      {result.mobile && result.desktop && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Scores</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Mobile Performance:</span> 
              <span className="font-semibold ml-1">{result.mobile.performance || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-600">Desktop Performance:</span> 
              <span className="font-semibold ml-1">{result.desktop.performance || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-600">SEO Score:</span> 
              <span className="font-semibold ml-1">{result.mobile.seo || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-600">Accessibility:</span> 
              <span className="font-semibold ml-1">{result.mobile.accessibility || 'N/A'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Meta Tags specific display */}
      {result.title && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Meta Information</h4>
          <div className="text-sm space-y-1">
            <div>
              <span className="text-gray-600">Title:</span> 
              <span className="ml-1">{result.title.content || 'Not found'}</span>
              <span className="text-gray-500 ml-1">({result.title.length} chars)</span>
            </div>
            <div>
              <span className="text-gray-600">Description:</span> 
              <span className="ml-1">{result.description.content || 'Not found'}</span>
              <span className="text-gray-500 ml-1">({result.description.length} chars)</span>
            </div>
          </div>
        </div>
      )}

      {/* Headings specific display */}
      {result.structure && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Heading Structure</h4>
          <div className="text-sm grid grid-cols-3 gap-2">
            <div>H1: {result.structure.h1}</div>
            <div>H2: {result.structure.h2}</div>
            <div>H3: {result.structure.h3}</div>
            <div>H4: {result.structure.h4}</div>
            <div>H5: {result.structure.h5}</div>
            <div>H6: {result.structure.h6}</div>
          </div>
        </div>
      )}

      {/* Images specific display */}
      {typeof result.totalImages === 'number' && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Image Analysis</h4>
          <div className="text-sm grid grid-cols-2 gap-4">
            <div>Total Images: {result.totalImages}</div>
            <div>With Alt Text: {result.imagesWithAlt}</div>
            <div>Missing Alt: {result.imagesMissingAlt}</div>
            <div>Alt Coverage: {result.altTextPercentage || 0}%</div>
          </div>
        </div>
      )}

      {/* Keyword density specific display */}
      {result.topKeywords && result.topKeywords.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Top Keywords</h4>
          <div className="text-sm">
            <div className="mb-2">Word Count: {result.wordCount}</div>
            <div className="space-y-1">
              {result.topKeywords.slice(0, 5).map((keyword, index) => (
                <div key={index} className="flex justify-between">
                  <span>{keyword.word}</span>
                  <span>{keyword.density}% ({keyword.count}x)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile friendly specific display */}
      {result.checks && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Mobile Checks</h4>
          <div className="text-sm">
            <div className="mb-2">Passed: {result.passedChecks}/{result.totalChecks}</div>
            <div className="space-y-1">
              {Object.entries(result.checks).map(([check, passed]) => (
                <div key={check} className="flex items-center">
                  <span className={`mr-2 ${passed ? 'text-green-600' : 'text-red-600'}`}>
                    {passed ? '✓' : '✗'}
                  </span>
                  <span className="capitalize">{check.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Issues */}
      {result.issues && result.issues.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Issues Found</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {result.issues.map((issue, index) => (
              <li key={index} className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {result.suggestions && result.suggestions.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            {result.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResultCard;