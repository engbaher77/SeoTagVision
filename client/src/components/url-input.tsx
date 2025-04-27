import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LinkIcon, X, Loader2 } from "lucide-react";
import { urlSchema } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

const sampleUrls = [
  'https://example.com',
  'https://github.com',
  'https://tailwindcss.com'
];

interface UrlInputProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export function UrlInput({ onAnalyze, isLoading }: UrlInputProps) {
  const form = useForm<z.infer<typeof urlSchema>>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: '',
    },
  });

  const handleSubmit = (values: z.infer<typeof urlSchema>) => {
    onAnalyze(values.url);
  };

  const handleSampleUrl = (url: string) => {
    form.setValue('url', url);
    form.handleSubmit(() => onAnalyze(url))();
  };

  const clearInput = () => {
    form.reset();
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <div className="max-w-3xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col sm:flex-row sm:items-end space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-grow">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Website URL</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LinkIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            placeholder="https://example.com"
                            className="pl-10 pr-12 py-6"
                            {...field}
                          />
                          {field.value && (
                            <div className="absolute inset-y-0 right-0 flex items-center">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-full px-3 text-gray-400 hover:text-gray-500"
                                onClick={clearInput}
                              >
                                <X className="h-5 w-5" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-shrink-0">
                <Button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-6"
                  disabled={isLoading || !form.formState.isValid}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>

        <div className="mt-6">
          <div className="text-sm text-gray-500 mb-2">Try these examples:</div>
          <div className="flex flex-wrap gap-2">
            {sampleUrls.map((url) => (
              <Badge
                key={url}
                variant="outline"
                className="cursor-pointer bg-gray-100 text-gray-800 hover:bg-gray-200"
                onClick={() => handleSampleUrl(url)}
              >
                {url}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
