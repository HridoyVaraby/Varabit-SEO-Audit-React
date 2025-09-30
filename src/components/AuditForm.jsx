import React, { useState } from 'react';
import useAuditStore from '../store/auditStore';
import { runPageSpeedAudit } from '../modules/pageSpeedModule';
import { runMetaTagsAudit } from '../modules/metaTagsModule';
import { runHeadingsAudit } from '../modules/headingsModule';
import { runImagesAudit } from '../modules/imagesModule';
import { runMobileFriendlyAudit } from '../modules/mobileFriendlyModule';
import { runKeywordDensityAudit } from '../modules/keywordDensityModule';

const AuditForm = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [validationError, setValidationError] = useState('');
  
  const { 
    url, 
    isLoading, 
    setUrl, 
    setLoading, 
    setError, 
    setResult, 
    clearResults 
  } = useAuditStore();

  const validateUrl = (url) => {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlPattern.test(url);
  };

  const normalizeUrl = (url) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url;
    }
    return url;
  };

  const runAudit = async (targetUrl) => {
    setLoading(true);
    setError(null);
    clearResults();

    const auditModules = [
      { name: 'pageSpeed', func: runPageSpeedAudit },
      { name: 'metaTags', func: runMetaTagsAudit },
      { name: 'headings', func: runHeadingsAudit },
      { name: 'images', func: runImagesAudit },
      { name: 'mobileFriendly', func: runMobileFriendlyAudit },
      { name: 'keywordDensity', func: runKeywordDensityAudit }
    ];

    // Run audits in parallel for better performance
    const auditPromises = auditModules.map(async (module) => {
      try {
        const result = await module.func(targetUrl);
        setResult(module.name, result);
        return { module: module.name, result };
      } catch (error) {
        console.error(`${module.name} audit failed:`, error);
        setResult(module.name, {
          status: 'error',
          issues: [error.message],
          suggestions: ['Check your internet connection', 'Verify the URL is accessible'],
          score: 0
        });
        return { module: module.name, error };
      }
    });

    try {
      await Promise.all(auditPromises);
    } catch (error) {
      setError('Some audits failed to complete. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!inputUrl.trim()) {
      setValidationError('Please enter a URL');
      return;
    }

    if (!validateUrl(inputUrl)) {
      setValidationError('Please enter a valid URL (e.g., example.com or https://example.com)');
      return;
    }

    const normalizedUrl = normalizeUrl(inputUrl.trim());
    setUrl(normalizedUrl);
    await runAudit(normalizedUrl);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            Website URL to Audit
          </label>
          <div className="flex space-x-4">
            <input
              type="text"
              id="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter URL (e.g., example.com)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-varabit focus:border-varabit outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-varabit text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-varabit focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Auditing...' : 'Run Audit'}
            </button>
          </div>
          {validationError && (
            <p className="text-red-600 text-sm mt-2">{validationError}</p>
          )}
        </div>
        
        <div className="text-sm text-gray-600">
          <p>
            <strong>Note:</strong> This tool will analyze the public content of the provided URL. 
            Make sure the website is publicly accessible.
          </p>
          {import.meta.env.VITE_PAGESPEED_API_KEY === 'your_api_key_here' && (
            <p className="text-orange-600 font-medium mt-2">
              ⚠️ PageSpeed API key not configured. Please add your Google PageSpeed Insights API key to the .env file.
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default AuditForm;