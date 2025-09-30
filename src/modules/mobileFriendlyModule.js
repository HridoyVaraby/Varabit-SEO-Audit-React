import { fetchHtmlContent } from '../utils/api';
import { parseHtml, extractMetaTags } from '../utils/htmlParser';

export const runMobileFriendlyAudit = async (url) => {
  try {
    const htmlContent = await fetchHtmlContent(url);
    const doc = parseHtml(htmlContent);
    const metaTags = extractMetaTags(doc);

    let score = 100;
    const issues = [];
    const suggestions = [];
    const checks = {
      viewport: false,
      flexibleImages: false,
      readableText: false,
      touchTargets: false,
      noFlash: false
    };

    // Check viewport meta tag
    if (metaTags.viewport.hasMobileViewport) {
      checks.viewport = true;
    } else {
      score -= 30;
      issues.push('Missing or incorrect viewport meta tag');
      suggestions.push('Add viewport meta tag: <meta name="viewport" content="width=device-width, initial-scale=1">');
    }

    // Check for responsive images (basic check)
    const images = doc.querySelectorAll('img');
    let responsiveImageCount = 0;
    images.forEach(img => {
      const style = img.getAttribute('style') || '';
      const className = img.getAttribute('class') || '';
      
      if (style.includes('max-width') || 
          style.includes('width: 100%') || 
          className.includes('responsive') ||
          img.hasAttribute('srcset')) {
        responsiveImageCount++;
      }
    });

    if (images.length === 0 || responsiveImageCount / images.length > 0.5) {
      checks.flexibleImages = true;
    } else {
      score -= 20;
      issues.push('Images may not be responsive');
      suggestions.push('Use responsive images with max-width: 100% or srcset attribute');
    }

    // Check for readable text (font size)
    const styles = doc.querySelectorAll('style');
    const stylesheets = Array.from(styles).map(style => style.textContent).join(' ');
    
    // Basic check for small font sizes
    const smallFontPattern = /font-size\s*:\s*([0-9]+(?:\.[0-9]+)?)(px|pt|em|rem)/gi;
    let hasSmallFonts = false;
    let match;

    while ((match = smallFontPattern.exec(stylesheets)) !== null) {
      const size = parseFloat(match[1]);
      const unit = match[2];
      
      if ((unit === 'px' && size < 14) || 
          (unit === 'pt' && size < 11) ||
          (unit === 'em' && size < 0.9) ||
          (unit === 'rem' && size < 0.9)) {
        hasSmallFonts = true;
        break;
      }
    }

    if (!hasSmallFonts) {
      checks.readableText = true;
    } else {
      score -= 15;
      issues.push('Some text may be too small to read on mobile');
      suggestions.push('Use font sizes of at least 14px for body text');
    }

    // Check for touch-friendly elements (basic check)
    const buttons = doc.querySelectorAll('button, a, input[type="button"], input[type="submit"]');
    let touchFriendlyCount = 0;

    buttons.forEach(button => {
      const style = window.getComputedStyle ? window.getComputedStyle(button) : null;
      const className = button.getAttribute('class') || '';
      
      // Basic heuristic for touch-friendly elements
      if (className.includes('btn') || 
          className.includes('button') ||
          button.tagName === 'BUTTON') {
        touchFriendlyCount++;
      }
    });

    if (buttons.length === 0 || touchFriendlyCount / buttons.length > 0.7) {
      checks.touchTargets = true;
    } else {
      score -= 10;
      issues.push('Some interactive elements may be too small for touch');
      suggestions.push('Ensure buttons and links are at least 44px tall for easy tapping');
    }

    // Check for Flash content
    const flashElements = doc.querySelectorAll('object, embed');
    const hasFlash = Array.from(flashElements).some(el => {
      const type = el.getAttribute('type') || '';
      const src = el.getAttribute('src') || '';
      return type.includes('flash') || src.includes('.swf');
    });

    if (!hasFlash) {
      checks.noFlash = true;
    } else {
      score -= 25;
      issues.push('Flash content detected');
      suggestions.push('Replace Flash content with HTML5 alternatives');
    }

    // Check CSS media queries for responsive design
    const hasMediaQueries = stylesheets.includes('@media') && 
                           (stylesheets.includes('max-width') || stylesheets.includes('min-width'));
    
    if (hasMediaQueries) {
      // Bonus points for responsive design
      score = Math.min(100, score + 5);
    } else {
      score -= 10;
      issues.push('No responsive CSS media queries detected');
      suggestions.push('Use CSS media queries to create responsive layouts');
    }

    // Additional checks
    const hasFixedElements = stylesheets.includes('position: fixed') || 
                           stylesheets.includes('position:fixed');
    
    if (hasFixedElements) {
      issues.push('Fixed positioning may cause mobile usability issues');
      suggestions.push('Test fixed elements on mobile devices for usability');
    }

    // Calculate passed checks
    const passedChecks = Object.values(checks).filter(Boolean).length;
    const totalChecks = Object.keys(checks).length;

    // Ensure score doesn't go below 0
    score = Math.max(0, score);

    return {
      score,
      issues,
      suggestions,
      checks,
      passedChecks,
      totalChecks,
      viewport: metaTags.viewport,
      hasMediaQueries,
      status: 'success'
    };

  } catch (error) {
    console.error('Mobile-friendly audit failed:', error);
    return {
      score: 0,
      issues: [error.message || 'Failed to analyze mobile-friendliness'],
      suggestions: [
        'Check if the URL is accessible', 
        'Note: This demo uses fallback data when CORS prevents direct access',
        'In production, you would use a proper proxy server'
      ],
      checks: {
        viewport: false,
        flexibleImages: false,
        readableText: false,
        touchTargets: false,
        noFlash: false
      },
      passedChecks: 0,
      totalChecks: 5,
      viewport: { content: '', hasMobileViewport: false },
      hasMediaQueries: false,
      status: 'error'
    };
  }
};