// HTML parsing utilities using DOMParser
export const parseHtml = (htmlString) => {
  const parser = new DOMParser();
  return parser.parseFromString(htmlString, 'text/html');
};

// Extract meta tags
export const extractMetaTags = (doc) => {
  const title = doc.querySelector('title')?.textContent || '';
  const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  const keywords = doc.querySelector('meta[name="keywords"]')?.getAttribute('content') || '';
  const viewport = doc.querySelector('meta[name="viewport"]')?.getAttribute('content') || '';
  
  // Open Graph tags
  const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
  const ogDescription = doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
  const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';

  return {
    title: {
      content: title,
      length: title.length,
      issues: [
        ...(title.length === 0 ? ['Missing title tag'] : []),
        ...(title.length > 60 ? ['Title too long (>60 characters)'] : []),
        ...(title.length < 30 ? ['Title too short (<30 characters)'] : [])
      ]
    },
    description: {
      content: description,
      length: description.length,
      issues: [
        ...(description.length === 0 ? ['Missing meta description'] : []),
        ...(description.length > 160 ? ['Description too long (>160 characters)'] : []),
        ...(description.length < 120 ? ['Description too short (<120 characters)'] : [])
      ]
    },
    keywords,
    viewport: {
      content: viewport,
      hasMobileViewport: viewport.includes('width=device-width')
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      image: ogImage,
      issues: [
        ...(ogTitle.length === 0 ? ['Missing og:title'] : []),
        ...(ogDescription.length === 0 ? ['Missing og:description'] : []),
        ...(ogImage.length === 0 ? ['Missing og:image'] : [])
      ]
    }
  };
};

// Extract heading structure
export const extractHeadings = (doc) => {
  const headings = [];
  const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  
  headingTags.forEach(tag => {
    const elements = doc.querySelectorAll(tag);
    elements.forEach(el => {
      headings.push({
        level: parseInt(tag.substring(1)),
        text: el.textContent.trim(),
        tag: tag.toUpperCase()
      });
    });
  });

  const h1Count = headings.filter(h => h.level === 1).length;
  const issues = [];

  if (h1Count === 0) {
    issues.push('No H1 tag found');
  } else if (h1Count > 1) {
    issues.push('Multiple H1 tags found');
  }

  // Check heading hierarchy
  let prevLevel = 0;
  headings.forEach(heading => {
    if (heading.level > prevLevel + 1) {
      issues.push(`Heading hierarchy issue: ${heading.tag} follows H${prevLevel}`);
    }
    prevLevel = heading.level;
  });

  return {
    headings,
    structure: {
      h1: headings.filter(h => h.level === 1).length,
      h2: headings.filter(h => h.level === 2).length,
      h3: headings.filter(h => h.level === 3).length,
      h4: headings.filter(h => h.level === 4).length,
      h5: headings.filter(h => h.level === 5).length,
      h6: headings.filter(h => h.level === 6).length,
    },
    issues
  };
};

// Extract images and check alt text
export const extractImages = (doc) => {
  const images = Array.from(doc.querySelectorAll('img')).map(img => ({
    src: img.src || img.getAttribute('src') || '',
    alt: img.alt || '',
    hasAlt: !!img.alt,
    title: img.title || ''
  }));

  const missingAlt = images.filter(img => !img.hasAlt);
  const totalImages = images.length;

  return {
    images,
    totalImages,
    imagesWithAlt: totalImages - missingAlt.length,
    imagesMissingAlt: missingAlt.length,
    missingAltImages: missingAlt,
    issues: missingAlt.length > 0 ? [`${missingAlt.length} images missing alt text`] : []
  };
};

// Extract text content and calculate keyword density
export const extractTextContent = (doc) => {
  // Remove script and style elements
  const scripts = doc.querySelectorAll('script, style');
  scripts.forEach(el => el.remove());

  const textContent = doc.body?.textContent || doc.textContent || '';
  const words = textContent.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);

  const wordCount = words.length;
  const wordFrequency = {};

  words.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });

  // Get top keywords
  const sortedWords = Object.entries(wordFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20)
    .map(([word, count]) => ({
      word,
      count,
      density: ((count / wordCount) * 100).toFixed(2)
    }));

  return {
    wordCount,
    topKeywords: sortedWords,
    textLength: textContent.length
  };
};