import { log } from "@clack/prompts";
import chalk from "chalk";

import { OptionKeys } from "@/types/config";

export const checkOptionKeys = (opt: any, key: OptionKeys) => {
  if (!opt[key]) {
    log.error(`Can't find ${chalk.bold.yellow("outputLocales")} in config`);
  }
};
