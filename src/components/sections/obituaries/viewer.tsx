"use client";

import { Response } from "@/components/ai/response";

interface ObituaryViewerProps {
  id?: string;
  content?: string;
}

export const ObituaryViewer = ({ id, content }: ObituaryViewerProps) => {
  return (
    <div className="loading-fade">
      <Response key={id}>{content}</Response>
    </div>
  );
};
