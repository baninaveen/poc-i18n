import { I18nConfig } from "@/types/config";
import { defaultModel } from "@/types/LanguageModel";

export const DEFAULT_CONFIG: Partial<I18nConfig> = {
  concurrency: 5,
  modelName: defaultModel,
  temperature: 0,
};
