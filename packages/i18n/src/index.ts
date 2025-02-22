import type { I18nConfig } from "./types/config";

export type Config = I18nConfig;
export let defineConfig = (config: Partial<Config>): Config => {
  return config as Config;
};
