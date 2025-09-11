"use client";

import { Response } from "@/components/ai/response";

interface ObituaryViewerProps {
  id?: string;
  content?: string;
}

export const ObituaryViewer = ({ id, content }: ObituaryViewerProps) => {
  return (
    <div className="loading-fade prose dark:prose-invert prose-md lg:prose-lg max-w-4xl lg:mx-12">
      <Response key={id}>{content}</Response>
    </div>
  );
};
