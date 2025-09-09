import { SearchForm } from "@/components/sections/search/form";
import { searchQuotes } from "@/lib/api/quotes";
import { searchScripture } from "@/lib/api/scripture";
import { LengthFilter } from "@/lib/api/types";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  return (
    <main>
      <div className="grid lg:grid-cols-8 gap-4 px-4 lg:px-8">
        <div className="lg:col-span-2">
          <Suspense fallback={<div>Loading...</div>}>
            <SearchForm />
          </Suspense>
        </div>
        <div className="lg:col-span-6">
          <Suspense fallback={<div>Loading...</div>}>
            <SearchResults searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

const SearchResults = async ({ searchParams }: PageProps) => {
  const search = await searchParams;
  const mode = (search.mode as string) || "quotes";
  const keyword = (search.keyword as string) || "";
  const author = (search.author as string) || "";
  const ref = (search.ref as string) || (search.chapter as string) || "";
  const religion = (search.religion as string) || "Christianity";

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

  let results: any[] = [];
  let resultsType = "";

  if (mode === "scripture") {
    results = await searchScripture({
      keyword,
      ref,
      faith: religion,
      limit: 50,
    });
    resultsType = "scripture";
  } else {
    results = await searchQuotes({ keyword, author, lengths });
    resultsType = "quotes";
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Results</h2>
      <p className="text-muted-foreground">
        {resultsType === "scripture"
          ? `Scripture results for "${keyword}" ${
              ref ? `in ${ref}` : ""
            } from ${religion}`
          : `Quote results for "${keyword}" ${author ? `by ${author}` : ""}`}
      </p>

      {results.length > 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Found {results.length} {resultsType}
          </p>
          <div className="grid gap-4">
            {results.map((result, i) => (
              <div key={i} className="p-4 border rounded-lg">
                {resultsType === "scripture" ? (
                  <>
                    <p className="mb-2">{result.text}</p>
                    <p className="text-sm text-muted-foreground">
                      {result.book} {result.ref}
                    </p>
                  </>
                ) : (
                  <>
                    <blockquote className="mb-2 italic">
                      "{result.quote}"
                    </blockquote>
                    {result.author && (
                      <p className="text-sm text-muted-foreground">
                        — {result.author}
                      </p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground">
          No results found. Try different search terms.
        </p>
      )}
    </div>
  );
};
