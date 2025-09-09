"use client";

import { DirectionAwareTabs } from "@/components/elements/animated-tabs";
import { AnimatedInput } from "@/components/elements/form/animated-input";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export const SearchForm = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(0);

  // Get current mode from URL params, default to "quotes"
  const currentMode = searchParams.get("mode") || "quotes";

  // Determine initial active tab based on current mode
  useEffect(() => {
    const initialTab = currentMode === "scripture" ? 1 : 0;
    setActiveTab(initialTab);
  }, [currentMode]);

  const handleTabChange = (newTabId: number) => {
    const newMode = newTabId === 0 ? "quotes" : "scripture";
    setActiveTab(newTabId);

    // Update URL params
    const params = new URLSearchParams(searchParams);
    params.set("mode", newMode);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const tabs = [
    {
      id: 0,
      label: "Quotes",
      content: <SearchQuotesForm />,
    },
    {
      id: 1,
      label: "Scripture",
      content: <SearchScriptureForm />,
    },
  ];

  return (
    <div className="py-8 space-y-4 max-w-lg m-auto">
      <DirectionAwareTabs
        tabs={tabs}
        onChange={handleTabChange}
        className="bg-accent"
      />
    </div>
  );
};

const SearchQuotesForm = () => {
  const [isPending, startTransition] = useTransition();
  const [keywords, setKeywords] = useState("");
  const [author, setAuthor] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize form state from URL parameters
  useEffect(() => {
    const currentKeyword = searchParams.get("keyword") || "";
    const currentAuthor = searchParams.get("author") || "";
    setKeywords(currentKeyword);
    setAuthor(currentAuthor);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("mode", "quotes");
    
    // Always set parameters, even if empty (to clear previous searches)
    if (keywords.trim()) {
      params.set("keyword", keywords.trim());
    }
    if (author.trim()) {
      params.set("author", author.trim());
    }
    
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleReset = () => {
    setKeywords("");
    setAuthor("");
    startTransition(() => {
      router.replace(pathname);
    });
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <h5>Search Quotes</h5>
      <section className="space-y-6">
        <AnimatedInput
          label="Keywords"
          type="text"
          name="keywords"
          placeholder="Find quotes containing a specific word or phrase..."
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
        <AnimatedInput
          label="Author"
          type="text"
          name="author"
          placeholder="Find quotes by a specific person..."
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </section>
      <div className="flex justify-end items-center gap-1">
        <Button type="submit" disabled={isPending}>
          Search
        </Button>
        <Button variant="outline" type="button" onClick={handleReset}>Reset</Button>
      </div>
    </form>
  );
};

const SearchScriptureForm = () => {
  const [selectedReligion, setSelectedReligion] =
    useState<string>("Christianity");
  const [keywords, setKeywords] = useState("");
  const [chapter, setChapter] = useState("");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const religions = ["Christianity", "Islam"];

  // Initialize form state from URL parameters
  useEffect(() => {
    const currentKeyword = searchParams.get("keyword") || "";
    const currentChapter = searchParams.get("chapter") || "";
    const currentReligion = searchParams.get("religion") || "Christianity";
    setKeywords(currentKeyword);
    setChapter(currentChapter);
    setSelectedReligion(currentReligion);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("mode", "scripture");
    params.set("religion", selectedReligion);
    
    if (keywords.trim()) {
      params.set("keyword", keywords.trim());
    }
    if (chapter.trim()) {
      params.set("chapter", chapter.trim());
    }
    
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleReset = () => {
    setKeywords("");
    setChapter("");
    setSelectedReligion("Christianity");
    startTransition(() => {
      router.replace(pathname);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h5>Search Scripture</h5>

      {/* Religious Text Toggle Buttons */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Religious Text
        </label>
        <div className="flex flex-wrap gap-2">
          {religions.map((religion) => (
            <button
              key={religion}
              type="button"
              onClick={() => setSelectedReligion(religion)}
              className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                selectedReligion === religion
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {religion}
            </button>
          ))}
        </div>
      </div>

      <section className="space-y-6">
        <AnimatedInput
          label="Keywords"
          type="text"
          name="keywords"
          placeholder="Give us a word that describes what you're looking for..."
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
        <AnimatedInput
          label={
            selectedReligion === "Christianity"
              ? "Chapter"
              : selectedReligion === "Islam"
              ? "Surah"
              : selectedReligion === "Judaism"
              ? "Book"
              : selectedReligion === "Hindu"
              ? "Veda"
              : selectedReligion === "Buddhist"
              ? "Chapter"
              : selectedReligion === "Taoist"
              ? "Chapter"
              : "Chapter"
          }
          type="text"
          name="chapter"
          placeholder={
            selectedReligion === "Christianity"
              ? "Chapter"
              : selectedReligion === "Islam"
              ? "Surah"
              : selectedReligion === "Judaism"
              ? "Book"
              : selectedReligion === "Hindu"
              ? "Veda"
              : selectedReligion === "Buddhist"
              ? "Chapter"
              : selectedReligion === "Taoist"
              ? "Chapter"
              : "Chapter"
          }
          value={chapter}
          onChange={(e) => setChapter(e.target.value)}
        />
      </section>

      <div className="flex justify-end items-center gap-1">
        <Button type="submit" disabled={isPending}>
          Search
        </Button>
        <Button variant="outline" type="button" onClick={handleReset}>Reset</Button>
      </div>
    </form>
  );
};
