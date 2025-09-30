import { fetchHtmlContent } from '../utils/api';
import { parseHtml, extractImages } from '../utils/htmlParser';

export const runImagesAudit = async (url) => {
  try {
    const htmlContent = await fetchHtmlContent(url);
    const doc = parseHtml(htmlContent);
    const imagesData = extractImages(doc);

    let score = 100;
    const issues = [...imagesData.issues];
    const suggestions = [];

    // Alt text evaluation
    if (imagesData.totalImages === 0) {
      // No penalty for no images, but note it
      suggestions.push('No images found on this page');
    } else {
      const altTextPercentage = (imagesData.imagesWithAlt / imagesData.totalImages) * 100;
      
      if (altTextPercentage < 50) {
        score -= 40;
        suggestions.push('Add alt text to all images for accessibility');
      } else if (altTextPercentage < 80) {
        score -= 20;
        suggestions.push('Add alt text to remaining images');
      } else if (altTextPercentage < 100) {
        score -= 10;
        suggestions.push('Add alt text to the few remaining images');
      }

      // Check for generic alt text
      const genericAltTexts = ['image', 'img', 'picture', 'photo', 'icon'];
      const genericAltCount = imagesData.images.filter(img => 
        img.hasAlt && genericAltTexts.some(generic => 
          img.alt.toLowerCase().includes(generic) && img.alt.split(' ').length <= 2
        )
      ).length;

      if (genericAltCount > 0) {
        score -= genericAltCount * 5;
        issues.push(`${genericAltCount} images have generic alt text`);
        suggestions.push('Use descriptive alt text instead of generic terms like "image" or "photo"');
      }

      // Check for very long alt text
      const longAltCount = imagesData.images.filter(img => 
        img.hasAlt && img.alt.length > 125
      ).length;

      if (longAltCount > 0) {
        score -= longAltCount * 3;
        issues.push(`${longAltCount} images have alt text over 125 characters`);
        suggestions.push('Keep alt text concise, under 125 characters');
      }

      // Check for images with empty alt (alt="")
      const emptyAltCount = imagesData.images.filter(img => 
        img.alt === '' && img.hasAlt
      ).length;

      if (emptyAltCount > 0) {
        issues.push(`${emptyAltCount} images have empty alt attributes`);
        suggestions.push('Either add descriptive alt text or remove alt attribute for decorative images');
      }
    }

    // Check for images with src issues
    const brokenSrcCount = imagesData.images.filter(img => 
      !img.src || img.src === ''
    ).length;

    if (brokenSrcCount > 0) {
      score -= brokenSrcCount * 10;
      issues.push(`${brokenSrcCount} images have missing or empty src attributes`);
      suggestions.push('Fix images with missing src attributes');
    }

    // Additional suggestions for good practices
    if (imagesData.totalImages > 0 && suggestions.length === 0) {
      suggestions.push('Great job! All images have proper alt text');
    }

    if (imagesData.totalImages > 20) {
      suggestions.push('Consider lazy loading for better performance with many images');
    }

    // Ensure score doesn't go below 0
    score = Math.max(0, score);

    return {
      ...imagesData,
      score,
      issues,
      suggestions,
      altTextPercentage: imagesData.totalImages > 0 
        ? Math.round((imagesData.imagesWithAlt / imagesData.totalImages) * 100)
        : 100,
      status: 'success'
    };

  } catch (error) {
    console.error('Images audit failed:', error);
    return {
      images: [],
      totalImages: 0,
      imagesWithAlt: 0,
      imagesMissingAlt: 0,
      missingAltImages: [],
      issues: [error.message],
      suggestions: ['Check if the URL is accessible', 'Verify CORS policy allows content fetching'],
      altTextPercentage: 0,
      score: 0,
      status: 'error'
    };
  }
};