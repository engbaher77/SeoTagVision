import { SeoAnalysisResult } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Tag, AlertTriangle, InfoIcon, Share2, ExternalLink, ChevronDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ScoreOverviewProps {
  result: SeoAnalysisResult;
  onPreviewClick: () => void;
  onTagsClick: () => void;
  onIssuesClick: () => void;
  onAllTagsClick: () => void;
}

export function ScoreOverview({ 
  result, 
  onPreviewClick, 
  onTagsClick, 
  onIssuesClick, 
  onAllTagsClick 
}: ScoreOverviewProps) {
  const isMobile = useIsMobile();
  
  const getScoreColor = (score: number) => {
    if (score < 50) return "text-red-500 bg-red-50";
    if (score < 80) return "text-amber-500 bg-amber-50";
    return "text-green-600 bg-green-50";
  };

  const getScoreProgressColor = (score: number) => {
    if (score < 50) return "bg-red-500";
    if (score < 80) return "bg-amber-500";
    return "bg-green-600";
  };

  const getScoreTextColor = (score: number) => {
    if (score < 50) return "score-bad";
    if (score < 80) return "score-warning";
    return "score-good";
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 md:p-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h2 className="text-lg md:text-xl font-bold text-gray-900">SEO Tag Analysis Results</h2>
        <div className="mt-3 sm:mt-0 flex items-center space-x-2 text-xs md:text-sm">
          <span className="font-medium text-gray-500">Last analyzed: </span>
          <span className="font-medium">{new Date().toLocaleString()}</span>
          <button className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
            <Share2 className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>
      
      <div className="mt-4 md:mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Overall Score */}
        <Card 
          className="bg-white border border-gray-200 relative group card-link"
          onClick={onPreviewClick}
        >
          <CardContent className="p-4 md:p-6">
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronDown className="h-4 w-4 text-primary rotate-270" />
            </div>
            <div className="flex items-center">
              <div className={cn("flex-shrink-0 rounded-md p-2 md:p-3", getScoreColor(result.seoScore))}>
                <BarChart3 className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <div className="ml-3 md:ml-5 w-0 flex-1">
                <p className="text-xs md:text-sm font-medium text-gray-500 truncate">Overall SEO Score</p>
                <div className="mt-1">
                  <div className="flex items-center">
                    <div className="relative w-full h-3 md:h-4 bg-gray-200 rounded-full overflow-hidden">
                      <Progress 
                        value={result.seoScore} 
                        className={getScoreProgressColor(result.seoScore)} 
                      />
                    </div>
                    <span 
                      className={cn("ml-2 text-lg md:text-xl font-semibold", getScoreTextColor(result.seoScore))}
                    >
                      {result.seoScore}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tag Counts */}
        <Card 
          className="bg-white border border-gray-200 relative group card-link"
          onClick={onTagsClick}
        >
          <CardContent className="p-4 md:p-6">
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLink className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-info/10 rounded-md p-2 md:p-3">
                <Tag className="h-5 w-5 md:h-6 md:w-6 text-info" />
              </div>
              <div className="ml-3 md:ml-5 w-0 flex-1">
                <p className="text-xs md:text-sm font-medium text-gray-500 truncate">Total SEO Tags</p>
                <div>
                  <div className="text-lg md:text-xl font-semibold text-gray-900">{result.totalTags}</div>
                  <div className="mt-1 flex items-baseline text-xs md:text-sm text-gray-600">
                    <div>{result.metaTagsCount} Meta</div>
                    <div className="mx-2">•</div>
                    <div>{result.otherTagsCount} Other</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Issues */}
        <Card 
          className="bg-white border border-gray-200 relative group card-link"
          onClick={onIssuesClick}
        >
          <CardContent className="p-4 md:p-6">
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLink className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-error/10 rounded-md p-2 md:p-3">
                <AlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-error" />
              </div>
              <div className="ml-3 md:ml-5 w-0 flex-1">
                <p className="text-xs md:text-sm font-medium text-gray-500 truncate">Issues Found</p>
                <div>
                  <div className="text-lg md:text-xl font-semibold text-gray-900">{result.totalIssues}</div>
                  <div className="mt-1 flex items-baseline text-xs md:text-sm">
                    <div className="text-error">{result.criticalIssues} Critical</div>
                    <div className="mx-2">•</div>
                    <div className="text-warning">{result.warningIssues} Warnings</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suggestions */}
        <Card 
          className="bg-white border border-gray-200 relative group card-link"
          onClick={onAllTagsClick}
        >
          <CardContent className="p-4 md:p-6">
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLink className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-info/10 rounded-md p-2 md:p-3">
                <InfoIcon className="h-5 w-5 md:h-6 md:w-6 text-info" />
              </div>
              <div className="ml-3 md:ml-5 w-0 flex-1">
                <p className="text-xs md:text-sm font-medium text-gray-500 truncate">Improvement Suggestions</p>
                <div>
                  <div className="text-lg md:text-xl font-semibold text-gray-900">{result.totalSuggestions}</div>
                  <div className="mt-1 text-xs md:text-sm text-gray-600">Easy opportunities to improve</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
