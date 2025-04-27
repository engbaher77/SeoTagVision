import { SeoAnalysisResult } from "@shared/schema";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagAnalysisProps {
  result: SeoAnalysisResult;
}

export function TagAnalysis({ result }: TagAnalysisProps) {
  const getStatusIcon = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-error" />;
    }
  };

  const getStatusBadge = (status: string, text: string) => {
    const colorMap: Record<string, string> = {
      'optimized': 'bg-success text-white',
      'too long': 'bg-warning text-white',
      'missing': 'bg-error text-white',
      'present': 'bg-success text-white'
    };

    return (
      <Badge className={cn("px-2 text-xs", colorMap[status.toLowerCase()] || "bg-gray-200")}>
        {text}
      </Badge>
    );
  };

  const getTitleStatus = () => {
    if (!result.metaTags.title) return { icon: 'error', badge: 'Missing' };
    if (result.metaTags.title.length > 60) return { icon: 'warning', badge: 'Too Long' };
    return { icon: 'success', badge: 'Optimized' };
  };

  const getDescriptionStatus = () => {
    if (!result.metaTags.description) return { icon: 'warning', badge: 'Missing' };
    if (result.metaTags.description.length > 160) return { icon: 'warning', badge: 'Too Long' };
    return { icon: 'success', badge: 'Optimized' };
  };

  const getCanonicalStatus = () => {
    return result.metaTags.canonical 
      ? { icon: 'success', badge: 'Present' } 
      : { icon: 'warning', badge: 'Missing' };
  };

  const titleStatus = getTitleStatus();
  const descriptionStatus = getDescriptionStatus();
  const canonicalStatus = getCanonicalStatus();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Essential SEO Tags */}
      <Card>
        <CardHeader className="px-6 py-4 border-b border-gray-200">
          <CardTitle className="text-lg font-medium text-gray-900">Essential SEO Tags</CardTitle>
          <CardDescription className="text-sm text-gray-500">Primary tags that affect search engine rankings</CardDescription>
        </CardHeader>
        <CardContent className="px-6 py-4">
          <ul className="divide-y divide-gray-200">
            {/* Title Tag */}
            <li className="py-4">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div>{getStatusIcon(titleStatus.icon)}</div>
                  <span className="ml-2 font-medium">Title Tag</span>
                </div>
                {getStatusBadge(titleStatus.badge, titleStatus.badge)}
              </div>
              <div className="mt-2">
                <div className="text-sm font-mono bg-gray-50 p-2 rounded overflow-x-auto">
                  <code>{result.metaTags.title || 'No title tag found'}</code>
                </div>
                {result.metaTags.title && (
                  <div className="mt-2 text-sm text-gray-500">
                    Length: {result.metaTags.title.length} characters (Recommended: 50-60)
                  </div>
                )}
                {!result.metaTags.title && (
                  <div className="mt-2 text-sm text-gray-500">
                    The title tag is crucial for SEO and should be included on every page.
                  </div>
                )}
              </div>
            </li>
            
            {/* Meta Description */}
            <li className="py-4">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div>{getStatusIcon(descriptionStatus.icon)}</div>
                  <span className="ml-2 font-medium">Meta Description</span>
                </div>
                {getStatusBadge(descriptionStatus.badge, descriptionStatus.badge)}
              </div>
              <div className="mt-2">
                <div className="text-sm font-mono bg-gray-50 p-2 rounded overflow-x-auto">
                  <code>{result.metaTags.description || 'No meta description found'}</code>
                </div>
                {result.metaTags.description && (
                  <div className="mt-2 text-sm text-gray-500">
                    Length: {result.metaTags.description.length} characters (Recommended: 150-160)
                  </div>
                )}
                {!result.metaTags.description && (
                  <div className="mt-2 text-sm text-gray-500">
                    A meta description helps improve click-through rates from search results.
                  </div>
                )}
              </div>
            </li>
            
            {/* Canonical URL */}
            <li className="py-4">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div>{getStatusIcon(canonicalStatus.icon)}</div>
                  <span className="ml-2 font-medium">Canonical URL</span>
                </div>
                {getStatusBadge(canonicalStatus.badge, canonicalStatus.badge)}
              </div>
              <div className="mt-2">
                <div className="text-sm font-mono bg-gray-50 p-2 rounded overflow-x-auto">
                  <code>{result.metaTags.canonical || 'No canonical URL found'}</code>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Canonical URLs help prevent duplicate content issues by specifying the preferred version of a page.
                </div>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Social Media Tags */}
      <Card>
        <CardHeader className="px-6 py-4 border-b border-gray-200">
          <CardTitle className="text-lg font-medium text-gray-900">Social Media Tags</CardTitle>
          <CardDescription className="text-sm text-gray-500">Tags that control how your content appears on social platforms</CardDescription>
        </CardHeader>
        <CardContent className="px-6 py-4">
          <ul className="divide-y divide-gray-200">
            {/* Open Graph Title */}
            <li className="py-4">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div>
                    {getStatusIcon(result.metaTags['og:title'] ? 'success' : 'warning')}
                  </div>
                  <span className="ml-2 font-medium">og:title</span>
                </div>
                {getStatusBadge(
                  result.metaTags['og:title'] ? 'Present' : 'Missing', 
                  result.metaTags['og:title'] ? 'Present' : 'Missing'
                )}
              </div>
              <div className="mt-2">
                <div className="text-sm font-mono bg-gray-50 p-2 rounded overflow-x-auto">
                  <code>{result.metaTags['og:title'] || 'No og:title found'}</code>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  The og:title tag controls how your title appears when shared on Facebook and other platforms.
                </div>
              </div>
            </li>
            
            {/* Open Graph Image */}
            <li className="py-4">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div>
                    {getStatusIcon(result.metaTags['og:image'] ? 'success' : 'error')}
                  </div>
                  <span className="ml-2 font-medium">og:image</span>
                </div>
                {getStatusBadge(
                  result.metaTags['og:image'] ? 'Present' : 'Missing', 
                  result.metaTags['og:image'] ? 'Present' : 'Missing'
                )}
              </div>
              <div className="mt-2">
                <div className="text-sm font-mono bg-gray-50 p-2 rounded overflow-x-auto">
                  <code>{result.metaTags['og:image'] || 'No og:image found'}</code>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  The og:image tag is critical for engagement when your content is shared on social media.
                </div>
              </div>
            </li>

            {/* Twitter Card */}
            <li className="py-4">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div>
                    {getStatusIcon(result.metaTags['twitter:card'] ? 'success' : 'warning')}
                  </div>
                  <span className="ml-2 font-medium">twitter:card</span>
                </div>
                {getStatusBadge(
                  result.metaTags['twitter:card'] ? 'Present' : 'Missing', 
                  result.metaTags['twitter:card'] ? 'Present' : 'Missing'
                )}
              </div>
              <div className="mt-2">
                <div className="text-sm font-mono bg-gray-50 p-2 rounded overflow-x-auto">
                  <code>{result.metaTags['twitter:card'] || 'No twitter:card found'}</code>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  The twitter:card tag controls the appearance of your content when shared on Twitter.
                </div>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
