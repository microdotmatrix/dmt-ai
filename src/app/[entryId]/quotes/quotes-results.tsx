import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { searchQuotes } from "@/lib/api/quotes";
import { LengthFilter } from "@/lib/api/types";
import { Hash, Quote, User } from "lucide-react";

interface QuotesResultsProps {
  keyword?: string;
  author?: string;
  lengths?: LengthFilter[];
}

export async function QuotesResults({
  keyword,
  author,
  lengths,
}: QuotesResultsProps) {
  const getLengthLabel = (length: number) => {
    if (length <= 100) return "short";
    if (length <= 200) return "medium";
    return "long";
  };

  const getLengthColor = (length: number) => {
    if (length <= 100)
      return "bg-green-500/10 text-green-600 border-green-500/20";
    if (length <= 200) return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    return "bg-purple-500/10 text-purple-600 border-purple-500/20";
  };

  const quotes = await searchQuotes({
    keyword,
    author,
    lengths,
  });

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Search Results</h2>
          <p className="text-sm text-muted-foreground">
            Found {quotes.length} {quotes.length === 1 ? "quote" : "quotes"}
            {keyword && ` for "${keyword}"`}
            {author && ` by ${author}`}
          </p>
        </div>

        {/* Active Filters */}
        {(keyword || author || (lengths && lengths.length > 0)) && (
          <div className="flex flex-wrap gap-2">
            {keyword && (
              <Badge variant="secondary" className="gap-1">
                <Hash className="h-3 w-3" />
                {keyword}
              </Badge>
            )}
            {author && (
              <Badge variant="secondary" className="gap-1">
                <User className="h-3 w-3" />
                {author}
              </Badge>
            )}
            {lengths?.map((length) => (
              <Badge key={length} variant="outline">
                {length}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Quotes Grid */}
      {quotes.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quotes.map((quote, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20"
            >
              <CardContent className="p-6 space-y-4">
                {/* Quote Icon and Text */}
                <div className="space-y-3">
                  <Quote className="h-8 w-8 text-muted-foreground/30 group-hover:text-primary/30 transition-colors" />
                  <blockquote className="text-sm leading-relaxed italic">
                    "{quote.quote}"
                  </blockquote>
                </div>

                {/* Author and Metadata */}
                <div className="pt-4 border-t space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      — {quote.author}
                    </p>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getLengthColor(quote.length)}`}
                    >
                      {getLengthLabel(quote.length)}
                    </Badge>
                  </div>

                  {quote.source && (
                    <p className="text-xs text-muted-foreground">
                      Source: {quote.source}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* No Results State */
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <Quote className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium mb-2">No quotes found</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Try adjusting your search criteria or using different keywords to
              find more quotes.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
