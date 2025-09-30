import { fetchHtmlContent } from '../utils/api';
import { parseHtml, extractHeadings } from '../utils/htmlParser';

export const runHeadingsAudit = async (url) => {
  try {
    const htmlContent = await fetchHtmlContent(url);
    const doc = parseHtml(htmlContent);
    const headingsData = extractHeadings(doc);

    let score = 100;
    const issues = [...headingsData.issues];
    const suggestions = [];

    // H1 evaluation
    if (headingsData.structure.h1 === 0) {
      score -= 30;
      suggestions.push('Add an H1 tag to define the main heading');
    } else if (headingsData.structure.h1 > 1) {
      score -= 20;
      suggestions.push('Use only one H1 tag per page');
    }

    // Heading hierarchy evaluation
    const hierarchyIssues = headingsData.issues.filter(issue => 
      issue.includes('hierarchy issue')
    );
    
    if (hierarchyIssues.length > 0) {
      score -= hierarchyIssues.length * 10;
      suggestions.push('Fix heading hierarchy - use headings in order (H1 → H2 → H3, etc.)');
    }

    // Check for missing H2s when H3s exist
    if (headingsData.structure.h2 === 0 && headingsData.structure.h3 > 0) {
      score -= 15;
      issues.push('H3 tags exist without H2 tags');
      suggestions.push('Add H2 tags before using H3 tags');
    }

    // Check for content structure
    const totalHeadings = Object.values(headingsData.structure).reduce((sum, count) => sum + count, 0);
    if (totalHeadings === 0) {
      score -= 50;
      issues.push('No heading tags found');
      suggestions.push('Add heading tags to structure your content');
    } else if (totalHeadings < 3) {
      score -= 10;
      suggestions.push('Consider adding more headings to improve content structure');
    }

    // Check for empty headings
    const emptyHeadings = headingsData.headings.filter(h => h.text.trim() === '').length;
    if (emptyHeadings > 0) {
      score -= emptyHeadings * 5;
      issues.push(`${emptyHeadings} empty heading tags found`);
      suggestions.push('Remove empty heading tags or add descriptive text');
    }

    // Check for very long headings
    const longHeadings = headingsData.headings.filter(h => h.text.length > 70).length;
    if (longHeadings > 0) {
      score -= longHeadings * 5;
      issues.push(`${longHeadings} headings are too long (>70 characters)`);
      suggestions.push('Keep headings concise and under 70 characters');
    }

    // Ensure score doesn't go below 0
    score = Math.max(0, score);

    return {
      ...headingsData,
      score,
      issues,
      suggestions,
      totalHeadings,
      status: 'success'
    };

  } catch (error) {
    console.error('Headings audit failed:', error);
    return {
      headings: [],
      structure: { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 },
      issues: [error.message],
      suggestions: ['Check if the URL is accessible', 'Verify CORS policy allows content fetching'],
      totalHeadings: 0,
      score: 0,
      status: 'error'
    };
  }
};