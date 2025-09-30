import { fetchHtmlContent } from '../utils/api';
import { parseHtml, extractMetaTags } from '../utils/htmlParser';

export const runMetaTagsAudit = async (url) => {
  try {
    const htmlContent = await fetchHtmlContent(url);
    const doc = parseHtml(htmlContent);
    const metaTags = extractMetaTags(doc);

    // Calculate score based on meta tag completeness and quality
    let score = 100;
    const issues = [];
    const suggestions = [];

    // Title evaluation
    if (metaTags.title.length === 0) {
      score -= 30;
      issues.push('Missing title tag');
      suggestions.push('Add a descriptive title tag');
    } else if (metaTags.title.length > 60) {
      score -= 15;
      issues.push('Title too long (over 60 characters)');
      suggestions.push('Shorten title to under 60 characters');
    } else if (metaTags.title.length < 30) {
      score -= 10;
      issues.push('Title too short (under 30 characters)');
      suggestions.push('Expand title to 30-60 characters');
    }

    // Description evaluation
    if (metaTags.description.length === 0) {
      score -= 25;
      issues.push('Missing meta description');
      suggestions.push('Add a compelling meta description');
    } else if (metaTags.description.length > 160) {
      score -= 10;
      issues.push('Meta description too long (over 160 characters)');
      suggestions.push('Shorten description to under 160 characters');
    } else if (metaTags.description.length < 120) {
      score -= 5;
      issues.push('Meta description could be longer');
      suggestions.push('Expand description to 120-160 characters');
    }

    // Viewport evaluation
    if (!metaTags.viewport.hasMobileViewport) {
      score -= 15;
      issues.push('Missing or incorrect viewport meta tag');
      suggestions.push('Add viewport meta tag: <meta name="viewport" content="width=device-width, initial-scale=1">');
    }

    // Open Graph evaluation
    if (!metaTags.openGraph.title) {
      score -= 10;
      issues.push('Missing Open Graph title');
      suggestions.push('Add og:title meta tag for social sharing');
    }
    if (!metaTags.openGraph.description) {
      score -= 10;
      issues.push('Missing Open Graph description');
      suggestions.push('Add og:description meta tag for social sharing');
    }
    if (!metaTags.openGraph.image) {
      score -= 5;
      issues.push('Missing Open Graph image');
      suggestions.push('Add og:image meta tag for social sharing');
    }

    // Ensure score doesn't go below 0
    score = Math.max(0, score);

    return {
      ...metaTags,
      score,
      issues,
      suggestions,
      status: 'success'
    };

  } catch (error) {
    console.error('Meta tags audit failed:', error);
    return {
      title: { content: '', length: 0, issues: [] },
      description: { content: '', length: 0, issues: [] },
      keywords: '',
      viewport: { content: '', hasMobileViewport: false },
      openGraph: { title: '', description: '', image: '', issues: [] },
      score: 0,
      issues: [error.message || 'Failed to analyze meta tags'],
      suggestions: [
        'Check if the URL is accessible', 
        'Note: This demo uses fallback data when CORS prevents direct access',
        'In production, you would use a proper proxy server'
      ],
      status: 'error'
    };
  }
};