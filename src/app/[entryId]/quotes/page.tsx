import { searchQuotes } from "@/lib/api/quotes";
import { searchBibleText, searchQuranText } from "@/lib/api/scripture";
import { LengthFilter } from "@/lib/api/types";
import { Suspense } from "react";
import { z } from "zod";
import { QuotesResults } from "./quotes-results";
import { QuotesSearchForm } from "./quotes-search-form";

interface PageProps {
  params: Promise<{ entryId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function QuotesPage({ params, searchParams }: PageProps) {
  const { entryId } = await params;
  const search = await searchParams;

  // Parse search parameters
  const keyword = search.keyword as string | undefined;
  const author = search.author as string | undefined;

  // Parse length filters
  const lengthParams = search.lengths as string | string[] | undefined;
  let lengths: LengthFilter[] | undefined;
  if (lengthParams) {
    if (Array.isArray(lengthParams)) {
      lengths = lengthParams as LengthFilter[];
    } else {
      lengths = lengthParams.split(",") as LengthFilter[];
    }
  }

  // Only fetch quotes if we have search parameters
  const hasSearchParams = keyword || author;

  const searchAction = async (init: any, formData: FormData) => {
    const inputs = z
      .object({
        keyword: z.string().min(1),
        author: z.string().min(1),
        lengths: z.array(z.enum(["short", "medium", "long"])).min(1),
      })
      .safeParse(Object.fromEntries(formData));

    if (!inputs.success) {
      return { success: false, errors: inputs.error.message };
    }

    const { keyword, author, lengths } = inputs.data;
    const quotes = await searchQuotes({ keyword, author, lengths });
    return {
      success: true,
      quotes,
    };
  };

  const scripture = await searchBibleText("abomination");
  const quran = await searchQuranText("abomination");

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Quote Search</h1>
          <p className="text-muted-foreground text-lg">
            Discover inspiring quotes from great minds throughout history
          </p>
        </div>

        {/* Search Form */}
        <Suspense fallback={<div>Loading...</div>}>
          <QuotesSearchForm
            defaultKeyword={keyword}
            defaultAuthor={author}
            defaultLengths={lengths}
          />
        </Suspense>

        {/* Results */}
        {hasSearchParams && (
          <Suspense fallback={<div>Loading...</div>}>
            <QuotesResults
              keyword={keyword}
              author={author}
              lengths={lengths}
            />
          </Suspense>
        )}

        {/* Empty state when no search */}
        {!hasSearchParams && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              Enter keywords or an author name to search for quotes
            </p>
          </div>
        )}
      </div>

      <pre>{JSON.stringify(quran, null, 2)}</pre>
      <pre>{JSON.stringify(scripture, null, 2)}</pre>
    </div>
  );
}
