import { LanguageModel } from "./LanguageModel";

export interface I18nConfigLocale {
  /**
   * @description Number of concurrently pending promises returned
   */
  concurrency?: number;
  /**
   * @description The entry file or folder
   */
  entry: string;
  /**
   * @description The language that will use as translation ref
   */
  entryLocale: string;
  /**
   * @description ChatGPT model name to use
   */
  modelName?: LanguageModel;
  /**
   * @description Where you store your locale files
   */
  output: string;
  /**
   * @description All languages that need to be translated
   */
  outputLocales: string[];
  /**
   * @description Provide some context for a more accurate translation
   */
  reference?: string;
  /**
   * @description Split locale JSON by token
   */
  splitToken?: number;
  /**
   * @description Sampling temperature to use
   */
  temperature?: number;
  /**
   * @description Nucleus sampling threshold
   */
  topP?: number;
}

export interface I18nConfig extends I18nConfigLocale {
  experimental?: {
    jsonMode?: boolean;
  };
}

export type OptionKeys = keyof I18nConfig;

export interface Config {
  apiBaseUrl: string;
  openaiToken: string;
}

export type ConfigKeys = keyof Config;

export interface ConfigSchemaItem {
  default: string | number | boolean;
  type: "string" | "number" | "boolean";
}

export type ConfigSchema = {
  [key in ConfigKeys]: ConfigSchemaItem;
};
