import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const models = [
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "deepseek", label: "DeepSeek" },
  { value: "gemini", label: "Gemini" },
  { value: "kimi", label: "Kimi K2" },
];

export const ModelSelector = () => {
  return (
    <>
      <div className="flex flex-row items-center gap-4 px-4 md:px-0 lg:max-w-sm mx-auto md:mr-0">
        <Label htmlFor="languageModel">Language Model *</Label>
        <div className="flex-1">
          <Select>
            <SelectTrigger className="w-full" disabled>
              <SelectValue placeholder="Select model..." />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center text-balance px-4">
        * Model selection coming soon... Our tool currently uses OpenAI's GPT-4o
        model.
      </p>
    </>
  );
};
