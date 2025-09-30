import axios from 'axios';

// Google PageSpeed Insights API
export const getPageSpeedData = async (url, strategy = 'mobile') => {
  const apiKey = import.meta.env.VITE_PAGESPEED_API_KEY;
  
  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error('Please set your PageSpeed API key in the .env file');
  }

  try {
    const response = await axios.get('https://www.googleapis.com/pagespeedonline/v5/runPagespeed', {
      params: {
        url,
        key: apiKey,
        strategy,
        category: ['PERFORMANCE', 'ACCESSIBILITY', 'BEST_PRACTICES', 'SEO']
      }
    });

    return response.data;
  } catch (error) {
    console.error('PageSpeed API Error:', error);
    throw new Error('Failed to fetch PageSpeed data');
  }
};

// Fetch HTML content for parsing
export const fetchHtmlContent = async (url) => {
  try {
    // Using a CORS proxy for demo purposes
    // In production, you might need a proper proxy server
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    
    const response = await axios.get(proxyUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    return response.data;
  } catch (error) {
    console.error('HTML Fetch Error:', error);
    throw new Error('Failed to fetch HTML content');
  }
};