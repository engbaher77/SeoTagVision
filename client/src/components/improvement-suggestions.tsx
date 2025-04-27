import { SuggestionItem } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InfoIcon, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImprovementSuggestionsProps {
  suggestions: SuggestionItem[];
}

export function ImprovementSuggestions({ suggestions }: ImprovementSuggestionsProps) {
  const getPriorityIcon = (priority: string) => {
    const iconMap: Record<string, JSX.Element> = {
      'high': <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-red-500" />,
      'medium': <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-amber-500" />,
      'low': <InfoIcon className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
    };
    
    return iconMap[priority] || <InfoIcon className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />;
  };
  
  const getPriorityBgColor = (priority: string) => {
    const colorMap: Record<string, string> = {
      'high': 'bg-red-50',
      'medium': 'bg-amber-50',
      'low': 'bg-blue-50'
    };
    
    return colorMap[priority] || 'bg-blue-50';
  };
  
  return (
    <Card className="bg-white shadow rounded-lg overflow-hidden">
      <CardHeader className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200">
        <CardTitle className="text-base md:text-lg font-medium text-gray-900">Improvement Suggestions</CardTitle>
        <CardDescription className="text-xs md:text-sm text-gray-500">Actionable recommendations to improve your SEO tags</CardDescription>
      </CardHeader>
      <CardContent className="px-4 md:px-6 py-3 md:py-4">
        {suggestions.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="py-3 md:py-4 first:pt-0 last:pb-0">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className={cn("rounded-full p-1", getPriorityBgColor(suggestion.priority))}>
                      {getPriorityIcon(suggestion.priority)}
                    </div>
                  </div>
                  <div className="ml-2 md:ml-3">
                    <p className="text-sm md:text-base font-medium text-gray-900">{suggestion.title}</p>
                    <p className="mt-1 text-xs md:text-sm text-gray-500">{suggestion.description}</p>
                    
                    {suggestion.codeExample && (
                      <div className="mt-2 md:mt-3">
                        <div className="text-xs uppercase text-gray-500 mb-1">Example Code:</div>
                        <div className="text-xs md:text-sm font-mono bg-gray-50 p-2 rounded overflow-x-auto">
                          <code>{suggestion.codeExample}</code>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-4 md:py-6 text-center">
            <CheckCircle className="h-8 w-8 md:h-12 md:w-12 text-green-500 mx-auto" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No suggestions found</h3>
            <p className="mt-1 text-xs md:text-sm text-gray-500">Great job! Your SEO tags are well optimized.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
