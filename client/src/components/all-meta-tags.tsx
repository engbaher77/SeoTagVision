import { useState } from "react";
import { SeoAnalysisResult, MetaTag } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AllMetaTagsProps {
  result: SeoAnalysisResult;
}

export function AllMetaTags({ result }: AllMetaTagsProps) {
  const [showAllMetaTags, setShowAllMetaTags] = useState(false);
  const [metaTagsFilter, setMetaTagsFilter] = useState("");

  const toggleAllMetaTags = () => {
    setShowAllMetaTags(!showAllMetaTags);
  };

  // Function to get tag name for display
  const getTagName = (tag: MetaTag) => {
    if (tag.property) return tag.property;
    if (tag.name) return tag.name;
    if (tag.httpEquiv) return `http-equiv="${tag.httpEquiv}"`;
    if (tag.charset) return `charset="${tag.charset}"`;
    return "unknown";
  };

  // Filter tags based on search input
  const filterTags = (tags: MetaTag[], filter: string) => {
    if (!filter) return tags;
    
    return tags.filter(tag => {
      const tagName = getTagName(tag);
      return tagName.toLowerCase().includes(filter.toLowerCase()) || 
             tag.content.toLowerCase().includes(filter.toLowerCase());
    });
  };

  const getTagCategories = () => {
    if (!result.allMetaTags) return [];
    
    return Object.entries(result.allMetaTags).map(([category, tags]) => {
      const filteredTags = filterTags(tags, metaTagsFilter);
      return { category, tags: filteredTags };
    }).filter(group => group.tags.length > 0);
  };

  const getCategoryName = (category: string) => {
    const categoryMap: Record<string, string> = {
      'basic': 'Basic Meta Tags',
      'openGraph': 'Open Graph Tags',
      'twitter': 'Twitter Card Tags',
      'robots': 'Robot Control Tags',
      'other': 'Other Meta Tags'
    };
    
    return categoryMap[category] || category;
  };

  return (
    <Card className="bg-white shadow rounded-lg overflow-hidden">
      <CardHeader className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-medium text-gray-900">All Meta Tags</CardTitle>
            <CardDescription className="text-sm text-gray-500">Complete list of meta tags found on the page</CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={toggleAllMetaTags}
          >
            {showAllMetaTags ? 'Hide All Tags' : 'Show All Tags'}
          </Button>
        </div>
      </CardHeader>
      
      {showAllMetaTags ? (
        <CardContent className="p-6 bg-gray-50">
          <div className="mb-4">
            <label htmlFor="search-meta-tags" className="block text-sm font-medium text-gray-700">Filter tags</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="search-meta-tags"
                placeholder="Search meta tags..."
                className="pl-10"
                value={metaTagsFilter}
                onChange={(e) => setMetaTagsFilter(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {getTagCategories().map(({ category, tags }) => (
              <div key={category} className="rounded-md border border-gray-200 overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                  {getCategoryName(category)}
                </div>
                <ul className="divide-y divide-gray-200">
                  {tags.map((tag, index) => (
                    <li key={index} className="px-4 py-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{getTagName(tag)}</p>
                          <p className="mt-1 text-xs text-gray-600 font-mono break-all">{tag.content}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      ) : (
        <CardContent className="px-6 py-12 text-center">
          <ClipboardIcon className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">View All Meta Tags</h3>
          <p className="mt-1 text-sm text-gray-500">Click the button above to view all meta tags found on the page</p>
        </CardContent>
      )}
    </Card>
  );
}
