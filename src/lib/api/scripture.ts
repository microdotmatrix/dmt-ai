import { env } from "@/lib/env/server";

export interface ScriptureProps {
  id: string;
  book: string;
  ref: string;
  text: string;
}

export const searchBibleText = async (keyword: string) => {
  const bibleVersionID = "06125adad2d5898a-01";
  const offset = 0;

  const response = await fetch(
    `https://api.scripture.api.bible/v1/bibles/${bibleVersionID}/search?query=${keyword}&offset=${offset}`,
    {
      headers: {
        "api-key": env.BIBLE_API_KEY!,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Bible text");
  }

  const json = await response.json();

  return json.data.verses.map(
    (verse: {
      id: string;
      bookId: string;
      reference: string;
      text: string;
    }) => ({
      id: verse.id,
      book: verse.bookId,
      ref: verse.reference,
      text: verse.text,
    })
  );
};

export const searchQuranText = async (keyword: string) => {
  const response = await fetch(
    `http://api.alquran.cloud/v1/search/${keyword}/all/en`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Quran text");
  }

  const json = await response.json();

  return json.data.matches.map(
    (match: {
      numberInSurah: string;
      surah: { englishName: string; englishNameTranslation: string };
      text: string;
    }) => ({
      id: match.numberInSurah,
      book: match.surah.englishName,
      ref: match.surah.englishNameTranslation,
      text: match.text,
    })
  );
};

export const searchScripture = async ({
  keyword,
  ref,
  faith,
  limit = 50,
}: {
  keyword: string;
  ref: string;
  faith: string;
  limit?: number;
}) => {
  let result: ScriptureProps[] = [];
  if (faith === "Christianity") {
    result = await searchBibleText(keyword);
    if (ref) {
      result = result
        .filter(
          (item) =>
            item.ref.toLowerCase() ||
            item.book.toLowerCase() === ref.toLowerCase()
        )
        .slice(0, limit);
    }
  } else if (faith === "Islam") {
    result = await searchQuranText(keyword);
    if (ref) {
      result = result
        .filter(
          (item) =>
            item.ref.toLowerCase() ||
            item.book.toLowerCase() === ref.toLowerCase()
        )
        .slice(0, limit);
    }
  }

  return result;
};
