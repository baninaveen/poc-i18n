#!/usr/bin/env node
import { Command, Option } from "commander";
import updateNotifier from "update-notifier";

import packageJson from "@/../package.json";
import { TranslateLocale } from "@/commands";
import { explorer } from "@/store/config";

const notifier = updateNotifier({
  pkg: packageJson,
  shouldNotifyInNpmScript: true,
});

notifier.notify({ isGlobal: true });

const program = new Command();

interface Flags {
  config?: string;
  option?: boolean;
  withMd?: boolean;
}

program
  .name("optum-i18n")
  .description(packageJson.description)
  .version(packageJson.version)
  .addOption(new Option("-o, --option", "Setup optum-i18n preferences"))
  .addOption(new Option("-c, --config <string>", "Specify the configuration file"));

program.command("locale", { isDefault: true }).action(async () => {
  const options: Flags = program.opts();
  if (options.config) explorer.loadCustomConfig(options.config);
  await new TranslateLocale().start();
});
program.parse();
