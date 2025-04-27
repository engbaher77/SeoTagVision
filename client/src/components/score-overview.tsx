import { SeoAnalysisResult } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Tag, AlertTriangle, InfoIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ScoreOverviewProps {
  result: SeoAnalysisResult;
}

export function ScoreOverview({ result }: ScoreOverviewProps) {
  const getScoreColor = (score: number) => {
    if (score < 50) return "text-error bg-error/10";
    if (score < 80) return "text-warning bg-warning/10";
    return "text-success bg-success/10";
  };

  const getScoreProgressColor = (score: number) => {
    if (score < 50) return "bg-error";
    if (score < 80) return "bg-warning";
    return "bg-success";
  };

  const getScoreTextColor = (score: number) => {
    if (score < 50) return "text-error";
    if (score < 80) return "text-warning";
    return "text-success";
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-gray-900">SEO Tag Analysis Results</h2>
        <div className="mt-3 sm:mt-0">
          <span className="text-sm font-medium text-gray-500">Last analyzed: </span>
          <span className="text-sm font-medium">{new Date().toLocaleString()}</span>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Overall Score */}
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className={cn("flex-shrink-0 rounded-md p-3", getScoreColor(result.seoScore))}>
                <BarChart3 className="h-6 w-6" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <p className="text-sm font-medium text-gray-500 truncate">Overall SEO Score</p>
                <div className="mt-1">
                  <div className="flex items-center">
                    <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                      <Progress 
                        value={result.seoScore} 
                        className={getScoreProgressColor(result.seoScore)} 
                      />
                    </div>
                    <span 
                      className={cn("ml-2 text-xl font-semibold", getScoreTextColor(result.seoScore))}
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
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-secondary bg-opacity-10 rounded-md p-3">
                <Tag className="h-6 w-6 text-secondary" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <p className="text-sm font-medium text-gray-500 truncate">Total SEO Tags</p>
                <div>
                  <div className="text-xl font-semibold text-gray-900">{result.totalTags}</div>
                  <div className="mt-1 flex items-baseline text-sm text-gray-600">
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
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-error bg-opacity-10 rounded-md p-3">
                <AlertTriangle className="h-6 w-6 text-error" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <p className="text-sm font-medium text-gray-500 truncate">Issues Found</p>
                <div>
                  <div className="text-xl font-semibold text-gray-900">{result.totalIssues}</div>
                  <div className="mt-1 flex items-baseline text-sm">
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
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-info bg-opacity-10 rounded-md p-3">
                <InfoIcon className="h-6 w-6 text-info" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <p className="text-sm font-medium text-gray-500 truncate">Improvement Suggestions</p>
                <div>
                  <div className="text-xl font-semibold text-gray-900">{result.totalSuggestions}</div>
                  <div className="mt-1 text-sm text-gray-600">Easy opportunities to improve</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
