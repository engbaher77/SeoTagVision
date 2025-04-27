import { useState } from "react";
import { SeoAnalysisResult } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoIcon, AlertTriangle, Search, Facebook, Twitter } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PreviewSectionProps {
  result: SeoAnalysisResult;
}

export function PreviewSection({ result }: PreviewSectionProps) {
  const [activeTab, setActiveTab] = useState("google");
  const isMobile = useIsMobile();
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="border-b border-gray-200">
        <div className="px-4 md:px-6 py-3 md:py-4">
          <h2 className="text-base md:text-lg font-medium text-gray-900">Search & Social Media Previews</h2>
          <p className="mt-1 text-xs md:text-sm text-gray-500">See how your site appears in search results and social media shares</p>
        </div>
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="border-b border-gray-200 w-full justify-start rounded-none h-auto px-2 md:px-6 overflow-x-auto flex">
            <TabsTrigger 
              value="google" 
              className="px-3 md:px-6 py-2 md:py-3 border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 data-[state=inactive]:hover:border-gray-300 font-medium text-xs md:text-sm rounded-none flex items-center space-x-1 whitespace-nowrap"
            >
              <Search className="h-3 w-3 md:h-4 md:w-4" />
              <span>Google Search</span>
            </TabsTrigger>
            <TabsTrigger 
              value="facebook" 
              className="px-3 md:px-6 py-2 md:py-3 border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 data-[state=inactive]:hover:border-gray-300 font-medium text-xs md:text-sm rounded-none flex items-center space-x-1 whitespace-nowrap"
            >
              <Facebook className="h-3 w-3 md:h-4 md:w-4" />
              <span>Facebook</span>
            </TabsTrigger>
            <TabsTrigger 
              value="twitter" 
              className="px-3 md:px-6 py-2 md:py-3 border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 data-[state=inactive]:hover:border-gray-300 font-medium text-xs md:text-sm rounded-none flex items-center space-x-1 whitespace-nowrap"
            >
              <Twitter className="h-3 w-3 md:h-4 md:w-4" />
              <span>Twitter</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="p-3 md:p-6">
            <TabsContent value="google" className="mt-0">
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-md border p-3 md:p-4">
                  <div className="mb-1 text-xs text-green-700 truncate">{result.url}</div>
                  <div className="text-base md:text-xl text-blue-800 font-medium mb-1">{result.metaTags.title || 'No title tag found'}</div>
                  <div className="text-xs md:text-sm text-gray-700">{result.metaTags.description || 'No meta description found'}</div>
                  
                  {result.googleStructuredData && (
                    <div className="mt-3 md:mt-4 text-xs text-gray-500 flex items-center">
                      <InfoIcon className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                      <span>Additional structured data detected (Rich Results eligible)</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-3 md:mt-4 text-xs md:text-sm text-gray-500">
                  <div className="flex items-start mb-2 md:mb-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <InfoIcon className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    </div>
                    <div className="ml-2 md:ml-3">
                      <p className="text-gray-600">Google typically displays the first 50-60 characters of a title and 155-160 characters of a description in search results.</p>
                    </div>
                  </div>
                  
                  {result.metaTags.title && result.metaTags.title.length > 60 && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-0.5">
                        <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-amber-500" />
                      </div>
                      <div className="ml-2 md:ml-3">
                        <p className="text-amber-600">Your title is {result.metaTags.title.length} characters long and may be truncated in search results.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="facebook" className="mt-0">
              <div className="max-w-md mx-auto">
                <div className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow">
                  {result.metaTags['og:image'] ? (
                    <div className="w-full h-40 md:h-52 bg-gray-100">
                      <img 
                        src={result.metaTags['og:image']} 
                        alt="Facebook preview" 
                        className="w-full h-40 md:h-52 object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const placeholder = e.currentTarget.parentElement;
                          if (placeholder) {
                            const svg = document.createElement('div');
                            svg.className = 'w-full h-40 md:h-52 bg-gray-100 flex items-center justify-center';
                            svg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 md:h-12 md:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>`;
                            placeholder.appendChild(svg);
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-40 md:h-52 bg-gray-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-12 md:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="p-3 md:p-4">
                    <div className="text-xs uppercase text-gray-500 truncate">
                      {result.url.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                    </div>
                    <h3 className="mt-1 text-sm md:text-base font-semibold text-gray-900">
                      {result.metaTags['og:title'] || result.metaTags.title || 'No title found'}
                    </h3>
                    <p className="mt-1 text-xs md:text-sm text-gray-600 line-clamp-3">
                      {result.metaTags['og:description'] || result.metaTags.description || 'No description found'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-3 md:mt-4 text-xs md:text-sm text-gray-500">
                  <div className="flex items-start mb-2 md:mb-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <InfoIcon className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    </div>
                    <div className="ml-2 md:ml-3">
                      <p className="text-gray-600">Facebook recommends using images that are at least 1200 x 630 pixels for the best display on high resolution devices.</p>
                    </div>
                  </div>
                  
                  {!result.metaTags['og:image'] && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-0.5">
                        <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
                      </div>
                      <div className="ml-2 md:ml-3">
                        <p className="text-red-500">Missing og:image tag. Facebook will try to use an arbitrary image from your page.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="twitter" className="mt-0">
              <div className="max-w-md mx-auto">
                <div className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow">
                  {result.metaTags['twitter:image'] ? (
                    <div className="w-full h-40 md:h-52 bg-gray-100">
                      <img 
                        src={result.metaTags['twitter:image']} 
                        alt="Twitter preview" 
                        className="w-full h-40 md:h-52 object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const placeholder = e.currentTarget.parentElement;
                          if (placeholder) {
                            const svg = document.createElement('div');
                            svg.className = 'w-full h-40 md:h-52 bg-gray-100 flex items-center justify-center';
                            svg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 md:h-12 md:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>`;
                            placeholder.appendChild(svg);
                          }
                        }}
                      />
                    </div>
                  ) : result.metaTags['og:image'] ? (
                    <div className="w-full h-40 md:h-52 bg-gray-100">
                      <img 
                        src={result.metaTags['og:image']} 
                        alt="Twitter fallback" 
                        className="w-full h-40 md:h-52 object-cover" 
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const placeholder = e.currentTarget.parentElement;
                          if (placeholder) {
                            const svg = document.createElement('div');
                            svg.className = 'w-full h-40 md:h-52 bg-gray-100 flex items-center justify-center';
                            svg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 md:h-12 md:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>`;
                            placeholder.appendChild(svg);
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-40 md:h-52 bg-gray-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-12 md:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="p-3 md:p-4">
                    <h3 className="text-sm md:text-base font-semibold text-gray-900">
                      {result.metaTags['twitter:title'] || result.metaTags['og:title'] || result.metaTags.title || 'No title found'}
                    </h3>
                    <p className="mt-1 text-xs md:text-sm text-gray-600 line-clamp-3">
                      {result.metaTags['twitter:description'] || result.metaTags['og:description'] || result.metaTags.description || 'No description found'}
                    </p>
                    <div className="mt-2 text-xs text-gray-500 truncate">
                      {result.url.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 md:mt-4 text-xs md:text-sm text-gray-500">
                  <div className="flex items-start mb-2 md:mb-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <InfoIcon className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    </div>
                    <div className="ml-2 md:ml-3">
                      <p className="text-gray-600">Twitter will fall back to Open Graph tags if Twitter-specific meta tags are not found.</p>
                    </div>
                  </div>
                  
                  {!result.metaTags['twitter:card'] && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-0.5">
                        <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-amber-500" />
                      </div>
                      <div className="ml-2 md:ml-3">
                        <p className="text-amber-500">Missing twitter:card meta tag. Twitter will use a smaller summary card by default.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
