import { getPageSpeedData } from '../utils/api';

export const runPageSpeedAudit = async (url) => {
  try {
    const [mobileData, desktopData] = await Promise.all([
      getPageSpeedData(url, 'mobile'),
      getPageSpeedData(url, 'desktop')
    ]);

    const extractScore = (data, category) => {
      return data?.lighthouseResult?.categories?.[category]?.score 
        ? Math.round(data.lighthouseResult.categories[category].score * 100)
        : null;
    };

    const extractMetrics = (data) => {
      const audits = data?.lighthouseResult?.audits || {};
      return {
        fcp: audits['first-contentful-paint']?.displayValue || 'N/A',
        lcp: audits['largest-contentful-paint']?.displayValue || 'N/A',
        cls: audits['cumulative-layout-shift']?.displayValue || 'N/A',
        fid: audits['max-potential-fid']?.displayValue || 'N/A',
        ttfb: audits['server-response-time']?.displayValue || 'N/A'
      };
    };

    const mobile = {
      performance: extractScore(mobileData, 'performance'),
      accessibility: extractScore(mobileData, 'accessibility'),
      bestPractices: extractScore(mobileData, 'best-practices'),
      seo: extractScore(mobileData, 'seo'),
      metrics: extractMetrics(mobileData)
    };

    const desktop = {
      performance: extractScore(desktopData, 'performance'),
      accessibility: extractScore(desktopData, 'accessibility'),
      bestPractices: extractScore(desktopData, 'best-practices'),
      seo: extractScore(desktopData, 'seo'),
      metrics: extractMetrics(desktopData)
    };

    // Generate issues based on scores
    const issues = [];
    if (mobile.performance < 50) issues.push('Mobile performance score is poor');
    if (desktop.performance < 50) issues.push('Desktop performance score is poor');
    if (mobile.accessibility < 90) issues.push('Mobile accessibility needs improvement');
    if (desktop.accessibility < 90) issues.push('Desktop accessibility needs improvement');
    if (mobile.seo < 90) issues.push('Mobile SEO score needs improvement');
    if (desktop.seo < 90) issues.push('Desktop SEO score needs improvement');

    // Generate suggestions
    const suggestions = [];
    if (mobile.performance < 90 || desktop.performance < 90) {
      suggestions.push('Optimize images and reduce file sizes');
      suggestions.push('Minimize HTTP requests');
      suggestions.push('Enable browser caching');
    }
    if (mobile.accessibility < 95 || desktop.accessibility < 95) {
      suggestions.push('Add alt text to images');
      suggestions.push('Improve color contrast');
      suggestions.push('Use semantic HTML elements');
    }

    return {
      mobile,
      desktop,
      issues,
      suggestions,
      overallScore: Math.round((mobile.performance + mobile.seo + mobile.accessibility + mobile.bestPractices) / 4),
      status: 'success'
    };

  } catch (error) {
    console.error('PageSpeed audit failed:', error);
    return {
      mobile: null,
      desktop: null,
      issues: [error.message],
      suggestions: ['Check your API key configuration', 'Ensure the URL is accessible'],
      overallScore: 0,
      status: 'error'
    };
  }
};