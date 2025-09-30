import { fetchHtmlContent } from '../utils/api';
import { parseHtml, extractTextContent } from '../utils/htmlParser';

export const runKeywordDensityAudit = async (url) => {
  try {
    const htmlContent = await fetchHtmlContent(url);
    const doc = parseHtml(htmlContent);
    const textData = extractTextContent(doc);

    let score = 100;
    const issues = [];
    const suggestions = [];

    // Analyze content length
    if (textData.wordCount < 300) {
      score -= 20;
      issues.push('Content is too short (under 300 words)');
      suggestions.push('Add more content to improve SEO - aim for at least 300 words');
    } else if (textData.wordCount < 500) {
      score -= 10;
      suggestions.push('Consider adding more content - 500+ words is ideal for SEO');
    }

    // Analyze keyword density
    const keywordIssues = [];
    const overOptimizedKeywords = [];
    const underOptimizedKeywords = [];

    textData.topKeywords.forEach(keyword => {
      const density = parseFloat(keyword.density);
      
      if (density > 5) {
        overOptimizedKeywords.push(keyword);
        keywordIssues.push(`"${keyword.word}" appears too frequently (${keyword.density}%)`);
      } else if (density > 3) {
        // Warning level
        keywordIssues.push(`"${keyword.word}" density is high (${keyword.density}%) - monitor for over-optimization`);
      }
    });

    if (overOptimizedKeywords.length > 0) {
      score -= overOptimizedKeywords.length * 10;
      suggestions.push('Reduce keyword density for over-optimized terms (keep under 3%)');
    }

    // Check for keyword stuffing patterns
    const topKeyword = textData.topKeywords[0];
    if (topKeyword && parseFloat(topKeyword.density) > 4) {
      score -= 15;
      issues.push(`Possible keyword stuffing detected for "${topKeyword.word}"`);
      suggestions.push('Use synonyms and related terms instead of repeating the same keyword');
    }

    // Check content diversity
    const uniqueWords = textData.topKeywords.length;
    const totalWords = textData.wordCount;
    const diversityRatio = uniqueWords / totalWords;

    if (diversityRatio < 0.3) {
      score -= 10;
      issues.push('Content lacks keyword diversity');
      suggestions.push('Use more varied vocabulary and related terms');
    }

    // Check for common stop words domination
    const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];
    const topNonStopWords = textData.topKeywords.filter(kw => !stopWords.includes(kw.word));
    
    if (topNonStopWords.length < 5) {
      score -= 15;
      issues.push('Content dominated by common words');
      suggestions.push('Include more topic-specific and meaningful keywords');
    }

    // Analyze readability (basic)
    const averageWordLength = textData.topKeywords.reduce((sum, kw) => sum + kw.word.length, 0) / textData.topKeywords.length;
    
    if (averageWordLength > 7) {
      suggestions.push('Consider using simpler language for better readability');
    } else if (averageWordLength < 4) {
      suggestions.push('Content might benefit from more descriptive vocabulary');
    }

    // Check for balanced keyword distribution
    const topKeywordsSum = textData.topKeywords.slice(0, 5).reduce((sum, kw) => sum + parseFloat(kw.density), 0);
    if (topKeywordsSum > 15) {
      score -= 10;
      issues.push('Top 5 keywords account for too much of the content');
      suggestions.push('Distribute keywords more evenly throughout the content');
    }

    // Positive indicators
    if (textData.wordCount >= 1000) {
      score = Math.min(100, score + 5);
      suggestions.push('Great! Content length is good for SEO');
    }

    if (topNonStopWords.length >= 10 && overOptimizedKeywords.length === 0) {
      score = Math.min(100, score + 5);
    }

    // Additional insights
    const insights = [];
    if (textData.topKeywords.length > 0) {
      insights.push(`Most frequent word: "${textData.topKeywords[0].word}" (${textData.topKeywords[0].density}%)`);
    }
    
    insights.push(`Content density: ${(textData.wordCount / textData.textLength * 100).toFixed(1)}% words to total characters`);

    // Ensure score doesn't go below 0
    score = Math.max(0, score);

    return {
      ...textData,
      score,
      issues: [...issues, ...keywordIssues],
      suggestions,
      insights,
      overOptimizedKeywords,
      diversityRatio: (diversityRatio * 100).toFixed(1),
      averageWordLength: averageWordLength.toFixed(1),
      status: 'success'
    };

  } catch (error) {
    console.error('Keyword density audit failed:', error);
    return {
      wordCount: 0,
      topKeywords: [],
      textLength: 0,
      score: 0,
      issues: [error.message || 'Failed to analyze keyword density'],
      suggestions: [
        'Check if the URL is accessible', 
        'Note: This demo uses fallback data when CORS prevents direct access',
        'In production, you would use a proper proxy server'
      ],
      insights: [],
      overOptimizedKeywords: [],
      diversityRatio: '0.0',
      averageWordLength: '0.0',
      status: 'error'
    };
  }
};