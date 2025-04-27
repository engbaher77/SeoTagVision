import { useState, useRef } from "react";
import { UrlInput } from "@/components/url-input";
import { ScoreOverview } from "@/components/score-overview";
import { PreviewSection } from "@/components/preview-section";
import { TagAnalysis } from "@/components/tag-analysis";
import { ImprovementSuggestions } from "@/components/improvement-suggestions";
import { AllMetaTags } from "@/components/all-meta-tags";
import { SeoAnalysisResult } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Code, Facebook, Twitter, Github, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<SeoAnalysisResult | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Refs for section navigation
  const previewSectionRef = useRef<HTMLDivElement>(null);
  const tagAnalysisRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const allTagsRef = useRef<HTMLDivElement>(null);
  
  const analyzeMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest('POST', '/api/analyze', { url });
      return response.json();
    },
    onSuccess: (data: SeoAnalysisResult) => {
      setAnalysisResult(data);
      // Scroll to the top of results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onError: (error: Error) => {
      toast({
        title: "Error analyzing URL",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAnalyzeUrl = (url: string) => {
    analyzeMutation.mutate(url);
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Code className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              <h1 className="text-xl md:text-2xl font-bold text-neutral-800">SEO Tag Analyzer</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="social-icon" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="social-icon" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="social-icon" />
              </a>
              <a href="https://example.com" target="_blank" rel="noopener noreferrer" aria-label="Website">
                <Globe className="social-icon" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <UrlInput 
          onAnalyze={handleAnalyzeUrl} 
          isLoading={analyzeMutation.isPending} 
        />

        {analyzeMutation.isPending && (
          <div className="bg-white shadow rounded-lg p-4 md:p-6 mb-8">
            <div className="animate-pulse space-y-6">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="h-40 bg-gray-200 rounded"></div>
                <div className="h-40 bg-gray-200 rounded"></div>
                <div className="h-40 bg-gray-200 rounded"></div>
                <div className="h-40 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        )}

        {!analyzeMutation.isPending && analysisResult && (
          <div className="space-y-6 md:space-y-8">
            <ScoreOverview 
              result={analysisResult} 
              onPreviewClick={() => scrollToSection(previewSectionRef)} 
              onTagsClick={() => scrollToSection(tagAnalysisRef)} 
              onIssuesClick={() => scrollToSection(suggestionsRef)} 
              onAllTagsClick={() => scrollToSection(allTagsRef)}  
            />
            
            <div ref={previewSectionRef} className="section-anchor">
              <PreviewSection result={analysisResult} />
            </div>
            
            <div ref={tagAnalysisRef} className="section-anchor">
              <TagAnalysis result={analysisResult} />
            </div>
            
            <div ref={suggestionsRef} className="section-anchor">
              <ImprovementSuggestions suggestions={analysisResult.suggestions} />
            </div>
            
            <div ref={allTagsRef} className="section-anchor">
              <AllMetaTags result={analysisResult} />
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-8 md:mt-12">
        <div className="max-w-7xl mx-auto py-4 md:py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <p className="text-center md:text-left text-sm text-gray-500">
              SEO Tag Analyzer — Analyze and improve your website's SEO meta tags
            </p>
            
            <div className="flex justify-center md:justify-end space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="social-icon" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="social-icon" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="social-icon" />
              </a>
              <a href="https://example.com" target="_blank" rel="noopener noreferrer" aria-label="Website">
                <Globe className="social-icon" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
