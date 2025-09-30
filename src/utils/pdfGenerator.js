import jsPDF from 'jspdf';

export const generatePdfReport = (url, results) => {
  const pdf = new jsPDF();
  const pageHeight = pdf.internal.pageSize.height;
  let yPosition = 20;

  // Helper function to add text with line breaks
  const addText = (text, x, y, options = {}) => {
    const lines = pdf.splitTextToSize(text, options.maxWidth || 170);
    pdf.text(lines, x, y);
    return y + (lines.length * (options.lineHeight || 7));
  };

  // Header
  pdf.setFontSize(20);
  pdf.setTextColor(0, 153, 204); // Varabit blue
  yPosition = addText('Varabit SEO Audit Report', 20, yPosition);
  
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  yPosition = addText(`URL: ${url}`, 20, yPosition + 10);
  yPosition = addText(`Generated: ${new Date().toLocaleString()}`, 20, yPosition + 5);
  
  yPosition += 10;

  // Page Speed Results
  if (results.pageSpeed) {
    pdf.setFontSize(16);
    pdf.setTextColor(0, 153, 204);
    yPosition = addText('Page Speed Analysis', 20, yPosition);
    
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    yPosition = addText(`Performance Score: ${results.pageSpeed.performance || 'N/A'}`, 20, yPosition + 5);
    yPosition = addText(`SEO Score: ${results.pageSpeed.seo || 'N/A'}`, 20, yPosition + 5);
    yPosition = addText(`Accessibility Score: ${results.pageSpeed.accessibility || 'N/A'}`, 20, yPosition + 5);
    yPosition = addText(`Best Practices Score: ${results.pageSpeed.bestPractices || 'N/A'}`, 20, yPosition + 5);
    
    if (results.pageSpeed.issues && results.pageSpeed.issues.length > 0) {
      yPosition += 5;
      yPosition = addText('Issues:', 20, yPosition);
      results.pageSpeed.issues.forEach(issue => {
        yPosition = addText(`• ${issue}`, 25, yPosition + 5);
      });
    }
    yPosition += 10;
  }

  // Meta Tags Results
  if (results.metaTags) {
    if (yPosition > pageHeight - 50) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(16);
    pdf.setTextColor(0, 153, 204);
    yPosition = addText('Meta Tags Analysis', 20, yPosition);
    
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    yPosition = addText(`Title: ${results.metaTags.title.content.substring(0, 100)}${results.metaTags.title.content.length > 100 ? '...' : ''}`, 20, yPosition + 5);
    yPosition = addText(`Title Length: ${results.metaTags.title.length} characters`, 20, yPosition + 5);
    yPosition = addText(`Description: ${results.metaTags.description.content.substring(0, 100)}${results.metaTags.description.content.length > 100 ? '...' : ''}`, 20, yPosition + 5);
    yPosition = addText(`Description Length: ${results.metaTags.description.length} characters`, 20, yPosition + 5);
    
    const allMetaIssues = [...results.metaTags.title.issues, ...results.metaTags.description.issues, ...results.metaTags.openGraph.issues];
    if (allMetaIssues.length > 0) {
      yPosition += 5;
      yPosition = addText('Issues:', 20, yPosition);
      allMetaIssues.forEach(issue => {
        yPosition = addText(`• ${issue}`, 25, yPosition + 5);
      });
    }
    yPosition += 10;
  }

  // Headings Results
  if (results.headings) {
    if (yPosition > pageHeight - 50) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(16);
    pdf.setTextColor(0, 153, 204);
    yPosition = addText('Headings Structure', 20, yPosition);
    
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    yPosition = addText(`H1: ${results.headings.structure.h1}, H2: ${results.headings.structure.h2}, H3: ${results.headings.structure.h3}`, 20, yPosition + 5);
    yPosition = addText(`H4: ${results.headings.structure.h4}, H5: ${results.headings.structure.h5}, H6: ${results.headings.structure.h6}`, 20, yPosition + 5);
    
    if (results.headings.issues.length > 0) {
      yPosition += 5;
      yPosition = addText('Issues:', 20, yPosition);
      results.headings.issues.forEach(issue => {
        yPosition = addText(`• ${issue}`, 25, yPosition + 5);
      });
    }
    yPosition += 10;
  }

  // Images Results
  if (results.images) {
    if (yPosition > pageHeight - 50) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(16);
    pdf.setTextColor(0, 153, 204);
    yPosition = addText('Images Analysis', 20, yPosition);
    
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    yPosition = addText(`Total Images: ${results.images.totalImages}`, 20, yPosition + 5);
    yPosition = addText(`Images with Alt Text: ${results.images.imagesWithAlt}`, 20, yPosition + 5);
    yPosition = addText(`Images Missing Alt Text: ${results.images.imagesMissingAlt}`, 20, yPosition + 5);
    
    if (results.images.issues.length > 0) {
      yPosition += 5;
      yPosition = addText('Issues:', 20, yPosition);
      results.images.issues.forEach(issue => {
        yPosition = addText(`• ${issue}`, 25, yPosition + 5);
      });
    }
    yPosition += 10;
  }

  // Keyword Density Results
  if (results.keywordDensity && results.keywordDensity.topKeywords) {
    if (yPosition > pageHeight - 50) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(16);
    pdf.setTextColor(0, 153, 204);
    yPosition = addText('Keyword Density', 20, yPosition);
    
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    yPosition = addText(`Word Count: ${results.keywordDensity.wordCount}`, 20, yPosition + 5);
    yPosition += 5;
    yPosition = addText('Top Keywords:', 20, yPosition);
    
    results.keywordDensity.topKeywords.slice(0, 10).forEach(keyword => {
      yPosition = addText(`• ${keyword.word}: ${keyword.count} times (${keyword.density}%)`, 25, yPosition + 5);
    });
    yPosition += 10;
  }

  // Footer
  if (yPosition > pageHeight - 30) {
    pdf.addPage();
    yPosition = 20;
  }

  pdf.setFontSize(10);
  pdf.setTextColor(128, 128, 128);
  pdf.text('Generated by Varabit SEO Audit - https://varabit.com', 20, pageHeight - 20);
  pdf.text('GPL v2 or later - support@varabit.com', 20, pageHeight - 10);

  // Save the PDF
  pdf.save(`seo-audit-${new Date().toISOString().split('T')[0]}.pdf`);
};