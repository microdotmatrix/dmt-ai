"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LengthFilter } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

interface QuotesSearchFormProps {
  defaultKeyword?: string;
  defaultAuthor?: string;
  defaultLengths?: LengthFilter[];
}

export function QuotesSearchForm({
  defaultKeyword,
  defaultAuthor,
  defaultLengths = [],
}: QuotesSearchFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Form state
  const [keyword, setKeyword] = useState(defaultKeyword || "");
  const [author, setAuthor] = useState(defaultAuthor || "");
  const [lengths, setLengths] = useState<Set<LengthFilter>>(
    new Set(defaultLengths)
  );

  // Advanced search state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [includeQuran, setIncludeQuran] = useState(false);
  const [includeBible, setIncludeBible] = useState(false);
  const [includeTorah, setIncludeTorah] = useState(false);
  const [includeVedas, setIncludeVedas] = useState(false);
  const [includeBuddhist, setIncludeBuddhist] = useState(false);

  const handleLengthToggle = (length: LengthFilter) => {
    const newLengths = new Set(lengths);
    if (newLengths.has(length)) {
      newLengths.delete(length);
    } else {
      newLengths.add(length);
    }
    setLengths(newLengths);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(() => {
      const params = new URLSearchParams(searchParams);

      if (keyword) {
        params.set("keyword", keyword);
      } else {
        params.delete("keyword");
      }
      if (author) {
        params.set("author", author);
      } else {
        params.delete("author");
      }
      if (lengths.size > 0) {
        params.set("lengths", Array.from(lengths).join(","));
      } else {
        params.delete("lengths");
      }

      // Add religious scripture params (for future implementation)
      if (includeQuran) params.set("includeQuran", "true");
      if (includeBible) params.set("includeBible", "true");
      if (includeTorah) params.set("includeTorah", "true");
      if (includeVedas) params.set("includeVedas", "true");
      if (includeBuddhist) params.set("includeBuddhist", "true");

      const url = `${pathname}?${params.toString()}`;
      router.replace(url);
    });
  };

  const handleClear = () => {
    setKeyword("");
    setAuthor("");
    setLengths(new Set());
    setIncludeQuran(false);
    setIncludeBible(false);
    setIncludeTorah(false);
    setIncludeVedas(false);
    setIncludeBuddhist(false);

    startTransition(() => {
      router.replace(pathname);
    });
  };

  const hasFilters = keyword || author || lengths.size > 0;

  return (
    <Card className="border-2">
      <CardContent className="p-6">
        <form onSubmit={handleSearch} className="space-y-6">
          {/* Basic Search Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="keyword">Keywords</Label>
              <Input
                id="keyword"
                type="text"
                placeholder="Search for quotes..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                type="text"
                placeholder="Author name..."
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="h-11"
              />
            </div>
          </div>

          {/* Length Filters */}
          <div className="space-y-2">
            <Label>Quote Length</Label>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="short"
                  checked={lengths.has("short")}
                  onCheckedChange={() => handleLengthToggle("short")}
                />
                <Label
                  htmlFor="short"
                  className="text-sm font-normal cursor-pointer"
                >
                  Short (≤100 chars)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="medium"
                  checked={lengths.has("medium")}
                  onCheckedChange={() => handleLengthToggle("medium")}
                />
                <Label
                  htmlFor="medium"
                  className="text-sm font-normal cursor-pointer"
                >
                  Medium (100-200 chars)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="long"
                  checked={lengths.has("long")}
                  onCheckedChange={() => handleLengthToggle("long")}
                />
                <Label
                  htmlFor="long"
                  className="text-sm font-normal cursor-pointer"
                >
                  Long (&gt;200 chars)
                </Label>
              </div>
            </div>
          </div>

          {/* Advanced Search Collapsible */}
          <div className="border-t pt-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
            >
              {showAdvanced ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              Advanced Search Options
            </button>

            <div
              className={cn(
                "grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden transition-all duration-300",
                showAdvanced ? "mt-4 max-h-96" : "max-h-0"
              )}
            >
              <div className="space-y-3">
                <Label className="text-sm text-muted-foreground">
                  Include Religious Scriptures
                </Label>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="quran"
                      checked={includeQuran}
                      onCheckedChange={(checked) =>
                        setIncludeQuran(checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="quran"
                      className="text-sm font-normal cursor-pointer"
                    >
                      Quran
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="bible"
                      checked={includeBible}
                      onCheckedChange={(checked) =>
                        setIncludeBible(checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="bible"
                      className="text-sm font-normal cursor-pointer"
                    >
                      Bible
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="torah"
                      checked={includeTorah}
                      onCheckedChange={(checked) =>
                        setIncludeTorah(checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="torah"
                      className="text-sm font-normal cursor-pointer"
                    >
                      Torah
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm text-muted-foreground invisible">
                  More Scriptures
                </Label>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="vedas"
                      checked={includeVedas}
                      onCheckedChange={(checked) =>
                        setIncludeVedas(checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="vedas"
                      className="text-sm font-normal cursor-pointer"
                    >
                      Vedas
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="buddhist"
                      checked={includeBuddhist}
                      onCheckedChange={(checked) =>
                        setIncludeBuddhist(checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="buddhist"
                      className="text-sm font-normal cursor-pointer"
                    >
                      Buddhist Texts
                    </Label>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <p className="text-xs text-muted-foreground italic">
                  Note: Religious scripture search is coming soon and will be
                  available in a future update.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isPending || (!keyword && !author)}
              className="flex-1 md:flex-none"
            >
              <Search className="mr-2 h-4 w-4" />
              {isPending ? "Searching..." : "Search Quotes"}
            </Button>

            {hasFilters && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClear}
                disabled={isPending}
              >
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
