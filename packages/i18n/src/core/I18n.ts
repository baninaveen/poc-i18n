import { merge } from "lodash-es";
import pMap from "p-map";

import { LocaleObj } from "@/types";
import { I18nConfig } from "@/types/config";
import { calcToken } from "@/utils/calToken";
import { mergeJsonFromChunks } from "@/utils/mergeJsonFromChunks";
import { splitJsonToChunks } from "@/utils/splitJsonFromChunks";

import { TranslateLocale } from "./TranslateLocale";

export interface I18nOptions {
  config: I18nConfig;
  openAIApiKey: string;
  openAIProxyUrl: string;
}

export interface onProgressProps {
  isLoading: boolean;
  maxStep: number;
  needToken?: number;
  progress: number;
  step: number;
}
export interface I18nTranslateOptions {
  entry: LocaleObj;
  from?: string;
  onProgress?: (props: onProgressProps) => void;
  target: LocaleObj;
  to: string;
}

export interface I18nWriteOptions extends I18nTranslateOptions {
  filename: string;
}

export class I18n {
  private config: I18nConfig;
  private step: number = 0;
  private maxStep: number = 1;
  private translateLocaleService: TranslateLocale;
  constructor({ openAIApiKey, openAIProxyUrl, config }: I18nOptions) {
    this.config = config;
    this.translateLocaleService = new TranslateLocale(config, openAIApiKey, openAIProxyUrl);
  }

  async translate({ entry, target, to, onProgress, from }: I18nTranslateOptions): Promise<
    | {
        result: LocaleObj;
        tokenUsage: number;
      }
    | undefined
  > {
    const prompt = await this.translateLocaleService.promptJson.formatMessages({
      from,
      json: {},
      to,
    });
    const splitJson = splitJsonToChunks(this.config, entry, target, JSON.stringify(prompt));

    this.maxStep = splitJson.length;
    this.step = 0;

    if (splitJson.length === 0) return;

    const needToken = splitJson.length * calcToken(JSON.stringify(prompt)) + calcToken(JSON.stringify(splitJson));

    onProgress?.({
      isLoading: true,
      maxStep: this.maxStep,
      needToken,
      progress: 0,
      step: 0,
    });

    const translatedSplitJson: LocaleObj[] = await pMap(
      splitJson,
      async (json) => {
        onProgress?.({
          isLoading: this.step < this.maxStep,
          maxStep: this.maxStep,
          needToken,
          progress: this.step < this.maxStep ? Math.floor((this.step / this.maxStep) * 100) : 100,
          step: this.step,
        });
        const result = await this.translateLocaleService.runByJson({
          from,
          json,
          to,
        });
        if (this.step < this.maxStep) this.step++;
        return result;
      },
      { concurrency: this.config?.concurrency }
    );

    onProgress?.({
      isLoading: false,
      maxStep: this.maxStep,
      needToken,
      progress: 100,
      step: this.maxStep,
    });

    const result = await merge(target, mergeJsonFromChunks(translatedSplitJson));

    return {
      result,
      tokenUsage: needToken + calcToken(JSON.stringify(translatedSplitJson)),
    };
  }
}
