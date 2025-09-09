import {
  Space_Mono as Code,
  Pathway_Extreme as Display,
  Figtree as Text,
} from "next/font/google";

export const display = Display({
  subsets: ["latin"],
  variable: "--display-family",
});

export const text = Text({
  subsets: ["latin"],
  variable: "--text-family",
});

export const code = Code({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--code-family",
});
