import { SeoAnalysisResult } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  BookText, 
  Share2, 
  Bot, 
  LinkIcon, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Hash as HashIcon,
  Languages as LanguagesIcon,
  User as UserIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CategorySummaryCardsProps {
  result: SeoAnalysisResult;
  onCategoryClick: (category: string) => void;
}

export function CategorySummaryCards({ result, onCategoryClick }: CategorySummaryCardsProps) {
  // Calculate scores for different categories
  const calculateCategoryScore = (category: string): {score: number, status: 'success' | 'warning' | 'error'} => {
    switch (category) {
      case 'essential':
        let essentialScore = 0;
        let total = 3; // Title, Description, Canonical
        
        // Check title - most important (weight: 40%)
        if (result.metaTags.title) {
          essentialScore += result.metaTags.title.length > 60 ? 30 : 40;
        }
        
        // Check description (weight: 30%)
        if (result.metaTags.description) {
          essentialScore += result.metaTags.description.length > 160 ? 20 : 30;
        }
        
        // Check canonical (weight: 30%)
        if (result.metaTags.canonical) {
          essentialScore += 30;
        }

        return {
          score: essentialScore,
          status: essentialScore >= 70 ? 'success' : essentialScore >= 40 ? 'warning' : 'error'
        };

      case 'social':
        let socialScore = 0;
        
        // Check og:title (20%)
        if (result.metaTags['og:title']) {
          socialScore += 20;
        }
        
        // Check og:description (20%)
        if (result.metaTags['og:description']) {
          socialScore += 20;
        }
        
        // Check og:image (40% - most important for social sharing)
        if (result.metaTags['og:image']) {
          socialScore += 40;
        }
        
        // Check twitter:card (20%)
        if (result.metaTags['twitter:card']) {
          socialScore += 20;
        }

        return {
          score: socialScore,
          status: socialScore >= 70 ? 'success' : socialScore >= 40 ? 'warning' : 'error'
        };

      case 'robots':
        let robotsScore = 0;
        
        // Check if any robots-related tags exist
        if (result.metaTags['robots'] || result.metaTags['googlebot']) {
          robotsScore = 100;
        }

        return {
          score: robotsScore,
          status: robotsScore > 0 ? 'success' : 'warning'
        };

      case 'language':
        let languageScore = 0;
        
        // Check if language meta tag exists
        if (result.metaTags['language'] || result.metaTags['content-language']) {
          languageScore = 100;
        }

        return {
          score: languageScore,
          status: languageScore > 0 ? 'success' : 'warning'
        };

      case 'structured':
        return {
          score: result.googleStructuredData ? 100 : 0,
          status: result.googleStructuredData ? 'success' : 'warning'
        };

      default:
        return {
          score: 0,
          status: 'warning'
        };
    }
  };

  // Define the categories to display
  const categories = [
    { 
      id: 'essential',
      title: 'Essential SEO', 
      description: 'Title, Description & Canonical',
      icon: <BookText className="h-6 w-6" />
    },
    { 
      id: 'social',
      title: 'Social Media', 
      description: 'Open Graph & Twitter Cards',
      icon: <Share2 className="h-6 w-6" />
    },
    { 
      id: 'robots',
      title: 'Robot Control', 
      description: 'Search engine directives',
      icon: <Bot className="h-6 w-6" />
    },
    { 
      id: 'structured',
      title: 'Structured Data', 
      description: 'Rich results eligibility',
      icon: <HashIcon className="h-6 w-6" />
    },
    { 
      id: 'language',
      title: 'Language', 
      description: 'Content language metadata',
      icon: <LanguagesIcon className="h-6 w-6" />
    }
  ];

  const getStatusIcon = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-amber-500" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />;
    }
  };

  const getStatusColor = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return "bg-green-600";
      case 'warning':
        return "bg-amber-500";
      case 'error':
        return "bg-red-500";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map(category => {
        const { score, status } = calculateCategoryScore(category.id);
        
        return (
          <Card 
            key={category.id}
            className="bg-white overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onCategoryClick(category.id)}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <div className={cn(
                      "p-2 rounded-full",
                      status === 'success' ? 'bg-green-50' : 
                      status === 'warning' ? 'bg-amber-50' : 'bg-red-50'
                    )}>
                      {category.icon}
                    </div>
                    <h3 className="text-lg font-semibold">{category.title}</h3>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{category.description}</p>
                </div>
                <div className="flex-shrink-0">
                  {getStatusIcon(status)}
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Implementation Score</span>
                  <span className="font-medium">{score}%</span>
                </div>
                <Progress 
                  value={score} 
                  className="h-2 bg-gray-100" 
                  indicatorClassName={cn(getStatusColor(status))}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}