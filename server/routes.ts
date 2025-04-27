import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { urlSchema } from "@shared/schema";
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // API endpoint to analyze a URL
  app.post('/api/analyze', async (req, res) => {
    try {
      const { url } = urlSchema.parse(req.body);
      
      // Fetch the HTML content
      const response = await fetch(url);
      
      if (!response.ok) {
        return res.status(400).json({ message: `Failed to fetch ${url}: ${response.statusText}` });
      }
      
      const html = await response.text();
      
      // Parse the HTML using Cheerio
      const $ = cheerio.load(html);
      
      // Extract all meta tags
      const metaTags: Record<string, string> = {};
      const allMetaTags: Record<string, any[]> = {
        'basic': [],
        'openGraph': [],
        'twitter': [],
        'robots': [],
        'other': []
      };
      
      // Extract title
      const title = $('title').text();
      metaTags['title'] = title;
      
      // Extract meta description
      const metaDescription = $('meta[name="description"]').attr('content');
      if (metaDescription) {
        metaTags['description'] = metaDescription;
      }
      
      // Extract canonical URL
      const canonical = $('link[rel="canonical"]').attr('href');
      if (canonical) {
        metaTags['canonical'] = canonical;
      }
      
      // Process all meta tags
      $('meta').each((i, elem) => {
        const name = $(elem).attr('name') || '';
        const property = $(elem).attr('property') || '';
        const httpEquiv = $(elem).attr('http-equiv') || '';
        const content = $(elem).attr('content') || '';
        const charset = $(elem).attr('charset') || '';
        
        const key = property || name || httpEquiv || (charset ? 'charset' : '');
        
        if (key) {
          metaTags[key] = content;
          
          // Categorize the meta tag
          const tagObj = { name, property, httpEquiv, content, charset };
          
          if (property && property.startsWith('og:')) {
            allMetaTags['openGraph'].push(tagObj);
          } else if (property && property.startsWith('twitter:')) {
            allMetaTags['twitter'].push(tagObj);
          } else if (name === 'robots' || name === 'googlebot') {
            allMetaTags['robots'].push(tagObj);
          } else if (name || httpEquiv || charset) {
            allMetaTags['basic'].push(tagObj);
          } else {
            allMetaTags['other'].push(tagObj);
          }
        }
      });
      
      // Check for JSON-LD structured data
      const googleStructuredData = $('script[type="application/ld+json"]').length > 0;
      
      // Count totals
      const metaTagsCount = $('meta').length;
      const otherTagsCount = 2; // title and canonical
      const totalTags = metaTagsCount + otherTagsCount;
      
      // Calculate the SEO score
      let seoScore = 100;
      let criticalIssues = 0;
      let warningIssues = 0;
      
      // Critical issues (-15 points each)
      if (!metaTags['title']) {
        seoScore -= 15;
        criticalIssues++;
      }
      
      if (!metaTags['description']) {
        seoScore -= 15;
        criticalIssues++;
      }
      
      if (!metaTags['og:image']) {
        seoScore -= 15;
        criticalIssues++;
      }
      
      // Warning issues (-10 points each)
      if (metaTags['title'] && metaTags['title'].length > 60) {
        seoScore -= 10;
        warningIssues++;
      }
      
      if (metaTags['description'] && metaTags['description'].length > 160) {
        seoScore -= 10;
        warningIssues++;
      }
      
      if (!metaTags['canonical']) {
        seoScore -= 10;
        warningIssues++;
      }
      
      if (!metaTags['twitter:card']) {
        seoScore -= 10;
        warningIssues++;
      }
      
      // Ensure score is between 0 and 100
      seoScore = Math.max(0, Math.min(100, seoScore));
      
      // Generate suggestions
      const suggestions = [];
      
      if (!metaTags['og:image']) {
        suggestions.push({
          title: 'Add Open Graph Image',
          description: 'Your site is missing the og:image meta tag. Adding an image that\'s at least 1200×630 pixels will significantly improve engagement when your content is shared on Facebook and other platforms.',
          priority: 'high' as const,
          codeExample: '<meta property="og:image" content="https://example.com/images/og-image.jpg">'
        });
      }
      
      if (metaTags['title'] && metaTags['title'].length > 60) {
        suggestions.push({
          title: 'Optimize Title Length',
          description: `Your title tag is ${metaTags['title'].length} characters long, which is longer than the recommended 60 characters and may be truncated in search results. Consider shortening it to ensure the most important keywords appear within the visible portion.`,
          priority: 'medium' as const
        });
      }
      
      if (!metaTags['twitter:card']) {
        suggestions.push({
          title: 'Add Twitter Card Meta Tag',
          description: 'Your site is missing the twitter:card meta tag. This tag controls how your content appears when shared on Twitter.',
          priority: 'medium' as const,
          codeExample: '<meta name="twitter:card" content="summary_large_image">'
        });
      }
      
      if (!metaTags['description']) {
        suggestions.push({
          title: 'Add Meta Description',
          description: 'Your site is missing a meta description. Adding a compelling description between 150-160 characters can improve click-through rates from search results.',
          priority: 'high' as const,
          codeExample: '<meta name="description" content="A descriptive and compelling summary of your page content.">'
        });
      }
      
      if (!metaTags['canonical']) {
        suggestions.push({
          title: 'Add Canonical URL',
          description: 'Your site is missing a canonical URL tag. This helps prevent duplicate content issues by specifying the preferred version of a page.',
          priority: 'medium' as const,
          codeExample: `<link rel="canonical" href="${url}">`
        });
      }
      
      const totalSuggestions = suggestions.length;
      const totalIssues = criticalIssues + warningIssues;
      
      // Complete result
      const result = {
        url,
        title,
        metaTags,
        seoScore,
        totalTags,
        metaTagsCount,
        otherTagsCount,
        totalIssues,
        criticalIssues,
        warningIssues,
        totalSuggestions,
        googleStructuredData,
        suggestions,
        allMetaTags
      };
      
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Error analyzing URL' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
