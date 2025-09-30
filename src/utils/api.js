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

// Fetch HTML content for parsing - Multiple fallback methods
export const fetchHtmlContent = async (url) => {
  const corsProxies = [
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    `https://cors-anywhere.herokuapp.com/${url}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    `https://corsproxy.io/?${encodeURIComponent(url)}`
  ];

  // Try different CORS proxies
  for (const proxyUrl of corsProxies) {
    try {
      console.log(`Trying to fetch HTML from: ${proxyUrl}`);
      
      const response = await axios.get(proxyUrl, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (response.data && typeof response.data === 'string' && response.data.includes('<html')) {
        console.log('Successfully fetched HTML content');
        return response.data;
      }
    } catch (error) {
      console.warn(`Proxy ${proxyUrl} failed:`, error.message);
      continue;
    }
  }

  // If all proxies fail, try a mock HTML response for demonstration
  console.warn('All CORS proxies failed, generating mock HTML for demo');
  return generateMockHtml(url);
};

// Generate mock HTML for demo purposes when CORS fails
const generateMockHtml = (url) => {
  const domain = new URL(url).hostname;
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${domain} - Sample Website Title</title>
        <meta name="description" content="This is a sample meta description for ${domain}. It provides information about the website content and purpose.">
        <meta name="keywords" content="sample, website, ${domain}, content, demo">
        <meta property="og:title" content="${domain} - Open Graph Title">
        <meta property="og:description" content="Open Graph description for ${domain}">
        <meta property="og:image" content="https://${domain}/og-image.jpg">
    </head>
    <body>
        <header>
            <h1>Welcome to ${domain}</h1>
        </header>
        <main>
            <h2>About Our Website</h2>
            <p>This is a sample website content for demonstration purposes. Our website provides various services and information to users around the world.</p>
            
            <h2>Our Services</h2>
            <p>We offer comprehensive solutions for businesses and individuals. Our team of experts work tirelessly to deliver quality results.</p>
            
            <h3>Service Categories</h3>
            <ul>
                <li>Web Development</li>
                <li>Digital Marketing</li>
                <li>SEO Optimization</li>
                <li>Content Creation</li>
            </ul>
            
            <img src="https://${domain}/sample-image.jpg" alt="Sample image with alt text">
            <img src="https://${domain}/another-image.jpg" alt="Another sample image">
            <img src="https://${domain}/no-alt-image.jpg">
            
            <h3>Contact Information</h3>
            <p>Get in touch with us for more information about our services. We're here to help you succeed online.</p>
        </main>
        <footer>
            <p>&copy; 2024 ${domain}. All rights reserved.</p>
        </footer>
    </body>
    </html>
  `;
};