import Conf from "conf";
import { PublicExplorerSync, cosmiconfigSync } from "cosmiconfig";

import { ConfigSchema } from "@/types/config";

export const schema: ConfigSchema = {
  apiBaseUrl: {
    default: "",
    type: "string",
  },
  openaiToken: {
    default:
      "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",
    type: "string",
  },
};
export const config = new Conf({
  projectName: "lobe-i18n",
  schema,
});

class ExplorerConfig {
  explorer: PublicExplorerSync;
  customConfig?: string;
  constructor() {
    this.explorer = cosmiconfigSync("i18n");
  }

  loadCustomConfig(pathToConfig: string) {
    this.customConfig = pathToConfig;
  }

  getConfigFile() {
    if (this.customConfig) return this.explorer.load(this.customConfig)?.config;
    return this.explorer.search()?.config;
  }
}

export const explorer = new ExplorerConfig();
