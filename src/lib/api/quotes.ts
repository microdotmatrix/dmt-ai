/**
 * Collection of data fetching functions for collecting, searching and filtering quotes from various APIs
 *
 * TODO: Implement quote fetching functions
 * Sources:
 *
 * - Stands4.com
 * search by keyword: https://www.stands4.com/services/v2/quotes.php?uid=${env.STANDS4_UID}&tokenid=${env.STANDS4_TOKENID}&searchtype=SEARCH&query=${encodeURIComponent(keyword)}&format=json
 * search by author: https://www.stands4.com/services/v2/quotes.php?uid=${env.STANDS4_UID}&tokenid=${env.STANDS4_TOKENID}&searchtype=AUTHOR&query=${encodeURIComponent(author)}&format=json
 *
 * - ZenQuotes
 * https://zenquotes.io/api/quotes
 *
 * - Lyrics.ovh
 *
 * Religious quote search: scripture, verses and axioms
 *
 * Quran:
 * http://api.alquran.cloud/v1/search/<keyword>/all/en
 * GET request with keyword parameter
 *
 * Bible:
 * https://api.scripture.api.bible/v1/bibles
 * GET request, authenticated by API key in headers (api-key)
 *
 */

import { mockQuotes } from "./mock";
import { LengthFilter, QuoteProps } from "./types";

export const s4 = {
  // keyword: async (keyword: string, limit: number = 50) => {
  //   const response = await fetch(
  //     `https://www.stands4.com/services/v2/quotes.php?uid=${
  //       env.STANDS4_UID
  //     }&tokenid=${
  //       env.STANDS4_TOKENID
  //     }&searchtype=SEARCH&query=${encodeURIComponent(
  //       keyword
  //     )}&limit=${limit}&format=json`,
  //     {
  //       next: {
  //         revalidate: 3600, // 1 hour
  //         tags: ["quotes", `quotes:${keyword}`],
  //       },
  //     }
  //   );

  //   if (!response.ok) {
  //     throw new Error("Failed to fetch quotes");
  //   }

  //   const json = await response.json();

  //   return json.result.map((item: { quote: string; author: string }) => ({
  //     quote: decodeHtmlEntities(item.quote),
  //     author: decodeHtmlEntities(item.author || "Unknown"),
  //     source: "Stands4.com",
  //     length: item.quote?.length || 0,
  //   }));
  // },
  // author: async (author: string, limit: number = 50) => {
  //   const response = await fetch(
  //     `https://www.stands4.com/services/v2/quotes.php?uid=${
  //       env.STANDS4_UID
  //     }&tokenid=${
  //       env.STANDS4_TOKENID
  //     }&searchtype=AUTHOR&query=${encodeURIComponent(
  //       author
  //     )}&limit=${limit}&format=json`,
  //     {
  //       next: {
  //         revalidate: 3600, // 1 hour
  //         tags: ["quotes", `quotes:${author}`],
  //       },
  //     }
  //   );
  //   const json = await response.json();

  //   return json.result.map((item: { quote: string; author: string }) => ({
  //     quote: decodeHtmlEntities(item.quote),
  //     author: decodeHtmlEntities(item.author || "Unknown"),
  //     source: "Stands4.com",
  //     length: item.quote?.length || 0,
  //   }));
  // },
  // Mock data to simulate API response without impacting daily usage limit
  keyword: async (
    keyword: string,
    limit: number = 50
  ): Promise<QuoteProps[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Filter quotes that contain the keyword (case-insensitive)
    const filteredQuotes = mockQuotes.filter((quote) =>
      quote.quote.toLowerCase().includes(keyword.toLowerCase())
    );

    // Return limited results
    return filteredQuotes.slice(0, limit);
  },

  author: async (author: string, limit: number = 50): Promise<QuoteProps[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Filter quotes by author (case-insensitive)
    const filteredQuotes = mockQuotes.filter((quote) =>
      quote.author.toLowerCase().includes(author.toLowerCase())
    );

    // Return limited results
    return filteredQuotes.slice(0, limit);
  },
};

// Helper function to filter quotes by length
function filterByLength(
  quotes: QuoteProps[],
  lengths: LengthFilter[]
): QuoteProps[] {
  if (!lengths || lengths.length === 0) return quotes;

  return quotes.filter((quote) => {
    if (lengths.includes("short") && quote.length <= 100) return true;
    if (lengths.includes("medium") && quote.length > 100 && quote.length <= 200)
      return true;
    if (lengths.includes("long") && quote.length > 200) return true;
    return false;
  });
}

export const searchQuotes = async ({
  keyword,
  author,
  lengths,
}: {
  keyword?: string;
  author?: string;
  lengths?: LengthFilter[];
}) => {
  let quotes: QuoteProps[] = [];
  if (!keyword && author) {
    quotes = await s4.author(author);
  } else if (keyword && !author) {
    quotes = await s4.keyword(keyword);
  } else if (author && keyword) {
    const results = await s4.author(author);

    const filteredQuotes = results.filter((quote: QuoteProps) =>
      quote.quote.toLowerCase().includes(keyword.toLowerCase())
    );

    quotes = filteredQuotes;
  }
  if (lengths && lengths.length > 0) {
    quotes = filterByLength(quotes, lengths);
  }
  return quotes;
};
