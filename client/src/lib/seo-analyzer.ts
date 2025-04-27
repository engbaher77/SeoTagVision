import { SeoAnalysisResult, SuggestionItem } from "@shared/schema";

// Calculate the SEO score based on a set of rules
export function calculateScore(result: Partial<SeoAnalysisResult>): number {
  let score = 100;
  let deductions = 0;
  
  // Critical issues (-15 points each)
  if (!result.metaTags?.title) {
    deductions += 15;
  }
  
  if (!result.metaTags?.description) {
    deductions += 15;
  }
  
  if (!result.metaTags?.['og:image']) {
    deductions += 15;
  }
  
  // Warning issues (-10 points each)
  if (result.metaTags?.title && result.metaTags.title.length > 60) {
    deductions += 10;
  }
  
  if (result.metaTags?.description && result.metaTags.description.length > 160) {
    deductions += 10;
  }
  
  if (!result.metaTags?.canonical) {
    deductions += 10;
  }
  
  if (!result.metaTags?.['twitter:card']) {
    deductions += 10;
  }
  
  score = Math.max(0, score - deductions);
  return score;
}

// Generate suggestions based on the analysis
export function generateSuggestions(result: Partial<SeoAnalysisResult>): SuggestionItem[] {
  const suggestions: SuggestionItem[] = [];
  
  if (!result.metaTags?.['og:image']) {
    suggestions.push({
      title: 'Add Open Graph Image',
      description: 'Your site is missing the og:image meta tag. Adding an image that\'s at least 1200×630 pixels will significantly improve engagement when your content is shared on Facebook and other platforms.',
      priority: 'high',
      codeExample: '<meta property="og:image" content="https://example.com/images/og-image.jpg">'
    });
  }
  
  if (result.metaTags?.title && result.metaTags.title.length > 60) {
    suggestions.push({
      title: 'Optimize Title Length',
      description: `Your title tag is ${result.metaTags.title.length} characters long, which is longer than the recommended 60 characters and may be truncated in search results. Consider shortening it to ensure the most important keywords appear within the visible portion.`,
      priority: 'medium'
    });
  }
  
  if (!result.metaTags?.['twitter:card']) {
    suggestions.push({
      title: 'Add Twitter Card Meta Tag',
      description: 'Your site is missing the twitter:card meta tag. This tag controls how your content appears when shared on Twitter.',
      priority: 'medium',
      codeExample: '<meta name="twitter:card" content="summary_large_image">'
    });
  }
  
  if (!result.metaTags?.description) {
    suggestions.push({
      title: 'Add Meta Description',
      description: 'Your site is missing a meta description. Adding a compelling description between 150-160 characters can improve click-through rates from search results.',
      priority: 'high',
      codeExample: '<meta name="description" content="A descriptive and compelling summary of your page content.">'
    });
  }
  
  if (!result.metaTags?.canonical) {
    suggestions.push({
      title: 'Add Canonical URL',
      description: `Your site is missing a canonical URL tag. This helps prevent duplicate content issues by specifying the preferred version of a page.`,
      priority: 'medium',
      codeExample: `<link rel="canonical" href="${result.url}">`
    });
  }
  
  return suggestions;
}

// Count issues by severity
export function countIssues(suggestions: SuggestionItem[]): { critical: number, warning: number, total: number } {
  const critical = suggestions.filter(s => s.priority === 'high').length;
  const warning = suggestions.filter(s => s.priority === 'medium').length;
  const total = critical + warning;
  
  return { critical, warning, total };
}
