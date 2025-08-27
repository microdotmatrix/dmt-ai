import { unstable_cache as next_unstable_cache } from "next/cache";
import { cache as react_cache } from "react";

// next_unstable_cache doesn't handle deduplication, so we wrap it in React's cache
export const cache = <Inputs extends unknown[], Output>(
  callback: (...args: Inputs) => Promise<Output>,
  key: string[],
  options: { revalidate: number; tags: string[] }
) => react_cache(next_unstable_cache(callback, key, options));
