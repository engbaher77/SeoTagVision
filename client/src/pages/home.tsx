import { useState } from "react";
import { UrlInput } from "@/components/url-input";
import { ScoreOverview } from "@/components/score-overview";
import { PreviewSection } from "@/components/preview-section";
import { TagAnalysis } from "@/components/tag-analysis";
import { ImprovementSuggestions } from "@/components/improvement-suggestions";
import { AllMetaTags } from "@/components/all-meta-tags";
import { SeoAnalysisResult } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<SeoAnalysisResult | null>(null);
  const { toast } = useToast();
  
  const analyzeMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest('POST', '/api/analyze', { url });
      return response.json();
    },
    onSuccess: (data: SeoAnalysisResult) => {
      setAnalysisResult(data);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-neutral-800">SEO Tag Analyzer</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UrlInput 
          onAnalyze={handleAnalyzeUrl} 
          isLoading={analyzeMutation.isPending} 
        />

        {analyzeMutation.isPending && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <div className="animate-pulse space-y-6">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-40 bg-gray-200 rounded"></div>
                <div className="h-40 bg-gray-200 rounded"></div>
                <div className="h-40 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        )}

        {!analyzeMutation.isPending && analysisResult && (
          <div className="space-y-8">
            <ScoreOverview result={analysisResult} />
            <PreviewSection result={analysisResult} />
            <TagAnalysis result={analysisResult} />
            <ImprovementSuggestions suggestions={analysisResult.suggestions} />
            <AllMetaTags result={analysisResult} />
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">SEO Tag Analyzer — Analyze and improve your website's SEO meta tags</p>
        </div>
      </footer>
    </div>
  );
}
